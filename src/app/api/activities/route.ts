import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db"; // Your Drizzle instance
import { activities } from "@/drizzle/schemas/activities";
import { auth } from "@/lib/auth/auth"; // Better Auth instance

export async function POST(request: NextRequest) {
  try {
    // 1. Validate session with Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authenticatedUserId = session.user.id;

    // 2. Parse request body
    const body = await request.json();
    const { userId, activities: activityData, metadata } = body ?? {};

    // 3. Optional: verify userId matches authenticated user if provided
    if (userId && userId !== authenticatedUserId) {
      console.error(
        `⚠️  User ${authenticatedUserId} attempted to insert data for ${userId}`,
      );
      return NextResponse.json(
        { error: "Forbidden: Cannot insert data for another user" },
        { status: 403 },
      );
    }

    // 4. Validate payload
    if (!Array.isArray(activityData) || activityData.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: activities must be a non-empty array" },
        { status: 400 },
      );
    }

    // 5. Insert session-level activities in a transaction
    const insertedActivities = await db.transaction(async (tx) => {
      const results: any[] = [];

      for (const activity of activityData) {
        const inserted = await tx
          .insert(activities)
          .values({
            userId: authenticatedUserId,

            // Session timing
            timestamp: activity.timestamp, // start
            endTimestamp: activity.end_timestamp,
            durationSeconds: activity.duration_seconds,

            // Activity data
            windowTitle: activity.window_title,
            processName: activity.process_name,
            processPath: activity.process_path,
            platform: activity.platform,

            // Browser
            browserUrl: activity.browser_url,
            browserTabTitle: activity.browser_tab_title,

            // Aggregated metrics
            cpuUsage: activity.cpu_usage,
            memoryUsage: activity.memory_usage,
            mouseMovements: activity.mouse_movements,
            inputEvents: activity.input_events,
            isUserActive: activity.is_user_active,

            // Sample count
            sampleCount: activity.sample_count ?? 1,
          })
          .returning();

        results.push(inserted[0]);
      }

      return results;
    });

    console.log(
      `✅ Inserted ${insertedActivities.length} activity sessions for user ${authenticatedUserId}`,
    );

    return NextResponse.json({
      success: true,
      received: insertedActivities.length,
      metadata: {
        userId: authenticatedUserId,
        sync_timestamp: new Date().toISOString(),
        device_platform: metadata?.device_platform,
        total_records: metadata?.total_records,
        total_sessions: metadata?.total_sessions,
      },
    });
  } catch (error: any) {
    console.error("❌ Error inserting activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

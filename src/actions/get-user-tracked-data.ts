import { desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { activities } from "@/drizzle/schemas";

export async function getUserTrackedData(id: string) {
  const result = await db
    .select({
      id: activities.id,
      timestamp: activities.timestamp,
      endTimestamp: activities.endTimestamp,
      durationSeconds: activities.durationSeconds,
      processName: activities.processName,
      windowTitle: activities.windowTitle,
      browserTabTitle: activities.browserTabTitle,
      browserUrl: activities.browserUrl,
      processPath: activities.processPath,
      platform: activities.platform,
      sampleCount: activities.sampleCount,
      isUserActive: activities.isUserActive,
    })
    .from(activities)
    .where(eq(activities.userId, id))
    .orderBy(desc(activities.timestamp));

  return result;
}

export type GetUserTrackedData = Awaited<ReturnType<typeof getUserTrackedData>>;

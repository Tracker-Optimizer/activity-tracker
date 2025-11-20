import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { activities } from "@/drizzle/schemas";
import { startOfDay } from "@/lib/utils/charts";

export async function getUserTrackedDataBarChart(id: string) {
  const timerLabel = `chart:query:${id}`;
  console.time(timerLabel);

  const today = startOfDay(new Date());
  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - (7 - 1));

  const result = await db
    .select({
      timestamp: activities.timestamp,
      processName: activities.processName,
      durationSeconds: activities.durationSeconds,
      startDate: activities.timestamp,
    })
    .from(activities)
    .where(
      and(
        eq(activities.userId, id),
        gte(activities.timestamp, rangeStart.toISOString()),
      ),
    )
    .orderBy(desc(activities.timestamp));

  console.timeEnd(timerLabel);

  return result;
}

export type GetUserTrackedDataBarChart = Awaited<
  ReturnType<typeof getUserTrackedDataBarChart>
>;

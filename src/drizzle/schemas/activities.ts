import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth"; // Better Auth user table

// We still call it `activities`, but each row is a *session*.
export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Session timing
    timestamp: timestamp("timestamp", { mode: "string" }).notNull(), // session start
    endTimestamp: timestamp("end_timestamp", { mode: "string" }).notNull(), // session end
    durationSeconds: integer("duration_seconds").notNull(), // total seconds in session

    // Activity data
    windowTitle: text("window_title"),
    processName: text("process_name"),
    processPath: text("process_path"),
    platform: text("platform"),

    // Browser-specific
    browserUrl: text("browser_url"),
    browserTabTitle: text("browser_tab_title"),

    // Aggregated metrics (session-level)
    cpuUsage: real("cpu_usage"), // average CPU for the session
    memoryUsage: real("memory_usage"), // average memory for the session
    mouseMovements: integer("mouse_movements").default(0), // total over session
    inputEvents: integer("input_events").default(0), // total over session
    isUserActive: boolean("is_user_active").default(true), // any sample active?

    // How many raw samples went into this session
    sampleCount: integer("sample_count").default(1),

    // Timestamps
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("activities_user_id_idx").on(table.userId),
    timestampIdx: index("activities_timestamp_idx").on(table.timestamp),
    userTimestampIdx: index("activities_user_timestamp_idx").on(
      table.userId,
      table.timestamp,
    ),
  }),
);

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

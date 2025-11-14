import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schemas/index";

const pool = new Pool({
  // biome-ignore lint/style/noNonNullAssertion: We are sure about the presence
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schemas/index";

// biome-ignore lint/style/noNonNullAssertion: We are sure about the presence
export const db = drizzle(process.env.DATABASE_URL!, { schema });

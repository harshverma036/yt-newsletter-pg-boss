import dotenv from "dotenv";
dotenv.config();

import { PgBoss } from "pg-boss";

const boss = new PgBoss({
  connectionString: process.env.DATABASE_URL as string,
  backend: "postgres" as const,
  persistWarnings: true,
  warningRetentionDays: 30,
});

export default boss;
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  password: "Admin",
  host: "localhost",
  port: 5432,
  database: "notes_app",
});

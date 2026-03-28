import { pool } from "./config/db.js";

async function run() {
  try {
    await pool.query("ALTER TABLE notes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;");
    console.log("Added created_at to notes");
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
}
run();

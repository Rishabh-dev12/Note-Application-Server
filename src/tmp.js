import { pool } from "./config/db.js";

async function run() {
  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'notes'");
  console.log('Notes Schema:', res.rows);
  const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
  console.log('Users Schema:', res2.rows);
  process.exit();
}
run();

import { pool } from "./config/db.js";
import fs from "fs";

async function run() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'notes'");
    fs.writeFileSync("db_columns.json", JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();

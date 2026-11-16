import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function check() {
  const users = await sql`SELECT id, name, email, role FROM users`;
  console.log(users);
  await sql.end();
}

check();

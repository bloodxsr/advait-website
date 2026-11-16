import postgres from "postgres";
import bcrypt from "bcryptjs";
import "dotenv/config";

const sql = postgres(process.env.DIRECT_URL || process.env.DATABASE_URL);

async function check() {
  const users = await sql`SELECT id, name, email, role, password_hash FROM users`;
  for (const u of users) {
    console.log(`User: ${u.email} (${u.role})`);
    const testPasswords = ["advait2026admin", "advait2026member", "bivash123", "password", "password123", "123456", "advait2026"];
    for (const p of testPasswords) {
      const match = await bcrypt.compare(p, u.password_hash);
      if (match) {
        console.log(`  -> MATCH: password is "${p}"`);
      }
    }
  }
  await sql.end();
}

check();

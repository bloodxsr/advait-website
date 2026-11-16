import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sql = postgres(process.env.DIRECT_URL || process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Setting up clean foundation (divisions, subtopics, admin account)...");

  // 1. Official Working Divisions
  const divisionsData = [
    {
      name: "Research & Engineering",
      slug: "RED",
      badge: "Engineering",
      desc: "Kernel runtimes, edge model quantization, WebGPU shaders, and distributed multi-agent consensus architectures.",
      order: 1,
    },
    {
      name: "Outreach, PR & Sponsorships",
      slug: "OPS",
      badge: "Ecosystem",
      desc: "Corporate partnerships, university alliances, developer grants, and external communications for open scholarship.",
      order: 2,
    },
    {
      name: "Events & Ventures Execution",
      slug: "EVED",
      badge: "Operations",
      desc: "Architecture salons, quarterly hackathons, technical workshop cohorts, and incubator venture spinouts.",
      order: 3,
    },
    {
      name: "Creatives & Social Media",
      slug: "Creatives",
      badge: "Design",
      desc: "Design systems, generative visual identity, product UI/UX, typography, and community narrative dispatches.",
      order: 4,
    },
    {
      name: "Game Development Division",
      slug: "GameVeda",
      badge: "Interactive",
      desc: "Neural physics engines, procedural world synthesis, Vulkan pipelines, and immersive digital artifacts.",
      order: 5,
    },
  ];

  for (const div of divisionsData) {
    const existing = await db
      .select()
      .from(schema.divisions)
      .where(eq(schema.divisions.slug, div.slug));
    if (existing.length === 0) {
      await db.insert(schema.divisions).values(div);
    }
  }

  const redDiv = (
    await db
      .select()
      .from(schema.divisions)
      .where(eq(schema.divisions.slug, "RED"))
  )[0];

  // 2. Subtopics
  const subtopicsData = [
    { name: "Distributed Systems", slug: "distributed-systems", scope: "project" },
    { name: "Autonomous Agents", slug: "autonomous-agents", scope: "project" },
    { name: "Zero Knowledge & Cryptography", slug: "zk-cryptography", scope: "project" },
    { name: "Neural Compilers", slug: "neural-compilers", scope: "post" },
    { name: "Local Runtimes", slug: "local-runtimes", scope: "post" },
    { name: "Architecture Salons", slug: "architecture-salons", scope: "post" },
    { name: "Game Architecture", slug: "game-architecture", scope: "project" },
    { name: "Generative Systems", slug: "generative-systems", scope: "post" },
  ];

  for (const sub of subtopicsData) {
    const existing = await db
      .select()
      .from(schema.subtopics)
      .where(eq(schema.subtopics.name, sub.name));
    if (existing.length === 0) {
      await db.insert(schema.subtopics).values(sub);
    }
  }

  // 3. Lead Architect Admin Account
  const adminEmail = "admin@advait.collective";
  const existingAdmin = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, adminEmail));

  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash("advait2026admin", 10);
    await db.insert(schema.users).values({
      name: "Advait Administrator",
      email: adminEmail,
      passwordHash,
      role: "admin",
      headline: "Lead Architect · Advait Collective",
      year: "Lead",
      section: "Core",
      department: "AI & Distributed Systems",
      bio: "Core platform administration for the Advait Collective.",
      divisionId: redDiv?.id,
      isLeader: true,
    });
    console.log("✓ Admin account created: admin@advait.collective (password: advait2026admin)");
  }

  // 4. Official Social Links
  const socials = [
    { platform: "instagram", title: "Instagram", url: "https://instagram.com", order: 1 },
    { platform: "github", title: "GitHub", url: "https://github.com", order: 2 },
    { platform: "twitter", title: "X / Twitter", url: "https://x.com", order: 3 },
    { platform: "discord", title: "Discord", url: "https://discord.com", order: 4 },
    { platform: "youtube", title: "YouTube", url: "https://youtube.com", order: 5 },
  ];

  for (const s of socials) {
    const existing = await db
      .select()
      .from(schema.socialLinks)
      .where(eq(schema.socialLinks.platform, s.platform));
    if (existing.length === 0) {
      await db.insert(schema.socialLinks).values(s);
    }
  }

  console.log("✨ Clean foundation ready. ZERO mock projects, posts, events, or resources.");
  await sql.end();
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});

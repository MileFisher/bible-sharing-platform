import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "broken101284@gmail.com";
// Override with: SEED_ADMIN_PASSWORD=yourpass npx prisma db seed
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  // Create or promote the admin user (idempotent)
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "admin",
      banned: false,
      password: hashedPassword,
    },
    create: {
      email: ADMIN_EMAIL,
      name: "Admin",
      role: "admin",
      password: hashedPassword,
    },
  });

  console.log(`✔ Admin user ready: ${admin.email} (role: ${admin.role})`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);

  // Generate a starter invite token so you can test registration immediately
  const token = randomBytes(24).toString("hex");
  await prisma.inviteToken.create({
    data: {
      token,
      createdByAdminId: admin.id,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  console.log(`\n✔ Starter invite token created:`);
  console.log(`  ${baseUrl}/register?token=${token}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

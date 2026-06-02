import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Admin-only endpoint to generate a single-use invite token.
 * Returns the token and a ready-to-share registration URL.
 */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const token = randomBytes(24).toString("hex");

  const invite = await prisma.inviteToken.create({
    data: {
      token,
      createdByAdminId: session.user.id,
    },
    select: { token: true, createdAt: true },
  });

  const baseUrl =
    process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const registerUrl = `${baseUrl}/register?token=${invite.token}`;

  return NextResponse.json(
    { token: invite.token, registerUrl, createdAt: invite.createdAt },
    { status: 201 }
  );
}

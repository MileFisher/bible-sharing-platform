import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

interface RegisterBody {
  token?: string;
  name?: string;
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token, name, email, password } = body;

  // --- Validate input ---
  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "An invite token is required to register." },
      { status: 400 }
    );
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  // --- Validate the invite token ---
  const invite = await prisma.inviteToken.findUnique({ where: { token } });
  if (!invite) {
    return NextResponse.json(
      { error: "This invite token is not valid." },
      { status: 400 }
    );
  }
  if (invite.usedAt) {
    return NextResponse.json(
      { error: "This invite token has already been used." },
      { status: 400 }
    );
  }

  // --- Check for an existing account ---
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // --- Create user + consume token atomically ---
  try {
    const user = await prisma.$transaction(async (tx) => {
      // Re-check the token inside the transaction and consume it.
      // updateMany with a `usedAt: null` guard prevents two concurrent
      // registrations from both claiming the same token.
      const consumed = await tx.inviteToken.updateMany({
        where: { token, usedAt: null },
        data: { usedAt: new Date() },
      });

      if (consumed.count === 0) {
        throw new Error("TOKEN_ALREADY_USED");
      }

      return tx.user.create({
        data: {
          name: name?.trim() || null,
          email,
          password: hashedPassword,
          role: "member",
        },
        select: { id: true, name: true, email: true },
      });
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_ALREADY_USED") {
      return NextResponse.json(
        { error: "This invite token has already been used." },
        { status: 400 }
      );
    }
    // Unique constraint (e.g. email race) or other DB error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

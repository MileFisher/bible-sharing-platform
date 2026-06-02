import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface FollowBody {
  targetUserId?: string;
}

async function parseTarget(
  request: Request
): Promise<
  | { ok: true; followerId: string; targetUserId: string }
  | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let body: FollowBody;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }

  const targetUserId = body.targetUserId;
  if (!targetUserId || typeof targetUserId !== "string") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "targetUserId is required" },
        { status: 400 }
      ),
    };
  }

  if (targetUserId === session.user.id) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "You cannot follow yourself." },
        { status: 400 }
      ),
    };
  }

  return { ok: true, followerId: session.user.id, targetUserId };
}

// Follow a user
export async function POST(request: Request) {
  const parsed = await parseTarget(request);
  if (!parsed.ok) return parsed.response;

  const { followerId, targetUserId } = parsed;

  // Ensure the target exists
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Idempotent: upsert so re-following is a no-op
  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId, followingId: targetUserId },
    },
    create: { followerId, followingId: targetUserId },
    update: {},
  });

  return NextResponse.json({ isFollowing: true }, { status: 200 });
}

// Unfollow a user
export async function DELETE(request: Request) {
  const parsed = await parseTarget(request);
  if (!parsed.ok) return parsed.response;

  const { followerId, targetUserId } = parsed;

  // Idempotent: deleteMany won't throw if the row is already gone
  await prisma.follow.deleteMany({
    where: { followerId, followingId: targetUserId },
  });

  return NextResponse.json({ isFollowing: false }, { status: 200 });
}

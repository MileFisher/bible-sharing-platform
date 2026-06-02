import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { content?: string; verseRef?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, verseRef } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 2000) {
    return NextResponse.json(
      { error: "Content must be 2000 characters or fewer" },
      { status: 400 }
    );
  }

  const title = content.trim().slice(0, 80) + (content.trim().length > 80 ? "…" : "");

  const post = await prisma.post.create({
    data: {
      title,
      content: content.trim(),
      verseRef: verseRef?.trim() || null,
      authorId: session.user.id,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}

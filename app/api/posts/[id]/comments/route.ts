import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/posts/[id]/comments — list all (non-deleted) comments for a post
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id;

  const comments = await prisma.comment.findMany({
    where: { postId, deleted: false },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json({ comments });
}

// POST /api/posts/[id]/comments — add a comment (auth required)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = params.id;

  let body: { content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = body.content?.trim();

  if (!content || content.length === 0) {
    return NextResponse.json(
      { error: "Comment cannot be empty" },
      { status: 400 }
    );
  }

  if (content.length > 1000) {
    return NextResponse.json(
      { error: "Comment must be 1000 characters or fewer" },
      { status: 400 }
    );
  }

  // Ensure the post exists and is not deleted
  const post = await prisma.post.findFirst({
    where: { id: postId, deleted: false },
    select: { id: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}

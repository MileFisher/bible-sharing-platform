"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Lang } from "@/lib/i18n";

async function requireAdmin(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }
  if (session.user.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return session.user.id;
}

export async function toggleLike(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be signed in to like a post.");
  }

  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
  }

  revalidatePath("/feed");
}

export async function deletePost(postId: string) {
  const adminId = await requireAdmin();

  // Soft-delete the post and all of its comments together
  await prisma.$transaction([
    prisma.post.update({
      where: { id: postId },
      data: { deleted: true },
    }),
    prisma.comment.updateMany({
      where: { postId, deleted: false },
      data: { deleted: true },
    }),
  ]);

  await prisma.actionLog.create({
    data: {
      action: "DELETE_POST",
      targetId: postId,
      adminId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/feed");
}

export async function toggleBanUser(userId: string) {
  const adminId = await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { banned: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const newBanned = !user.banned;

  await prisma.user.update({
    where: { id: userId },
    data: { banned: newBanned },
  });

  await prisma.actionLog.create({
    data: {
      action: newBanned ? "BAN_USER" : "UNBAN_USER",
      targetId: userId,
      adminId,
    },
  });

  revalidatePath("/admin");
}

export async function updateProfile(
  name: string,
  bio: string
): Promise<{ userId: string; name: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be signed in to edit your profile.");
  }

  const userId = session.user.id;
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    throw new Error("Name is required.");
  }
  if (trimmedName.length > 80) {
    throw new Error("Name must be 80 characters or fewer.");
  }

  const trimmedBio = bio.trim();
  if (trimmedBio.length > 280) {
    throw new Error("Bio must be 280 characters or fewer.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: trimmedName,
      bio: trimmedBio.length > 0 ? trimmedBio : null,
    },
  });

  revalidatePath(`/profile/${userId}`);

  // Navigation + session refresh happen client-side so the new name can be
  // pushed into the NextAuth JWT via session.update() before redirecting.
  return { userId, name: trimmedName };
}

export async function updateLanguage(lang: Lang): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  if (lang !== "zh" && lang !== "en") {
    throw new Error("Invalid language.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { language: lang },
  });

  revalidatePath("/feed");
}

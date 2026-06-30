import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/PostCard";
import { FollowButton } from "@/components/FollowButton";
import type { Lang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const lang: Lang = session?.user?.language === "en" ? "en" : "zh";
  const isOwnProfile = currentUserId === id;

  const profile = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      role: true,
      banned: true,
      createdAt: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const initials = getInitials(profile.name);
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Suspended accounts: hide their content
  if (profile.banned) {
    return (
      <div className="max-w-[760px] mx-auto px-4 py-16">
        <div className="card p-12 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-5 opacity-60"
            style={{
              background: "linear-gradient(135deg, #8a9499, #6f797e)",
              color: "white",
              fontFamily: "var(--font-inter)",
            }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <p
            className="text-lg italic"
            style={{ fontFamily: "var(--font-playfair)", color: "#7a9198" }}
          >
            This account has been suspended.
          </p>
        </div>
      </div>
    );
  }

  // Counts + follow state run in parallel
  const [followerCount, followingCount, viewerFollow] = await Promise.all([
    prisma.follow.count({ where: { followingId: id } }),
    prisma.follow.count({ where: { followerId: id } }),
    currentUserId && !isOwnProfile
      ? prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: id,
            },
          },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  const isFollowingProfile = Boolean(viewerFollow);

  const posts = await prisma.post.findMany({
    where: { authorId: id, deleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: {
        select: { likes: true, comments: { where: { deleted: false } } },
      },
    },
    take: 50,
  });

  // Which of these posts the current viewer has liked / bookmarked
  let likedPostIds = new Set<string>();
  let bookmarkedPostIds = new Set<string>();
  if (currentUserId && posts.length > 0) {
    const [likes, bookmarks] = await Promise.all([
      prisma.like.findMany({
        where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
        select: { postId: true },
      }),
      prisma.bookmark.findMany({
        where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
        select: { postId: true },
      }),
    ]);
    likedPostIds = new Set(likes.map((l) => l.postId));
    bookmarkedPostIds = new Set(bookmarks.map((b) => b.postId));
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      {/* Profile header */}
      <header className="card p-6 mb-8">
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold shrink-0"
            style={{
              background: "linear-gradient(135deg, #46707e, #3d6672)",
              color: "white",
              fontFamily: "var(--font-inter)",
            }}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1
                  className="text-[24px] font-semibold leading-tight truncate"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    color: "#22393c",
                  }}
                >
                  {profile.name ?? "Anonymous"}
                </h1>
                <p className="text-xs text-[#7a9198] mt-0.5">
                  Member since {memberSince}
                </p>
              </div>

              {/* Action button */}
              {isOwnProfile ? (
                <Link
                  href="/profile/edit"
                  className="shrink-0 text-[13px] font-semibold rounded-full px-4 py-1.5 transition-colors"
                  style={{
                    border: "1.5px solid #46707e",
                    color: "#46707e",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  Edit Profile
                </Link>
              ) : (
                currentUserId && (
                  <div className="shrink-0">
                    <FollowButton
                      targetUserId={profile.id}
                      initialIsFollowing={isFollowingProfile}
                    />
                  </div>
                )
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-[#3a4f52] leading-relaxed mt-3 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4">
              <Link href="/members" className="group">
                <span className="text-sm font-semibold text-[#22393c]">
                  {followerCount}
                </span>{" "}
                <span className="text-sm text-[#7a9198] group-hover:text-[#46707e]">
                  Follower{followerCount !== 1 ? "s" : ""}
                </span>
              </Link>
              <Link href="/members" className="group">
                <span className="text-sm font-semibold text-[#22393c]">
                  {followingCount}
                </span>{" "}
                <span className="text-sm text-[#7a9198] group-hover:text-[#46707e]">
                  Following
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Posts section */}
      <section>
        <h2
          className="text-[18px] font-semibold mb-4"
          style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
        >
          Notes{" "}
          <span className="text-sm font-normal text-[#7a9198]">
            ({posts.length})
          </span>
        </h2>

        <div className="flex flex-col gap-4">
          {posts.length === 0 && (
            <div className="card p-12 text-center">
              <p
                className="text-lg italic"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#7a9198",
                }}
              >
                No notes shared yet.
              </p>
            </div>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              verseRef={post.verseRef}
              createdAt={post.createdAt}
              author={post.author}
              likeCount={post._count.likes}
              commentCount={post._count.comments}
              isLiked={likedPostIds.has(post.id)}
              isBookmarked={bookmarkedPostIds.has(post.id)}
              lang={lang}
              currentUserId={currentUserId}
              isFollowingAuthor={isFollowingProfile}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

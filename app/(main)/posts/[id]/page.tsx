import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LikeButton } from "@/components/LikeButton";
import { CommentSection } from "@/components/CommentSection";
import { FollowButton } from "@/components/FollowButton";
import { TrendingVerses } from "@/components/RightSidebar";
import { displayTitle, parseContentBlocks } from "@/lib/posts";

export const dynamic = "force-dynamic";

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const post = await prisma.post.findFirst({
    where: { id: params.id, deleted: false },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: {
        select: { likes: true, comments: { where: { deleted: false } } },
      },
      likes: {
        where: { userId: currentUserId ?? "" },
        select: { id: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const isLiked = post.likes.length > 0;

  // Related: up to 3 other non-deleted posts by the same author.
  const related = await prisma.post.findMany({
    where: {
      authorId: post.author.id,
      deleted: false,
      id: { not: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true, content: true, verseRef: true },
  });

  // Is the viewer following the author?
  let isFollowingAuthor = false;
  if (currentUserId && currentUserId !== post.author.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: post.author.id,
        },
      },
    });
    isFollowingAuthor = Boolean(follow);
  }

  const heading = displayTitle(post.title, post.content);
  const blocks = parseContentBlocks(post.content);
  const dateLabel = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 lg:py-8">
      {/* Back */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#46707e] hover:underline mb-6"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        ← Feed
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main article */}
        <article className="flex-1 min-w-0 max-w-[720px]">
          {/* Author row */}
          <div className="flex items-center gap-3 mb-5">
            <Link
              href={`/profile/${post.author.id}`}
              className="flex items-center gap-3 group"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #46707e, #3d6672)",
                  color: "white",
                  fontFamily: "var(--font-inter)",
                }}
                aria-hidden="true"
              >
                {initials(post.author.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#22393c] group-hover:underline">
                  {post.author.name ?? "Anonymous"}
                </p>
                <p className="text-xs text-[#7a9198]">{dateLabel}</p>
              </div>
            </Link>
            {currentUserId && currentUserId !== post.author.id && (
              <div className="ml-auto">
                <FollowButton
                  targetUserId={post.author.id}
                  initialIsFollowing={isFollowingAuthor}
                  variant="compact"
                />
              </div>
            )}
          </div>

          {/* Verse pill */}
          {post.verseRef && (
            <div className="mb-4">
              <span className="verse-pill inline-block">{post.verseRef}</span>
            </div>
          )}

          {/* Title */}
          <h1
            className="text-[28px] font-bold leading-[1.2] text-[#22393c] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {heading}
          </h1>

          {/* Content with blockquote support */}
          <div className="flex flex-col gap-4 mb-8">
            {blocks.map((block, i) =>
              block.type === "quote" ? (
                <blockquote
                  key={i}
                  className="verse-callout pl-5 pr-4 py-4"
                >
                  <p
                    className="text-[17px] italic text-[#3a4f52] leading-relaxed"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {block.text}
                  </p>
                </blockquote>
              ) : (
                <p
                  key={i}
                  className="text-[16px] text-[#3a4f52] leading-[1.7] whitespace-pre-wrap"
                >
                  {block.text}
                </p>
              )
            )}
          </div>

          {/* Like */}
          <div className="mb-8">
            <LikeButton
              postId={post.id}
              initialLiked={isLiked}
              initialCount={post._count.likes}
              canLike={Boolean(currentUserId)}
            />
          </div>

          {/* Comments */}
          <div id="comments" className="border-t border-[#e8e6dc] pt-6">
            <h2
              className="text-[18px] font-semibold text-[#22393c] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Reflections
            </h2>
            <CommentSection
              postId={post.id}
              initialCount={post._count.comments}
              canComment={Boolean(currentUserId)}
            />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-5 w-[300px] shrink-0">
          {related.length > 0 && (
            <div className="card p-5">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4 text-[#7a9198]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                More from {post.author.name ?? "this author"}
              </p>
              <ul className="flex flex-col gap-4">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/posts/${r.id}`} className="block group">
                      {r.verseRef && (
                        <p className="text-xs text-[#46707e] mb-0.5">
                          {r.verseRef}
                        </p>
                      )}
                      <p
                        className="text-sm font-semibold text-[#22393c] leading-snug group-hover:text-[#46707e] transition-colors"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {displayTitle(r.title, r.content)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <TrendingVerses />
        </aside>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/PostCard";
import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const currentUserId = session.user.id;
  const lang: Lang = session.user.language === "en" ? "en" : "zh";
  const strings = getT(lang);

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: currentUserId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      post: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: {
            select: { likes: true, comments: { where: { deleted: false } } },
          },
          likes: {
            where: { userId: currentUserId },
            select: { id: true },
          },
        },
      },
    },
  });

  // Filter out bookmarks whose posts were deleted
  const posts = bookmarks
    .filter((b) => !b.post.deleted)
    .map((b) => b.post);

  // Check which of these posts the viewer is following the author of
  let followingIds = new Set<string>();
  if (currentUserId && posts.length > 0) {
    const follows = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    followingIds = new Set(follows.map((f) => f.followingId));
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <h1
        className="text-[28px] font-semibold mb-2 text-[#22393c]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {strings.bookmarks}
      </h1>
      <p className="text-sm text-[#7a9198] mb-8">
        {lang === "zh" ? "您儲存的筆記會顯示在這裡。" : "Notes you save will appear here."}
      </p>

      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <p
            className="text-lg italic text-[#7a9198]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {lang === "zh"
              ? "您尚未儲存任何筆記。"
              : "You haven’t saved any notes yet."}
          </p>
          <p className="text-sm text-[#b5b4a6] mt-2">
            {lang === "zh"
              ? "點擊筆記上的書籤圖示即可儲存。"
              : "Tap the bookmark icon on a note to save it for later."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
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
              isLiked={post.likes.length > 0}
              isBookmarked={true}
              lang={lang}
              currentUserId={currentUserId}
              isFollowingAuthor={followingIds.has(post.author.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

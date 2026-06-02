import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/PostCard";
import { NewPostForm } from "@/components/NewPostForm";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  let posts;

  if (currentUserId) {
    // Get IDs of users the current user follows
    const follows = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);

    // Include own posts + followed users' posts
    const authorIds = [currentUserId, ...followingIds];

    posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds }, deleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { likes: true, comments: { where: { deleted: false } } },
        },
        likes: {
          where: { userId: currentUserId },
          select: { id: true },
        },
      },
      take: 50,
    });
  } else {
    // Not signed in — show all posts (public feed)
    posts = await prisma.post.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { likes: true, comments: { where: { deleted: false } } },
        },
      },
      take: 50,
    });
  }

  return (
    <div>
      <div className="max-w-[760px] mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1
            className="text-[40px] font-semibold tracking-[-0.01em] leading-[1.15] mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
          >
            Community Feed
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
          >
            {posts.length} note{posts.length !== 1 ? "s" : ""} today
          </p>
        </header>

        {/* New post form — only if signed in */}
        {currentUserId && <NewPostForm />}

        {/* Post list */}
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
                No notes yet. Follow community members to see their reflections
                here.
              </p>
            </div>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              verseRef={post.verseRef}
              createdAt={post.createdAt}
              author={post.author}
              likeCount={post._count.likes}
              commentCount={post._count.comments}
              isLiked={"likes" in post ? (post as { likes: { id: string }[] }).likes.length > 0 : false}
              currentUserId={currentUserId}
              isFollowingAuthor={post.author.id !== currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

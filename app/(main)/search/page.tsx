import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const q = searchParams.q?.trim() ?? "";

  let posts: Awaited<ReturnType<typeof searchPosts>> = [];
  let followingIds = new Set<string>();

  if (q) {
    posts = await searchPosts(q, currentUserId);
    if (currentUserId) {
      const follows = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      });
      followingIds = new Set(follows.map((f) => f.followingId));
    }
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <h1
        className="text-[28px] font-semibold mb-5 text-[#22393c]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Search
      </h1>

      <div className="mb-6">
        <SearchBar initialQuery={q} />
      </div>

      {q && (
        <p className="text-sm text-[#7a9198] mb-5">
          {posts.length} result{posts.length !== 1 ? "s" : ""} for{" "}
          <span className="font-semibold text-[#22393c]">“{q}”</span>
        </p>
      )}

      {q && posts.length === 0 && (
        <div className="card p-12 text-center">
          <p
            className="text-lg italic text-[#7a9198]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            No notes match your search.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
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
            isLiked={post.likes.length > 0}
            currentUserId={currentUserId}
            isFollowingAuthor={followingIds.has(post.author.id)}
          />
        ))}
      </div>
    </div>
  );
}

async function searchPosts(q: string, currentUserId: string | undefined) {
  return prisma.post.findMany({
    where: {
      deleted: false,
      OR: [
        { content: { contains: q, mode: "insensitive" } },
        { verseRef: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { author: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
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
}

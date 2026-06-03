import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/PostCard";
import { NewPostForm } from "@/components/NewPostForm";
import { SearchBar } from "@/components/SearchBar";
import { FeedTabs } from "@/components/FeedTabs";
import { RightSidebar } from "@/components/RightSidebar";
import {
  isFeedTab,
  isNewTestament,
  isOldTestament,
  isPsalms,
  type FeedTab,
} from "@/lib/bible";

export const dynamic = "force-dynamic";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  // Resolve the active tab; "following" falls back to "all" when signed out.
  let tab: FeedTab = isFeedTab(searchParams.tab) ? searchParams.tab : "all";
  if (tab === "following" && !currentUserId) tab = "all";

  // Who does the viewer follow (for the follow-button state on each card)?
  let followingIds = new Set<string>();
  if (currentUserId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    followingIds = new Set(follows.map((f) => f.followingId));
  }

  const include = {
    author: { select: { id: true, name: true, image: true } },
    _count: {
      select: { likes: true, comments: { where: { deleted: false } } },
    },
    likes: {
      where: { userId: currentUserId ?? "" },
      select: { id: true },
    },
  } satisfies Prisma.PostInclude;

  type FeedPost = Prisma.PostGetPayload<{ include: typeof include }>;

  let posts: FeedPost[];
  if (tab === "following" && currentUserId) {
    const authorIds = [currentUserId, ...Array.from(followingIds)];
    posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds }, deleted: false },
      orderBy: { createdAt: "desc" },
      take: 50,
      include,
    });
  } else {
    // Public feed — all members' notes. Pull a wide window so the
    // testament filters below still have enough to show.
    const all = await prisma.post.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      take: 100,
      include,
    });

    if (tab === "nt") {
      posts = all.filter((p) => isNewTestament(p.verseRef));
    } else if (tab === "ot") {
      posts = all.filter((p) => isOldTestament(p.verseRef));
    } else if (tab === "psalms") {
      posts = all.filter((p) => isPsalms(p.verseRef));
    } else {
      posts = all;
    }
  }

  const todayCount = await prisma.post.count({
    where: { deleted: false, createdAt: { gte: new Date(Date.now() - ONE_DAY_MS) } },
  });

  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Search */}
      <div className="mb-6 max-w-[640px]">
        <SearchBar />
      </div>

      <div className="xl:flex xl:gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {currentUserId && <NewPostForm />}

          <FeedTabs activeTab={tab} todayCount={todayCount} />

          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <p
                className="text-lg italic text-[#7a9198]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {tab === "following"
                  ? "No notes yet. Follow community members to see their reflections here."
                  : "No notes to show in this view yet."}
              </p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Right sidebar (desktop xl) */}
        <div className="hidden xl:block w-[280px] shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

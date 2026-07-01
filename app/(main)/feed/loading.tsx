import {
  SkeletonBlock,
  SkeletonPostCard,
  SkeletonSidebar,
  SkeletonFeedTabs,
} from "@/components/Skeleton";

export default function FeedLoading() {
  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Search */}
      <div className="mb-6 max-w-[640px]">
        <SkeletonBlock width="100%" height={48} />
      </div>

      <div className="xl:flex xl:gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <SkeletonFeedTabs />

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPostCard key={i} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden xl:block w-[280px] shrink-0">
          <SkeletonSidebar />
        </div>
      </div>
    </div>
  );
}

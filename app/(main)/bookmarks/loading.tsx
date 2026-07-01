import {
  SkeletonBlock,
  SkeletonPostCard,
} from "@/components/Skeleton";

export default function BookmarksLoading() {
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <SkeletonBlock width={180} height={28} className="mb-2" />
      <SkeletonBlock width={260} height={14} className="mb-8" />

      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPostCard key={i} />
        ))}
      </div>
    </div>
  );
}

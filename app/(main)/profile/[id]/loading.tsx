import { SkeletonBlock, SkeletonPostCard } from "@/components/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      {/* Profile header card */}
      <div className="card p-6 mb-8">
        <div className="flex items-start gap-5">
          <SkeletonBlock width={64} height={64} rounded className="shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <SkeletonBlock width={160} height={24} className="mb-1" />
                <SkeletonBlock width={120} height={10} />
              </div>
              <SkeletonBlock width={90} height={28} />
            </div>
            <SkeletonBlock width="80%" height={14} className="mt-3" />
            <div className="flex items-center gap-6 mt-4">
              <SkeletonBlock width={80} height={14} />
              <SkeletonBlock width={80} height={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Notes section */}
      <SkeletonBlock width={80} height={18} className="mb-4" />

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonPostCard key={i} />
        ))}
      </div>
    </div>
  );
}

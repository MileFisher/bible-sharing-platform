import {
  SkeletonPostCard,
  SkeletonSearchHeader,
} from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <SkeletonSearchHeader />

      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPostCard key={i} />
        ))}
      </div>
    </div>
  );
}

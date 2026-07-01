import {
  SkeletonPostDetail,
  SkeletonPostSidebar,
} from "@/components/Skeleton";

export default function PostDetailLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main article */}
        <article className="flex-1 min-w-0 max-w-[720px]">
          <SkeletonPostDetail />
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <SkeletonPostSidebar />
        </aside>
      </div>
    </div>
  );
}

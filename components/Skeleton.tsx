/** Reusable skeleton building blocks for loading states. */

/** Generic shimmer block. */
export function SkeletonBlock({
  width,
  height,
  className = "",
  rounded = false,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: rounded ? "50%" : undefined,
      }}
    />
  );
}

/** Matches PostCard layout: avatar + name/time + verse pill + heading + lines + action bar. */
export function SkeletonPostCard() {
  return (
    <div className="card p-5 flex flex-col">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <SkeletonBlock width={40} height={40} rounded className="shrink-0" />
        <div className="flex-1">
          <SkeletonBlock width="40%" height={14} className="mb-1.5" />
          <SkeletonBlock width="25%" height={10} />
        </div>
      </div>

      {/* Verse pill */}
      <SkeletonBlock width="35%" height={24} className="mb-3" />

      {/* Heading */}
      <SkeletonBlock width="80%" height={20} className="mb-2" />

      {/* Content lines */}
      <SkeletonBlock width="100%" height={14} className="mb-1.5" />
      <SkeletonBlock width="90%" height={14} className="mb-1.5" />
      <SkeletonBlock width="60%" height={14} className="mb-4" />

      {/* Action bar */}
      <div className="flex items-center gap-5 pt-3 border-t border-[#e8e6dc] mt-auto">
        <SkeletonBlock width={32} height={16} />
        <SkeletonBlock width={32} height={16} />
        <SkeletonBlock width={16} height={16} />
        <div className="ml-auto">
          <SkeletonBlock width={50} height={14} />
        </div>
      </div>
    </div>
  );
}

/** Matches post detail page layout. */
export function SkeletonPostDetail() {
  return (
    <div>
      {/* Back link */}
      <SkeletonBlock width={100} height={14} className="mb-6" />

      {/* Author row */}
      <div className="flex items-center gap-3 mb-5">
        <SkeletonBlock width={44} height={44} rounded className="shrink-0" />
        <div>
          <SkeletonBlock width={120} height={14} className="mb-1.5" />
          <SkeletonBlock width={80} height={10} />
        </div>
      </div>

      {/* Verse pill */}
      <SkeletonBlock width="30%" height={24} className="mb-4" />

      {/* Verse callout block */}
      <div
        className="skeleton mb-6"
        style={{
          height: 80,
          borderLeft: "4px solid #d4d3c4",
          borderRadius: "0 12px 12px 0",
        }}
      />

      {/* Content paragraphs */}
      <div className="flex flex-col gap-4 mb-8">
        <SkeletonBlock width="100%" height={16} />
        <SkeletonBlock width="95%" height={16} />
        <SkeletonBlock width="100%" height={16} />
        <SkeletonBlock width="70%" height={16} />
        <SkeletonBlock width="100%" height={16} />
        <SkeletonBlock width="85%" height={16} />
      </div>

      {/* Like button */}
      <SkeletonBlock width={60} height={20} className="mb-8" />

      {/* Comments section */}
      <div className="border-t border-[#e8e6dc] pt-6">
        <SkeletonBlock width={120} height={18} className="mb-4" />
        <SkeletonBlock width="100%" height={80} className="mb-3" />
        <SkeletonBlock width="100%" height={80} />
      </div>
    </div>
  );
}

/** Matches RightSidebar: verse-of-day + trending + active members. */
export function SkeletonSidebar() {
  return (
    <div className="flex flex-col gap-5">
      {/* Verse of the day (dark card) */}
      <div
        className="rounded-[14px] p-5"
        style={{ background: "#22393c" }}
      >
        <SkeletonBlock width="40%" height={10} className="mb-3 !bg-[#2d4f53]" />
        <SkeletonBlock width="90%" height={18} className="mb-1.5 !bg-[#2d4f53]" />
        <SkeletonBlock width="75%" height={18} className="mb-3 !bg-[#2d4f53]" />
        <SkeletonBlock width="30%" height={12} className="!bg-[#2d4f53]" />
      </div>

      {/* Trending verses */}
      <div className="card p-5">
        <SkeletonBlock width="50%" height={10} className="mb-4" />
        <div className="flex flex-col gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock width={16} height={16} className="shrink-0" />
              <div className="flex-1">
                <SkeletonBlock width="70%" height={14} className="mb-1" />
                <SkeletonBlock width="30%" height={10} />
              </div>
              <SkeletonBlock width={40} height={20} />
            </div>
          ))}
        </div>
      </div>

      {/* Active members */}
      <div className="card p-5">
        <SkeletonBlock width="45%" height={10} className="mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <SkeletonBlock width={44} height={44} rounded />
              <SkeletonBlock width="80%" height={8} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Search page header skeleton. */
export function SkeletonSearchHeader() {
  return (
    <div>
      <SkeletonBlock width={200} height={28} className="mb-5" />
      <SkeletonBlock width="100%" height={48} className="mb-6" />
    </div>
  );
}

/** Feed tabs skeleton. */
export function SkeletonFeedTabs() {
  return (
    <div className="flex items-center gap-2 mb-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBlock key={i} width={60} height={32} />
      ))}
    </div>
  );
}

/** Sidebar for post detail — related notes + trending. */
export function SkeletonPostSidebar() {
  return (
    <div className="flex flex-col gap-5">
      {/* Related notes */}
      <div className="card p-5">
        <SkeletonBlock width="60%" height={10} className="mb-4" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <SkeletonBlock width="30%" height={10} className="mb-1" />
              <SkeletonBlock width="85%" height={14} />
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="card p-5">
        <SkeletonBlock width="50%" height={10} className="mb-4" />
        <div className="flex flex-col gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock width={16} height={16} className="shrink-0" />
              <div className="flex-1">
                <SkeletonBlock width="70%" height={14} className="mb-1" />
                <SkeletonBlock width="30%" height={10} />
              </div>
              <SkeletonBlock width={40} height={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

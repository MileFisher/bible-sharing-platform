"use client";

import { useState } from "react";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  variant?: "default" | "compact";
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
  variant = "default",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    // Optimistic update
    const next = !isFollowing;
    setIsFollowing(next);

    try {
      const res = await fetch("/api/follow", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setIsFollowing(Boolean(data.isFollowing));
    } catch {
      // Revert on failure
      setIsFollowing(!next);
    } finally {
      setIsPending(false);
    }
  }

  const compact = variant === "compact";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`font-semibold rounded-full transition-colors disabled:opacity-50 ${
        compact ? "text-xs px-3 py-1" : "text-[13px] px-4 py-1.5"
      }`}
      style={
        isFollowing
          ? {
              background: "rgba(70, 112, 126, 0.12)",
              border: "1.5px solid rgba(70, 112, 126, 0.3)",
              color: "#46707e",
              fontFamily: "var(--font-inter)",
            }
          : {
              background: "transparent",
              border: "1.5px solid #46707e",
              color: "#46707e",
              fontFamily: "var(--font-inter)",
            }
      }
      aria-pressed={isFollowing}
    >
      {isFollowing ? "✓ Following" : "+ Follow"}
    </button>
  );
}

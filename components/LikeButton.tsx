"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/lib/actions";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  canLike: boolean;
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  canLike,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  function handleClick() {
    setLiked((prev) => !prev);
    setCount((prev) => prev + (liked ? -1 : 1));
    startTransition(() => toggleLike(postId));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || !canLike}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
      style={{
        color: liked ? "#c0765c" : "#46707e",
        borderColor: liked ? "rgba(192,118,92,0.4)" : "rgba(70,112,126,0.3)",
        background: liked ? "rgba(192,118,92,0.08)" : "transparent",
        fontFamily: "var(--font-inter)",
      }}
      aria-label={liked ? "Unlike this post" : "Like this post"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={liked ? 0 : 2}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>
        {count} {count === 1 ? "like" : "likes"}
      </span>
    </button>
  );
}

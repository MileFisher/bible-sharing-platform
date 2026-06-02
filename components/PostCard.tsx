"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/lib/actions";
import { FollowButton } from "@/components/FollowButton";
import { CommentSection } from "@/components/CommentSection";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  verseRef: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  currentUserId?: string;
  isFollowingAuthor?: boolean;
}

export function PostCard({
  id,
  title,
  content,
  verseRef,
  createdAt,
  author,
  likeCount,
  commentCount,
  isLiked,
  currentUserId,
  isFollowingAuthor = false,
}: PostCardProps) {
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState(commentCount);

  const initials = author.name
    ? author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const timeAgo = getTimeAgo(new Date(createdAt));

  // Show follow button only for signed-in viewers looking at someone else's post
  const showFollow =
    Boolean(currentUserId) && currentUserId !== author.id;

  return (
    <article className="card p-5">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{
            background: "linear-gradient(135deg, #46707e, #3d6672)",
            color: "white",
            fontFamily: "var(--font-inter)",
          }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#22393c] truncate">
            {author.name ?? "Anonymous"}
          </p>
          <p className="text-xs text-[#7a9198]">{timeAgo}</p>
        </div>
        {showFollow && (
          <FollowButton
            targetUserId={author.id}
            initialIsFollowing={isFollowingAuthor}
            variant="compact"
          />
        )}
      </div>

      {/* Verse reference pill */}
      {verseRef && (
        <div className="mb-3">
          <span className="verse-pill inline-block">{verseRef}</span>
        </div>
      )}

      {/* Title */}
      <h3
        className="text-[16px] font-bold mb-2 leading-[1.35]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h3>

      {/* Content excerpt */}
      <p className="text-sm text-[#3a4f52] leading-relaxed mb-4 line-clamp-4">
        {content}
      </p>

      {/* Action bar */}
      <div className="flex items-center gap-5 pt-3 border-t border-[#e8e6dc]">
        {/* Like button */}
        <button
          onClick={() => startTransition(() => toggleLike(id))}
          disabled={isPending}
          className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
          style={{ color: isLiked ? "#c0765c" : "#7a9198" }}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isLiked ? 0 : 2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        {/* Comment count */}
        <div
          className="flex items-center gap-1.5 text-sm"
          style={{ color: "#7a9198" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{comments}</span>
        </div>
      </div>

      {/* Comments */}
      <CommentSection
        postId={id}
        initialCount={commentCount}
        canComment={Boolean(currentUserId)}
        onCountChange={setComments}
      />
    </article>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

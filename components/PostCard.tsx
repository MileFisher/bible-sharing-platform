"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleLike, toggleBookmark } from "@/lib/actions";
import { FollowButton } from "@/components/FollowButton";
import { displayHeading, previewText, firstQuote } from "@/lib/posts";
import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

interface PostCardProps {
  id: string;
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
  isBookmarked?: boolean;
  lang?: Lang;
  currentUserId?: string;
  isFollowingAuthor?: boolean;
}

export function PostCard({
  id,
  content,
  verseRef,
  createdAt,
  author,
  likeCount,
  commentCount,
  isLiked,
  isBookmarked = false,
  lang = "zh",
  currentUserId,
  isFollowingAuthor = false,
}: PostCardProps) {
  const strings = getT(lang);
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const initials = author.name
    ? author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const timeAgo = getTimeAgo(new Date(createdAt));
  const heading = displayHeading(content);
  const preview = previewText(content);
  const quote = firstQuote(content);
  const href = `/posts/${id}`;

  const showFollow = Boolean(currentUserId) && currentUserId !== author.id;

  function handleLike() {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
    startTransition(() => toggleLike(id));
  }

  function handleBookmark() {
    setBookmarked((prev) => !prev);
    startTransition(() => toggleBookmark(id));
  }

  return (
    <article className="card p-5 flex flex-col">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <Link
          href={`/profile/${author.id}`}
          className="flex items-center gap-3 min-w-0 flex-1 group"
        >
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
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#22393c] truncate group-hover:underline">
              {author.name ?? "Anonymous"}
            </p>
            <p className="text-xs text-[#7a9198]">{timeAgo}</p>
          </div>
        </Link>
        {showFollow && (
          <FollowButton
            targetUserId={author.id}
            initialIsFollowing={isFollowingAuthor}
            variant="compact"
          />
        )}
      </div>

      {/* Clickable content → detail page */}
      <Link href={href} className="block group">
        {verseRef && (
          <div className="mb-3">
            <span className="verse-pill inline-block">{verseRef}</span>
          </div>
        )}

        <h3
          className="text-[20px] font-bold mb-2 leading-[1.3] text-[#22393c] group-hover:text-[#46707e] transition-colors"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {heading}
        </h3>

        {quote && (
          <blockquote className="verse-callout pl-4 pr-3 py-2.5 mb-3">
            <p
              className="text-[15px] italic text-[#3a4f52] leading-relaxed"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {quote}
            </p>
          </blockquote>
        )}

        {preview && (
          <p className="text-sm text-[#3a4f52] leading-relaxed mb-4 line-clamp-3">
            {preview}
          </p>
        )}
      </Link>

      {/* Action bar */}
      <div className="flex items-center gap-5 pt-3 border-t border-[#e8e6dc] mt-auto">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isPending || !currentUserId}
          className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
          style={{ color: liked ? "#c0765c" : "#7a9198" }}
          aria-label={liked ? "Unlike this post" : "Like this post"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={liked ? 0 : 2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likes}</span>
        </button>

        {/* Comment count → detail comments */}
        <Link
          href={`${href}#comments`}
          className="flex items-center gap-1.5 text-sm text-[#7a9198] hover:text-[#46707e] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{commentCount}</span>
        </Link>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          disabled={isPending || !currentUserId}
          className="flex items-center text-sm transition-colors disabled:opacity-50"
          style={{ color: bookmarked ? "#46707e" : "#7a9198" }}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this post"}
          aria-pressed={bookmarked}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Read → */}
        <Link
          href={href}
          className="ml-auto text-sm font-semibold text-[#46707e] hover:underline"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {strings.readMore}
        </Link>
      </div>
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

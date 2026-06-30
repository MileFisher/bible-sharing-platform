"use client";

import { useTransition } from "react";
import { deletePost } from "@/lib/actions";

interface Post {
  id: string;
  content: string;
  deleted: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface AdminPostListProps {
  posts: Post[];
}

export function AdminPostList({ posts }: AdminPostListProps) {
  const [isPending, startTransition] = useTransition();

  if (posts.length === 0) {
    return (
      <p className="text-sm italic" style={{ color: "#7a9198", fontFamily: "var(--font-playfair)" }}>
        No posts found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
        <thead>
          <tr
            className="text-left text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "#7a9198" }}
          >
            <th className="pb-3 pr-4 font-semibold">Author</th>
            <th className="pb-3 pr-4 font-semibold">Content</th>
            <th className="pb-3 pr-4 font-semibold">Date</th>
            <th className="pb-3 pr-4 font-semibold">Status</th>
            <th className="pb-3 font-semibold w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-t"
              style={{ borderColor: "#e8e6dc" }}
            >
              <td className="py-3 pr-4">
                <div>
                  <p className="font-semibold" style={{ color: "#22393c" }}>
                    {post.author.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs" style={{ color: "#7a9198" }}>
                    {post.author.email ?? ""}
                  </p>
                </div>
              </td>
              <td className="py-3 pr-4">
                <p
                  className="line-clamp-2 max-w-xs"
                  style={{ color: "#3a4f52" }}
                >
                  {post.content}
                </p>
              </td>
              <td
                className="py-3 pr-4 text-xs whitespace-nowrap"
                style={{ color: "#7a9198" }}
              >
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="py-3 pr-4">
                {post.deleted ? (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(192, 117, 92, 0.12)",
                      color: "#c0765c",
                    }}
                  >
                    Deleted
                  </span>
                ) : (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(107, 158, 107, 0.12)",
                      color: "#6b9e6b",
                    }}
                  >
                    Live
                  </span>
                )}
              </td>
              <td className="py-3">
                {!post.deleted && (
                  <button
                    onClick={() =>
                      startTransition(() => deletePost(post.id))
                    }
                    disabled={isPending}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    style={{
                      border: "1.5px solid #c0765c",
                      color: "#c0765c",
                      background: "transparent",
                      cursor: isPending ? "not-allowed" : "pointer",
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

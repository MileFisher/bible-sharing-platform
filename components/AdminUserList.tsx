"use client";

import { useTransition } from "react";
import { toggleBanUser } from "@/lib/actions";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  banned: boolean;
  createdAt: Date;
}

interface AdminUserListProps {
  users: User[];
}

export function AdminUserList({ users }: AdminUserListProps) {
  if (users.length === 0) {
    return (
      <p className="text-sm italic" style={{ color: "#7a9198", fontFamily: "var(--font-playfair)" }}>
        No users found.
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
            <th className="pb-3 pr-4 font-semibold">Name</th>
            <th className="pb-3 pr-4 font-semibold">Email</th>
            <th className="pb-3 pr-4 font-semibold">Role</th>
            <th className="pb-3 pr-4 font-semibold">Status</th>
            <th className="pb-3 font-semibold w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-t" style={{ borderColor: "#e8e6dc" }}>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          {/* Avatar initials */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{
              background: "linear-gradient(135deg, #46707e, #3d6672)",
              color: "white",
              fontFamily: "var(--font-inter)",
            }}
          >
            {user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?"}
          </div>
          <p className="font-semibold" style={{ color: "#22393c" }}>
            {user.name ?? "Anonymous"}
          </p>
        </div>
      </td>
      <td
        className="py-3 pr-4 text-xs"
        style={{ color: "#7a9198" }}
      >
        {user.email ?? "—"}
      </td>
      <td className="py-3 pr-4">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            background:
              user.role === "admin"
                ? "rgba(70, 112, 126, 0.12)"
                : "rgba(107, 139, 129, 0.1)",
            color: user.role === "admin" ? "#46707e" : "#6b8b81",
          }}
        >
          {user.role.toUpperCase()}
        </span>
      </td>
      <td className="py-3 pr-4">
        {user.banned ? (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(192, 117, 92, 0.12)",
              color: "#c0765c",
            }}
          >
            BANNED
          </span>
        ) : (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(107, 158, 107, 0.12)",
              color: "#6b9e6b",
            }}
          >
            Active
          </span>
        )}
      </td>
      <td className="py-3">
        <button
          onClick={() =>
            startTransition(() => toggleBanUser(user.id))
          }
          disabled={isPending}
          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
          style={{
            border: user.banned
              ? "1.5px solid #6b9e6b"
              : "1.5px solid #c0765c",
            color: user.banned ? "#6b9e6b" : "#c0765c",
            background: "transparent",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {user.banned ? "Unban" : "Ban"}
        </button>
      </td>
    </tr>
  );
}

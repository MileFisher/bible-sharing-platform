import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FollowButton } from "@/components/FollowButton";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/members");
  }
  const currentUserId = session.user.id;

  // All non-admin members except the current user
  const members = await prisma.user.findMany({
    where: {
      role: { not: "admin" },
      id: { not: currentUserId },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          posts: { where: { deleted: false } },
        },
      },
    },
    take: 200,
  });

  // Which of these the current user already follows
  const follows = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });
  const followingIds = new Set(follows.map((f) => f.followingId));

  return (
    <div>
      <div className="max-w-[760px] mx-auto px-4 py-8">
        <header className="mb-8">
          <h1
            className="text-[40px] font-semibold tracking-[-0.01em] leading-[1.15] mb-2"
            style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
          >
            Members
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
          >
            {members.length} member{members.length !== 1 ? "s" : ""} in your
            community
          </p>
        </header>

        {members.length === 0 ? (
          <div className="card p-12 text-center">
            <p
              className="text-lg italic"
              style={{ fontFamily: "var(--font-playfair)", color: "#7a9198" }}
            >
              No other members yet.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {members.map((member) => {
              const initials = member.name
                ? member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?";

              return (
                <li
                  key={member.id}
                  className="card p-4 flex items-center gap-3"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
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
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "#22393c" }}
                    >
                      {member.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs" style={{ color: "#7a9198" }}>
                      {member._count.posts} note
                      {member._count.posts !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <FollowButton
                    targetUserId={member.id}
                    initialIsFollowing={followingIds.has(member.id)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

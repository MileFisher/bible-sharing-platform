import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminPostList } from "@/components/AdminPostList";
import { AdminUserList } from "@/components/AdminUserList";
import { InviteGenerator } from "@/components/InviteGenerator";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Guard: must be signed in and have the admin role
  if (!session?.user?.id) {
    redirect("/feed");
  }
  if (session.user.role !== "admin") {
    redirect("/feed");
  }

  // Fetch all recent posts (including soft-deleted for visibility)
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
    take: 100,
  });

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
    },
    take: 200,
  });

  return (
    <div className="min-h-screen" style={{ background: "#f4f3ec" }}>
      <div className="max-w-[960px] mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-[38px] font-semibold tracking-[-0.01em] leading-[1.15]"
              style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
            >
              Admin Panel
            </h1>
            <p
              className="text-sm mt-1"
              style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
            >
              Signed in as {session.user.name ?? session.user.email ?? "Admin"}
            </p>
          </div>
          <Link href="/feed" className="btn-ghost shrink-0">
            ← Back to Feed
          </Link>
        </header>

        {/* Invite section */}
        <section className="mb-10">
          <h2
            className="text-[20px] font-semibold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
          >
            Invitations
          </h2>
          <InviteGenerator />
        </section>

        {/* Posts section */}
        <section className="mb-10">
          <h2
            className="text-[20px] font-semibold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
          >
            Recent Posts
          </h2>
          <div className="card p-5">
            <AdminPostList posts={posts} />
          </div>
        </section>

        {/* Users section */}
        <section>
          <h2
            className="text-[20px] font-semibold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
          >
            Users
          </h2>
          <div className="card p-5">
            <AdminUserList users={users} />
          </div>
        </section>
      </div>
    </div>
  );
}

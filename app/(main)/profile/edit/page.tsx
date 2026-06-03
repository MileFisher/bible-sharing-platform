import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileEditForm } from "@/components/ProfileEditForm";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/feed");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, bio: true },
  });

  if (!user) {
    redirect("/feed");
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-8">
      <h1
        className="text-[28px] font-semibold mb-6"
        style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
      >
        Edit Profile
      </h1>

      <div className="card p-6">
        <ProfileEditForm
          initialName={user.name ?? ""}
          initialBio={user.bio ?? ""}
        />
      </div>
    </div>
  );
}

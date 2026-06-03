import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <h1
        className="text-[28px] font-semibold mb-2 text-[#22393c]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Bookmarks
      </h1>
      <p className="text-sm text-[#7a9198] mb-8">
        Notes you save will appear here.
      </p>

      <div className="card p-12 text-center">
        <p
          className="text-lg italic text-[#7a9198]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          You haven&rsquo;t saved any notes yet.
        </p>
        <p className="text-sm text-[#b5b4a6] mt-2">
          Tap the bookmark icon on a note to save it for later.
        </p>
      </div>
    </div>
  );
}

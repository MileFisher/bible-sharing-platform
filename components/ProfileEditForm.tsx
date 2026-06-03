"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/lib/actions";

interface ProfileEditFormProps {
  initialName: string;
  initialBio: string;
}

export function ProfileEditForm({
  initialName,
  initialBio,
}: ProfileEditFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length === 0) {
      setError("Name is required.");
      return;
    }

    startTransition(async () => {
      try {
        const { userId, name: savedName } = await updateProfile(name, bio);
        // Push the new name into the NextAuth JWT so the NavBar (and any
        // other useSession consumer) updates instantly, then navigate.
        await update({ name: savedName });
        router.push(`/profile/${userId}`);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Couldn't save your changes."
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-[#22393c] mb-1.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full rounded-lg border border-[#d8d6ca] bg-white px-3 py-2 text-sm text-[#22393c] focus:outline-none focus:border-[#46707e]"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-semibold text-[#22393c] mb-1.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={280}
          placeholder="Share a little about yourself…"
          className="w-full resize-none rounded-lg border border-[#d8d6ca] bg-white px-3 py-2 text-sm text-[#22393c] focus:outline-none focus:border-[#46707e]"
          style={{ fontFamily: "var(--font-inter)" }}
        />
        <p className="text-xs text-[#7a9198] mt-1">{bio.length}/280</p>
      </div>

      {error && <p className="text-sm text-[#c0765c]">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: "#46707e", fontFamily: "var(--font-inter)" }}
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

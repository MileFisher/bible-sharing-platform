// Bible reference helpers shared across the feed, tabs, and widgets.

/** The 27 books of the New Testament (canonical display names). */
export const NEW_TESTAMENT_BOOKS = [
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
] as const;

// Longest-first so "1 John" matches before "John", "1 Corinthians" before etc.
const NT_BY_LENGTH = [...NEW_TESTAMENT_BOOKS].sort(
  (a, b) => b.length - a.length
);

/**
 * Extract the book name from a free-text verse reference such as
 * "1 Corinthians 13:4" → "1 Corinthians", "John 3:16" → "John".
 * Falls back to the leading word(s) before the first digit-with-colon.
 */
export function bookFromVerseRef(verseRef: string | null): string | null {
  if (!verseRef) return null;
  const ref = verseRef.trim();
  if (!ref) return null;

  // Prefer an exact match against a known NT book at the start.
  const lower = ref.toLowerCase();
  for (const book of NT_BY_LENGTH) {
    if (lower.startsWith(book.toLowerCase())) {
      return book;
    }
  }

  // Otherwise strip a trailing "chapter:verse" / "chapter" to isolate the book.
  // e.g. "Psalm 23", "Song of Solomon 1:2", "Genesis 1"
  const match = ref.match(/^([0-9]?\s?[A-Za-z][A-Za-z\s]*?)\s+\d/);
  if (match) {
    return match[1].trim();
  }
  return ref;
}

/** True if the reference points at a New Testament book. */
export function isNewTestament(verseRef: string | null): boolean {
  const book = bookFromVerseRef(verseRef);
  if (!book) return false;
  const lower = book.toLowerCase();
  return NEW_TESTAMENT_BOOKS.some((b) => b.toLowerCase() === lower);
}

/** True if the reference points at the book of Psalms. */
export function isPsalms(verseRef: string | null): boolean {
  if (!verseRef) return false;
  return /\bpsalms?\b/i.test(verseRef);
}

/**
 * True if the reference is an Old Testament book — i.e. it has a reference
 * but is not a New Testament book. (Psalms is part of the Old Testament.)
 */
export function isOldTestament(verseRef: string | null): boolean {
  if (!verseRef || !verseRef.trim()) return false;
  return !isNewTestament(verseRef);
}

export type FeedTab = "all" | "following" | "nt" | "ot" | "psalms";

export const FEED_TABS: { key: FeedTab; label: string }[] = [
  { key: "all", label: "All Notes" },
  { key: "following", label: "Following" },
  { key: "nt", label: "New Testament" },
  { key: "ot", label: "Old Testament" },
  { key: "psalms", label: "Psalms" },
];

export function isFeedTab(value: string | undefined): value is FeedTab {
  return (
    value === "all" ||
    value === "following" ||
    value === "nt" ||
    value === "ot" ||
    value === "psalms"
  );
}

/** Well-known verses for the "Verse of the Day" widget, rotated by day. */
export const VERSE_OF_THE_DAY: { text: string; ref: string }[] = [
  { text: "For God so loved the world, that he gave his only Son.", ref: "John 3:16" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
  { text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5" },
  { text: "And we know that all things work together for good to them that love God.", ref: "Romans 8:28" },
  { text: "Be strong and of a good courage; be not afraid, neither be thou dismayed.", ref: "Joshua 1:9" },
  { text: "Now faith is the substance of things hoped for, the evidence of things not seen.", ref: "Hebrews 11:1" },
  { text: "The Lord is my light and my salvation; whom shall I fear?", ref: "Psalm 27:1" },
  { text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28" },
  { text: "But they that wait upon the Lord shall renew their strength.", ref: "Isaiah 40:31" },
  { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" },
  { text: "Rejoice in the Lord alway: and again I say, Rejoice.", ref: "Philippians 4:4" },
  { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
  { text: "In the beginning God created the heaven and the earth.", ref: "Genesis 1:1" },
  { text: "Let all that you do be done in love.", ref: "1 Corinthians 16:14" },
];

/** Pick the verse of the day deterministically from the day of the year. */
export function verseOfTheDay(date: Date = new Date()): {
  text: string;
  ref: string;
} {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return VERSE_OF_THE_DAY[dayOfYear % VERSE_OF_THE_DAY.length];
}

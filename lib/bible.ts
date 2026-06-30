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

// ---------------------------------------------------------------------------
// Bible book → Bolls API book number lookup (1–66)
// Covers English names, Traditional Chinese names, and common abbreviations.
// ---------------------------------------------------------------------------

const BOOK_NUMBER: Record<string, number> = {
  // Old Testament (1–39)
  genesis: 1, gen: 1, ge: 1, "創世記": 1,
  exodus: 2, exod: 2, ex: 2, "出埃及記": 2,
  leviticus: 3, lev: 3, le: 3, "利未記": 3,
  numbers: 4, num: 4, nu: 4, "民數記": 4,
  deuteronomy: 5, deut: 5, dt: 5, "申命記": 5,
  joshua: 6, josh: 6, "約書亞記": 6,
  judges: 7, judg: 7, "士師記": 7,
  ruth: 8, ru: 8, "路得記": 8,
  "1 samuel": 9, "1samuel": 9, "1 sam": 9, "1sam": 9, "撒母耳記上": 9,
  "2 samuel": 10, "2samuel": 10, "2 sam": 10, "2sam": 10, "撒母耳記下": 10,
  "1 kings": 11, "1kings": 11, "1 kgs": 11, "1kgs": 11, "列王記上": 11,
  "2 kings": 12, "2kings": 12, "2 kgs": 12, "2kgs": 12, "列王記下": 12,
  "1 chronicles": 13, "1chronicles": 13, "1 chr": 13, "1chr": 13, "歷代志上": 13,
  "2 chronicles": 14, "2chronicles": 14, "2 chr": 14, "2chr": 14, "歷代志下": 14,
  ezra: 15, "以斯拉記": 15,
  nehemiah: 16, neh: 16, "尼希米記": 16,
  esther: 17, est: 17, "以斯帖記": 17,
  job: 18, "約伯記": 18,
  psalms: 19, psalm: 19, ps: 19, "詩篇": 19,
  proverbs: 20, prov: 20, pr: 20, "箴言": 20,
  ecclesiastes: 21, eccl: 21, "傳道書": 21,
  "song of solomon": 22, "song of songs": 22, song: 22, "雅歌": 22,
  isaiah: 23, isa: 23, "以賽亞書": 23,
  jeremiah: 24, jer: 24, "耶利米書": 24,
  lamentations: 25, lam: 25, "耶利米哀歌": 25,
  ezekiel: 26, ezek: 26, "以西結書": 26,
  daniel: 27, dan: 27, "但以理書": 27,
  hosea: 28, hos: 28, "何西阿書": 28,
  joel: 29, "約珥書": 29,
  amos: 30, "阿摩司書": 30,
  obadiah: 31, obad: 31, "俄巴底亞書": 31,
  jonah: 32, "約拿書": 32,
  micah: 33, mic: 33, "彌迦書": 33,
  nahum: 34, nah: 34, "那鴻書": 34,
  habakkuk: 35, hab: 35, "哈巴谷書": 35,
  zephaniah: 36, zeph: 36, "西番雅書": 36,
  haggai: 37, hag: 37, "哈該書": 37,
  zechariah: 38, zech: 38, "撒迦利亞書": 38,
  malachi: 39, mal: 39, "瑪拉基書": 39,

  // New Testament (40–66)
  matthew: 40, matt: 40, mt: 40, "馬太福音": 40,
  mark: 41, mk: 41, mr: 41, "馬可福音": 41,
  luke: 42, lk: 42, "路加福音": 42,
  john: 43, jn: 43, "約翰福音": 43,
  acts: 44, "使徒行傳": 44,
  romans: 45, rom: 45, "羅馬書": 45,
  "1 corinthians": 46, "1corinthians": 46, "1 cor": 46, "1cor": 46, "哥林多前書": 46,
  "2 corinthians": 47, "2corinthians": 47, "2 cor": 47, "2cor": 47, "哥林多後書": 47,
  galatians: 48, gal: 48, "加拉太書": 48,
  ephesians: 49, eph: 49, "以弗所書": 49,
  philippians: 50, phil: 50, "腓立比書": 50,
  colossians: 51, col: 51, "歌羅西書": 51,
  "1 thessalonians": 52, "1thessalonians": 52, "1 thess": 52, "1thess": 52, "帖撒羅尼迦前書": 52,
  "2 thessalonians": 53, "2thessalonians": 53, "2 thess": 53, "2thess": 53, "帖撒羅尼迦後書": 53,
  "1 timothy": 54, "1timothy": 54, "1 tim": 54, "1tim": 54, "提摩太前書": 54,
  "2 timothy": 55, "2timothy": 55, "2 tim": 55, "2tim": 55, "提摩太後書": 55,
  titus: 56, "提多書": 56,
  philemon: 57, phlm: 57, "腓利門書": 57,
  hebrews: 58, heb: 58, "希伯來書": 58,
  james: 59, "雅各書": 59,
  "1 peter": 60, "1peter": 60, "1 pet": 60, "1pet": 60, "彼得前書": 60,
  "2 peter": 61, "2peter": 61, "2 pet": 61, "2pet": 61, "彼得後書": 61,
  "1 john": 62, "1john": 62, "1 jn": 62, "1jn": 62, "約翰一書": 62,
  "2 john": 63, "2john": 63, "2 jn": 63, "2jn": 63, "約翰二書": 63,
  "3 john": 64, "3john": 64, "3 jn": 64, "3jn": 64, "約翰三書": 64,
  jude: 65, "猶大書": 65,
  revelation: 66, rev: 66, "啟示錄": 66,
};

/** Chinese book names sorted longest-first so "約翰一書" matches before "約翰". */
const CN_BOOKS = Object.keys(BOOK_NUMBER).filter((k) => /[一-鿿]/.test(k))
  .sort((a, b) => b.length - a.length);

/** English book names/abbreviations sorted longest-first. */
const EN_BOOKS = Object.keys(BOOK_NUMBER).filter((k) => !/[一-鿿]/.test(k))
  .sort((a, b) => b.length - a.length);

export interface ParsedRef {
  bookNum: number;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

/**
 * Parse a verse reference string into structured data for the Bolls API.
 * Handles English names ("John 3:16", "1 Cor 13:4-7"), Chinese names
 * ("約翰福音 3:16"), and common abbreviations ("Jn 3:16").
 */
export function parseVerseRef(ref: string): ParsedRef | null {
  if (!ref) return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;

  // Try Chinese book names first (longest match).
  for (const book of CN_BOOKS) {
    if (trimmed.startsWith(book)) {
      const rest = trimmed.slice(book.length).trim();
      return parseChapterVerse(book, rest);
    }
  }

  // Try English book names (longest match, case-insensitive).
  const lower = trimmed.toLowerCase();
  for (const book of EN_BOOKS) {
    if (lower.startsWith(book)) {
      const rest = trimmed.slice(book.length).trim();
      return parseChapterVerse(book, rest);
    }
  }

  return null;
}

function parseChapterVerse(
  bookKey: string,
  rest: string
): ParsedRef | null {
  const bookNum = BOOK_NUMBER[bookKey];
  if (!bookNum) return null;

  // Expected formats: "3:16", "3:16-20", "3", "3:16–20" (en-dash)
  const match = rest.match(
    /^(\d+)(?::(\d+)(?:[\-–](\d+))?)?$/
  );
  if (!match) return null;

  const chapter = parseInt(match[1], 10);
  const verseStart = match[2] ? parseInt(match[2], 10) : 1;
  const verseEnd = match[3] ? parseInt(match[3], 10) : undefined;

  if (chapter < 1 || verseStart < 1) return null;
  if (verseEnd !== undefined && verseEnd < verseStart) return null;

  return { bookNum, chapter, verseStart, verseEnd };
}

interface BollsVerse {
  pk: number;
  verse: number;
  text: string;
}

/**
 * Fetch verse text from the Bolls Bible API.
 * translation: "CUV" (Traditional Chinese) or "WEB" (English).
 * Returns the joined verse text and the original reference, or null on failure.
 */
export async function fetchVerse(
  ref: string,
  translation: "CUV" | "WEB"
): Promise<{ text: string; reference: string } | null> {
  const parsed = parseVerseRef(ref);
  if (!parsed) return null;

  const { bookNum, chapter, verseStart, verseEnd } = parsed;
  const url = `https://bolls.life/get-text/${translation}/${bookNum}/${chapter}/`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const verses: BollsVerse[] = await res.json();
    if (!Array.isArray(verses) || verses.length === 0) return null;

    const filtered = verses.filter((v) => {
      if (v.verse < verseStart) return false;
      if (verseEnd !== undefined && v.verse > verseEnd) return false;
      if (verseEnd === undefined && v.verse !== verseStart) return false;
      return true;
    });

    if (filtered.length === 0) return null;

    const text = filtered
      .sort((a, b) => a.verse - b.verse)
      .map((v) => decodeHtmlEntities(v.text))
      .join(" ");

    return { text, reference: ref };
  } catch {
    return null;
  }
}

/** Decode common HTML entities from the Bolls API response. */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&#\d+;/g, (m) => {
      const code = parseInt(m.slice(2, -1), 10);
      return String.fromCharCode(code);
    });
}

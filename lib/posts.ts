// Display helpers for rendering post content.

/**
 * Derive a heading from the first non-empty line of content.
 * Returns up to 80 characters without truncation ellipsis.
 */
export function displayHeading(content: string, maxLength = 80): string {
  const firstLine =
    content
      .split("\n")
      .map((l) => l.replace(/^>\s?/, "").trim())
      .find((l) => l.length > 0) ?? "";

  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.slice(0, maxLength).trimEnd();
}

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "quote"; text: string };

/**
 * Split post content into text and blockquote blocks. Consecutive lines that
 * start with ">" are grouped into a single quote block; everything else is
 * grouped into text blocks. Used to render the ".verse-callout" style.
 */
export function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split("\n");
  const blocks: ContentBlock[] = [];
  let buffer: string[] = [];
  let mode: "text" | "quote" | null = null;

  const flush = () => {
    if (buffer.length === 0 || mode === null) return;
    const text = buffer.join("\n").trim();
    if (text) blocks.push({ type: mode, text });
    buffer = [];
  };

  for (const line of lines) {
    const isQuote = /^\s*>/.test(line);
    const nextMode: "text" | "quote" = isQuote ? "quote" : "text";
    if (mode !== nextMode) {
      flush();
      mode = nextMode;
    }
    buffer.push(isQuote ? line.replace(/^\s*>\s?/, "") : line);
  }
  flush();

  return blocks;
}

/** The first blockquote line in the content, if any (for card previews). */
export function firstQuote(content: string): string | null {
  for (const line of content.split("\n")) {
    if (/^\s*>/.test(line)) {
      const text = line.replace(/^\s*>\s?/, "").trim();
      if (text) return text;
    }
  }
  return null;
}

/**
 * Content preview with blockquote markers removed and the first non-empty
 * line dropped (since it's used as the card heading).
 */
export function previewText(content: string): string {
  const lines = content.split("\n").map((l) => l.replace(/^\s*>\s?/, ""));
  // Drop the first non-empty line (used as heading).
  const firstIdx = lines.findIndex((l) => l.trim().length > 0);
  if (firstIdx !== -1) lines.splice(firstIdx, 1);
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

# Scriptura — UI Style Guide

## Overall Impression

Scriptura presents a contemplative, literary aesthetic rooted in the quiet palette of natural materials — aged parchment, morning fog, pale moss, and forest shadow. The design communicates scholarly warmth and spiritual intentionality: it feels like a well-loved study Bible meets a modern reading app. Typography leans heavily on elegant serif headings paired with clean, restrained sans-serif body copy. Negative space is generous, borders are soft, and interactions are gentle rather than punchy. The overall mood is one of stillness and depth — encouraging slow, reflective engagement rather than rapid consumption.

---

## Color

The palette is consistently derived from earthy, desaturated naturals with a single teal-green as the primary accent.

| Name | Hex | Role |
|---|---|---|
| Pine Black | `#22393c` | Primary text, sidebar background, dark chrome |
| Fog Horizon | `#46707e` | Primary accent — CTAs, active states, links, icon fills |
| Pale Moss | `#6b8b81` | Secondary accent — icon color, hover text, softer CTAs |
| Sage | `#afbb98` | Tertiary accent — nav badges, decorative highlights, tag borders |
| Morning Clay | `#cecdb9` | Border color, dividers, avatar rings |
| Morning Clay Light | `#e8e7d8` | Hover backgrounds, verse callout fills |
| Morning Clay Lighter | `#f3f2ea–#f4f3ec` | Main content background, page surface |
| Card BG | `#f7f6f0` | Card surfaces (slightly warmer than page) |
| White | `#ffffff–#faf9f6` | Input backgrounds, comment bubbles |
| Text Muted | `#7a8a88–#7a9198` | Secondary labels, timestamps, placeholders |
| Red (Liked state) | `#c0504a–#c0765c` | Heart/like active state only |
| Green (Trending) | `#6b9e6b` | Trending percentage indicators only |
| Notification dot | `#e07a5f` | Unread notification indicator only |

**The dark sidebar** uses `#22393c` (pine black) or `#1c3035` as a deep forest anchor, contrasted against cream page surfaces. The "Verse of the Day" widget inverts to a `#2e4d53 → #22393c` gradient for emphasis.

---

## Typography

Two typefaces are used exclusively throughout.

### Typefaces
- **Playfair Display** (serif) — headings, titles, verse text, pull quotes, logo wordmark
- **Inter** (sans-serif) — all UI chrome, labels, body prose in comments/UI, buttons

### Size Hierarchy

| Role | Family | Size | Weight | Notes |
|---|---|---|---|---|
| Page/panel title | Playfair Display | 38–44px | 600 | `letter-spacing: -0.01em`, `line-height: 1.15–1.25` |
| Article title | Playfair Display | 28–38px (clamp) | 600–700 | |
| Section heading | Playfair Display | 18–20px | 600–700 | |
| Card note title | Playfair Display | 16px | 700 | `line-height: 1.35` |
| Verse / pull quote text | Playfair Display | 13–17.5px | 400 italic | `line-height: 1.6–1.75` |
| Logo wordmark | Playfair Display | 18–20px | 600–700 | Accent color on last syllable |
| Body prose (note body) | Playfair Display | 16–17px | 400 | `line-height: 1.85` |
| UI body / excerpts | Inter | 13–15px | 400 | `line-height: 1.5–1.65` |
| Buttons | Inter | 14–15px | 600 | |
| Nav items | Inter | 13–14px | 400–500 | |
| Form labels | Inter | 11–12px | 600 | `uppercase`, `letter-spacing: 0.08–0.12em` |
| Badges / tags / chips | Inter | 10–13px | 500–600 | `uppercase` for eyebrow labels |
| Captions / timestamps | Inter | 11–12px | 400–500 | Muted color |

---

## Spacing and Layout

### Desktop Layout
Three-column structure throughout: a **left sidebar** (240–260px), a **centered main content column** (max-width 760–800px), and an optional **right sidebar** (260–280px). A sticky **top bar** (56–64px tall) anchors navigation. A **fixed bottom action bar** overlays the main content area on writing pages.

### Mobile Layout
430px shell with a **top bar + category chip strip + scrollable feed + bottom navigation bar** (64px). FAB button floats above the bottom nav. Writing screens use a sticky bottom bar with Save Draft / Publish buttons.

### Spacing Scale (observed values)
- Base unit appears to be ~4px
- Common paddings: `10px`, `12px`, `14px`, `16px`, `18px`, `20px`, `24px`, `28px`, `32px`, `48px`
- Card internal padding: `16–18px`
- Form field gaps: `28px` between fields on desktop; `20px` on mobile
- Section padding in sidebar: `16px 24px`, `8px 12px` for nav items

### Border Radii
- Cards and inputs: `12–14px`
- Buttons: `12–16px`
- Pills / chips: `20–100px` (fully rounded)
- Icon containers / small buttons: `7–10px`
- Avatar circles: `50%`

---

## Components

### Buttons
- **Primary** (`btn-primary`): `background: linear-gradient(135deg, #46707e, #3d6672)`, white text, `border-radius: 12–16px`, `padding: 11px 22px`, `font-weight: 600`, `box-shadow: 0 3px 12px rgba(70,112,126,0.3)`. Hover lifts with `translateY(-1px)` and deepens shadow.
- **Ghost / Secondary**: White or transparent background, `border: 1.5px solid #d4d3c4`, pine-black text. Hover fills with `morning-clay-light`.
- **Text button**: Bare, colored with `fog-horizon`, used in nav bars ("Publish", "Follow").
- **Send / Icon action**: Circular or small square, `background: fog-horizon`, white icon, `border-radius: 8–50%`.

### Inputs
All inputs share: `border: 1.5px solid #d4d3c4`, `border-radius: 14px`, white background, `font-size: 15px`, Inter typeface. Focus state: `border-color: #46707e` + `box-shadow: 0 0 0 3px rgba(70,112,126,0.12)`. Placeholders use italic Playfair Display in textareas, regular Inter in text inputs, colored `#b5b4a6–#c0bfb1`.

### Cards (Feed Notes)
White/cream surface (`#f7f6f0`), `border: 1px solid #e8e6dc`, `border-radius: 12–14px`, subtle shadow `0 1px 3px rgba(34,57,60,0.06)`. Hover: `translateY(-2 to -3px)`, deeper shadow, border tints toward fog-horizon. A **featured card** variant inverts to a dark gradient (`#2d4a50 → #22393c`) with light text.

### Verse Callout / Pull Quote
Left-border treatment: `border-left: 3.5–4px solid #46707e`, `background: rgba(206,205,185,0.35–0.45)`, `border-radius: 0 10–12px 10–12px 0`. Large decorative `"` rendered in Playfair Display at `72px`, opacity `0.12–0.20`, positioned top-left.

### Tag Chips
`background: rgba(107,139,129,0.12–0.15)`, `border: 1px solid rgba(107,139,129,0.25–0.35)`, `border-radius: 20–100px`, `padding: 5px 10–14px`, `font-size: 11–13px`, `font-weight: 500`, `color: pale-moss`. Hover deepens the background tint.

### Verse Pills
Italic Playfair Display text, `background: rgba(70,112,126,0.10)`, `border: 1px solid rgba(70,112,126,0.20)`, `color: #46707e`, pill-shaped. Used as reference labels on feed cards and detail pages.

### Visibility Selector
Three equal-width option tiles arranged in a row. Each contains a centered icon, a label, and a short description. Selected state: `border-color: #46707e`, subtle tinted background, icon container fills with fog-horizon gradient.

### Navigation Sidebar (Desktop)
Dark pine-black background. Active nav item: `background: rgba(70,112,126,0.30–0.35)`, white text, with a 3px sage-colored left border accent. Inactive items: 60% white opacity, hover adds a subtle white overlay.

### Bottom Navigation (Mobile)
Pine-black bar, icon + label per item. Active item: sage-green color + a small sage dot indicator below. Icon size approximately 19px.

### Autosave Indicator
Small dot (7px circle) + label text. Idle state: sage green. Saving state: clay color with a CSS `pulse` scale animation.

---

## Imagery and Iconography

**Icons** are sourced from Font Awesome 6 (solid and regular variants). They appear at small sizes (9–20px), frequently within colored container squares (`border-radius: 7–10px`) using fog-horizon-to-pale-moss gradients as backgrounds. Icon usage is purposeful and restrained — each form label, nav item, and eyebrow label carries a single icon for orientation.

**Avatars** are circular portrait photographs with a `border: 2px solid #cecdb9` ring in most contexts, upgrading to `border-color: fog-horizon` when active or selected.

**The logo** uses a hand-drawn-style SVG open book icon — two pages with page-line strokes, a center spine, rendered in near-white fill — paired with the Playfair Display wordmark where the final syllable "ura" is tinted sage-green.

**Verse callouts** use an oversized decorative quotation mark (Playfair Display, ~72px, ~12% opacity) floating behind the text as a typographic illustration rather than a separate graphic asset.

---

## Voice and Tone

The copy is **literary, warm, and contemplative** — it addresses readers as thoughtful adults engaged in personal spiritual inquiry. Language is unhurried and slightly elevated without being academic. There is an intimacy to the first-person reflection style; notes read like journal entries shared publicly, not summaries or bullet points.

**Representative phrases:**

> *"Reflect on scripture, share what you've discovered, and encourage others on their journey."*

> *"Where has fear dressed itself up as wisdom?"*

> *"This peace — not yours to earn, only yours to receive — stands guard. It holds the door."*

The UI microcopy follows the same register — form labels say "Your Note" and "Bible Reference" rather than "Input" or "Field." Placeholder text uses Playfair italic to suggest the meditative quality expected of a real entry: *"What did this verse reveal to you?"* The comments section is labeled **"Reflections"** rather than "Comments," and the comment input prompts *"Share your reflection on this passage…"* — reinforcing the contemplative identity throughout.
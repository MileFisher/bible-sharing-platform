# Scriptura — Product Requirements Document

---

## Overview

Scriptura is a scripture-based social platform for members of faith communities — primarily churches and small groups — to write, share, and discuss personal reflections on Bible verses. It solves the problem of isolated Bible study by giving users a structured space to author notes tied to specific scriptural references, discover what fellow community members are reflecting on, and engage through comments, reactions, and bookmarks. The product exists in both a desktop web application and a mobile application (iOS-form-factor), sharing a consistent design language and feature set.

---

## Features

### Note Authoring
Users can compose a note by providing a Bible verse reference, writing free-form reflective text, selecting tags/categories, choosing a mood, and setting visibility. The compose experience exists on both desktop (sidebar-nav layout) and mobile (full-screen sheet with a sticky bottom action bar).

### Bible Verse Lookup
A search field on the note-compose screen accepts partial book, chapter, or verse input and surfaces a real-time suggestion dropdown showing matching verse references and their text preview. Selecting a suggestion attaches a styled scripture pull-quote card to the note.

### Formatting Toolbar
Within the note textarea, a persistent toolbar provides inline formatting controls: Bold, Italic, Underline, Quote block, Bullet list, and Link. On desktop, these appear as small icon buttons below a section label; on mobile, they appear in a scrollable pill bar above the textarea.

### Mood / Tone Selector (Mobile)
The mobile compose screen includes an emoji-based mood row (Grateful, Joyful, Peaceful, Thoughtful, Hopeful) that captures the emotional tone of the reflection.

### Tag / Category Management
Users can attach up to 8 thematic or book-based tags to a note. On desktop, a free-text tag input renders existing tags as removable chips and offers an autocomplete suggestion dropdown. On mobile, a pre-set chip grid toggles categories on/off with an "Add" chip for custom entries.

### Visibility Control
Authors choose one of three visibility settings before publishing: **Public** (anyone), **Community Only** (members of the user's church/group), or **Private** (author only). The selected state is visually indicated with an active icon and border treatment.

### Draft Autosave
While composing, the system continuously autosaves content. An autosave indicator in the bottom action bar shows status ("Draft saved just now" / "Saving…") with an animated dot.

### Publish & Save Draft Actions
The bottom action bar on both desktop and mobile provides two primary actions: **Save Draft** (persists without publishing) and **Publish Note** (makes the note visible per visibility setting). Both states confirm success with transient feedback.

### Community Notes Feed
A central feed displays note cards authored by community members. The desktop version uses a two-column masonry grid; the mobile version uses a single-column vertical list. Notes can be filtered by category tabs (All Notes, Following, New Testament, Old Testament, Psalms, etc.) on desktop, or by a horizontally scrollable category chip strip on mobile.

### Featured / Trending Note Highlight
The feed surfaces a visually distinct "featured" card (dark background treatment) for the top trending note of the day, labeled with a "Trending Today" badge.

### Note Card Actions
Each card in the feed shows like count, comment count, and bookmark toggle. Users can like (heart), comment (navigates to detail), and bookmark directly from the card without opening the full note. Like and bookmark states are togglable with count updates.

### Search and Filter (Desktop Feed)
The desktop feed includes a persistent search bar accepting free text queries across notes, verses, and people, alongside Filter and Sort controls.

### Note Detail View
Tapping or clicking a note card opens the full note detail, which displays: the note category/series label, title, author with a Follow button, a styled verse callout block, full body text with rich typography, topic tags, a reaction bar (like, save/bookmark, share), a comments/reflections section, and a comment input field.

### Reading Progress Indicator (Mobile Detail)
A thin progress bar beneath the navigation bar in the mobile note detail view fills as the user scrolls through the note content.

### Comments / Reflections
Readers can leave threaded reflections on a note. Each comment shows the author avatar, name, timestamp, comment text, a like count toggle, and a Reply button. The current user's avatar appears next to the comment input. New comments animate into the list on submission.

### Follow / Unfollow Author
On the note detail, a Follow button next to the author's name toggles to "Following" state, allowing users to subscribe to an author's future notes.

### Bookmark / Save Note
On the note detail and within feed cards, users can bookmark/save a note for later reference. The icon and label reflect saved state persistently.

### Share Note
A Share button on the note detail copies a shareable link, providing transient "Copied!" feedback.

### Right Sidebar — Related Notes & Suggested Passages (Desktop Detail)
The desktop note detail view includes a contextual right sidebar showing related notes (linked by verse or topic) and suggested scripture passages thematically relevant to the open note.

### Right Sidebar — Widgets (Desktop Feed)
The desktop feed's right sidebar shows: a Verse of the Day card, a Trending Verses ranked list with note counts and percentage growth, an Active Members grid with online presence indicators, and an Upcoming Bible Study event card.

### Trending Verses Widget
Ranks the most-discussed Bible references in the community by note count and number of active discussions, with percentage change indicators. Links to a full "View all" list.

### Active Members Widget
Displays avatars of recently active community members, with a green online indicator for currently online users. Tapping an avatar navigates to that member's profile (implied).

### Upcoming Study Widget
Shows the next scheduled group Bible study event, including title, passage, date/time, and an attendee count with stacked avatars.

### Reading Plan Sidebar Block (Desktop Detail)
A sidebar module on the desktop detail view shows the user's current reading plan title, percentage complete, and days remaining, with a progress bar.

### Navigation — Desktop
A left sidebar provides primary navigation across sections: Explore (Home Feed, Discover, Trending), My Content (Write a Note, My Notes, Saved Verses, Collections), and Community (My Community, Notifications). A badge count is shown on items with unread activity. The footer of the sidebar shows the current user's avatar, name, and role.

### Navigation — Mobile Feed
A persistent bottom navigation bar with five items: Home, Search, Add Note (pen-nib icon), Saved, and Profile. A floating action button (FAB) in the lower-right corner also triggers new note creation.

### Navigation — Mobile Detail
A top navigation bar with a back button labeled with the previous screen's name ("Notes"), a centered screen title, and a Publish text button on the right. Bookmark and overflow (ellipsis) action buttons appear in the top-right.

---

## User Flows

### Flow 1: Browsing the Community Feed
1. User lands on the **Bible Notes Feed** screen (active "Home" / "Feed" tab).
2. The feed displays note cards in chronological/ranked order, with the top trending note in a featured treatment.
3. User can switch between category tabs (desktop) or category chips (mobile) to filter by book or topic.
4. User scrolls through cards; each card shows author, verse reference pill, note title, excerpt, optional verse quote, topic chips, and engagement counters.
5. User taps/clicks a card (or "Read →" link) to open the **Note Detail** view.
6. User taps/clicks the **Write a Note** button (desktop top bar or mobile FAB/bottom nav) to enter the compose flow.

### Flow 2: Composing and Publishing a Note
1. User arrives at the **Write a Note** screen from sidebar navigation (desktop) or FAB / "Add Note" bottom nav item (mobile).
2. User types into the **Bible Reference** field; a suggestion dropdown appears with matching verse references and preview text (desktop) or quick-select hint pills appear (mobile).
3. User selects a verse from the dropdown/pills; a scripture pull-quote card is displayed below the input (and the input field is replaced by the pill on desktop).
4. User writes reflective text in the **note textarea**. Character count is shown below; formatting buttons are available.
5. *(Mobile only)* User optionally selects a mood emoji.
6. User adds or adjusts **tags/categories** via chip selection or text input.
7. User selects a **visibility** option (Public / Community Only / Private). "Community" is pre-selected by default.
8. The system autosaves; the indicator in the bottom bar updates status.
9. User presses **Save Draft** to save without publishing, or **Publish Note** to publish.
10. The Publish button shows a loading state ("Publishing…") then a success state ("Published!").

### Flow 3: Reading a Note in Detail
1. User opens a note from the feed.
2. The **Note Detail** screen shows: category badge, title, author row (with Follow button), verse callout block, full body text, tags, and a reaction bar.
3. *(Mobile)* A reading progress bar fills as the user scrolls.
4. User can tap the **heart** to like the note (count increments); tap **bookmark/save** to save it; tap **share** to copy a link.
5. User scrolls to the **comments/reflections** section, reads existing comments, and can like individual comments.
6. User taps the comment input, types a reflection, and submits via the send button (or Enter key on desktop). The new comment appears with a fade-in animation.
7. User taps **Follow** next to the author to subscribe; the button updates to "Following."
8. *(Desktop)* User can tap related notes or suggested passages in the right sidebar to navigate to those notes.
9. User taps the back button / breadcrumb to return to the feed.

---

## States and Variants

### Verse Lookup Field
- **Empty state:** Placeholder text ("e.g. John 3:16, Psalm 23, Romans 8…") shown; no dropdown visible.
- **Typing state:** Suggestion dropdown appears, listing matching verse references with preview text and translation label.
- **Selected state (desktop):** Input field is hidden; a styled pill card shows the selected reference, verse text, and a remove (×) button.
- **Selected state (mobile):** A scripture preview card appears below the input field with quoted text and reference.
- **Cleared state:** Remove (×) button on the pill collapses it and restores the empty input field.

### Autosave Indicator
- **Idle/saved:** Solid green dot + "Draft saved just now."
- **Saving:** Pulsing animated dot + "Saving…"

### Publish / Save Draft Buttons
- **Default:** Normal labeled state.
- **Loading (Publish):** Spinner icon + "Publishing…" label; button disabled.
- **Success (Publish):** Check icon + "Published!" label; brief timeout then returns to default.
- **Success (Save Draft):** Check icon + "Saved!" label with accent border; reverts after ~2 seconds.

### Like / Heart Button
- **Default (unliked):** Outlined heart icon; muted color.
- **Liked:** Filled heart icon; red-toned color; count incremented.

### Bookmark Button
- **Default:** Outlined bookmark icon; muted color.
- **Bookmarked (feed card):** Filled bookmark icon; fog-horizon color.
- **Bookmarked (detail):** Label changes from "Save" to "Saved"; button takes bookmarked style.

### Follow Button
- **Default:** Outlined pill button with "+ Follow" label.
- **Following:** Filled background, "✓ Following" label.

### Visibility Selector
- **Three options:** Public (globe), Community (users/church), Private (lock).
- **Selected:** Active border, tinted background, icon background fills with brand gradient/color.
- **Default pre-selected:** "Community Only" is selected on load.

### Tag Chips
- **Active (selected):** Filled brand-color background.
- **Inactive:** White/outlined background.
- **Hover:** Transitions toward sage-green.
- **Add chip:** Dashed border; prompts custom tag input.

### Format Toolbar Buttons
- **Default:** Muted color, transparent background.
- **Active/toggled:** Filled background (fog-horizon), white icon.
- **Hover:** Light background.

### Mood Buttons (Mobile Compose)
- **Default:** White background, muted border.
- **Selected:** Brand-tinted border and background, slightly scaled up.

### Note Cards — Feed
- **Default:** Light card background.
- **Featured/Trending:** Dark (pine-black gradient) background with light text; "Trending Today" badge.
- **Hover (desktop):** Elevated shadow, slight upward translate, border highlight.
- **Active/tap (mobile):** Slight scale-down on press.

### Comment Count (Detail)
- Updates heading from "N Reflections" to "N+1 Reflections" after a new comment is successfully submitted.

### Category Chips / Tabs (Feed)
- **Active:** Filled background (fog-horizon), white text.
- **Inactive:** Semi-transparent background, muted text.
- Switching tabs/chips deactivates all others and activates the tapped one.

### Reading Progress Bar (Mobile Detail)
- Starts at a minimal non-zero width; fills proportionally as the user scrolls; transitions smoothly.

### FAB (Mobile Feed)
- **Default:** Plus ("+") icon, fog-horizon background.
- **Activated (tapped):** Icon changes to × (close); darker background. Tapping again reverts to "+" state.

### Share Button (Detail)
- **Default:** "Share" label with arrow-up icon.
- **Tapped:** "Copied!" label with check icon, accent color for ~2 seconds; reverts.

### Online Indicator (Active Members Widget)
- Green dot overlaid on avatar: user is currently online.
- No dot: user is offline / recently active.

---

## Acceptance Criteria

### Bible Reference Lookup
- The user can type a partial book name, chapter, or verse into the reference field and see a dropdown of matching suggestions within the same interaction.
- Each suggestion displays the verse reference, the full or truncated verse text, and the Bible translation label.
- The user can select a suggestion to dismiss the dropdown and attach the verse as a styled pull-quote card.
- The user can remove a selected verse by pressing the × control on the pill/card; doing so restores the empty input field.
- When no text is entered, the dropdown is not shown.

### Note Compose
- The user can enter free-form text up to a displayed maximum (2,000 characters on mobile) with a live character counter.
- The system displays a warning style on the character counter when the count exceeds 1,800 characters.
- The user can apply formatting (Bold, Italic, Underline, Quote, List, Link) using toolbar buttons; the selected format button shows an active visual state.
- *(Mobile)* The user can select one mood emoji from the mood row; only one can be selected at a time.
- The user can add tags via the chip grid or text field; the system enforces a maximum of 8 tags.
- The user can remove an existing tag by pressing the × on its chip (desktop) or toggling the chip to inactive (mobile).
- The system autosaves form state continuously; the autosave indicator reflects saving and saved states.

### Visibility
- The user can select exactly one visibility option (Public, Community Only, Private).
- "Community Only" is pre-selected when the compose screen loads.
- The selected option shows a distinct active style (filled icon, tinted border/background).

### Publish & Draft
- The user can save a draft; the Save Draft button provides success feedback and reverts to its default label after ~2 seconds.
- The user can publish a note; the Publish button shows a loading/spinner state while processing, then a "Published!" confirmation state.
- During the publishing loading state the button is disabled and cannot be tapped again.

### Community Feed
- The system shows a count of notes for the current day (e.g., "24 notes today") in the feed header.
- The user can switch between category tabs (desktop) or category chips (mobile) to filter the visible notes; only one filter is active at a time.
- The top trending note is rendered with a visually distinct "featured" card style and a "Trending Today" badge.
- Each note card displays: contributor avatar, contributor name, relative timestamp, verse reference pill, note title, note excerpt, optional verse quote block, topic chips, like count, comment count, and bookmark/save control.
- The user can like a note card from the feed; the heart icon toggles between outlined and filled and the count updates by ±1 without navigating away.
- The user can bookmark a note card from the feed; the bookmark icon toggles between outlined and filled without navigating away.
- The user can tap the "Read →" link or the card body to navigate to the full note detail.

### Search & Filter (Desktop Feed)
- The user can type in the search field; the field accepts input and displays a focused state.
- Filter and Sort buttons are visible and tappable (their outcomes are outside the scope of the mockups but controls must be present).

### Note Detail
- The system displays the note's category label, title, author name and affiliation, publication date, and estimated read time.
- The system displays the linked Bible verse in a visually distinct callout block with the reference and translation.
- The system renders the full body text in the appropriate reading typeface.
- All topic tags are displayed as tappable chips.
- The user can like the note from the reaction bar; the count updates by ±1 and the heart icon reflects the liked/unliked state.
- The user can save/bookmark the note; the button label toggles between "Save" and "Saved."
- The user can share the note; the system provides "Copied!" feedback for approximately 2 seconds.
- The user can follow the note's author; the button transitions from "Follow" to "Following" state.
- *(Mobile)* A reading progress bar fills proportionally as the user scrolls the note content.

### Comments / Reflections
- The user can type a reflection in the comment input field.
- The user can submit a comment by pressing the send button or the Enter key (without Shift).
- On submission, the new comment appears in the list with a fade-in animation, the current user's name, "Just now" timestamp, and a 0-count like button.
- The comment count in the section heading increments by 1 after each submission.
- The user can like an existing comment; the heart icon and count update accordingly.
- A Reply button is visible on each comment (navigation behavior not specified in mockups).

### Right Sidebar — Desktop Feed Widgets
- The system displays a Verse of the Day card with the verse text and reference.
- The system displays a Trending Verses list ranked 1–5, each showing verse reference, note count, discussion count (where available), and percentage change for top entries.
- The system displays an Active Members grid; members currently online show a green indicator dot.
- The system displays an Upcoming Study widget with event title, passage, date/time, and attendee count with stacked avatars.

### Right Sidebar — Desktop Note Detail
- The system displays up to 3 related note cards, each showing the linked verse, note title, author name, read time, and topic tags.
- The system displays a Suggested Passages list of 4 related scripture references with theme descriptions.
- The user can tap a related note card to navigate to that note's detail.

### Navigation — Desktop
- The active navigation item in the left sidebar is visually distinguished with a highlight background and a vertical accent indicator.
- Navigation badges showing unread counts are visible on applicable items (Trending, My Notes, Notifications).
- The user's avatar, name, and role are displayed in the sidebar footer.
- A breadcrumb trail in the top bar reflects the current page path.

### Navigation — Mobile
- The bottom navigation bar remains fixed and visible while scrolling.
- The active bottom nav item is highlighted with the brand accent color and an active dot indicator.
- The FAB is positioned above the bottom nav bar and does not overlap with content in a way that blocks the last card's action buttons.
- Tapping the FAB changes its icon from "+" to "×" and back; it is intended to trigger the compose flow.
- The top navigation bar on compose and detail screens shows the screen title centered, a back/cancel action on the left, and a primary text action (Publish) on the right.
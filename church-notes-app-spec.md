# Scriptura — Product Requirements Document

---

## Overview

Scriptura is a faith-community platform for writing, sharing, and discovering scripture-based notes and reflections. It is designed for members of churches and Bible study groups who want a structured space to document personal insights on scripture, engage with reflections from fellow community members, and participate in group discussion. The product addresses the gap between private journaling and public social media by offering audience-controlled publishing (public, community-only, or private), a community feed with social engagement features, and a commentary thread on each note. Scriptura is delivered as both a desktop web application and a mobile application.

---

## Features

- **Bible Reference Lookup**
  A search field on the note-writing screen that accepts book names, chapter numbers, and verse numbers as free-text input. As the user types, a dropdown surfaces matching verse suggestions with a reference label, a preview of the verse text, and a translation indicator (e.g., NIV, ESV). Selecting a verse attaches it to the note as a styled pull-quote block.

- **Note Composer**
  A long-form text area where the user writes a personal reflection tied to the selected scripture. The composer includes a character counter, a basic formatting toolbar (bold, italic, underline, blockquote, bullet list, heading/link), and an autosave mechanism that periodically saves the note as a draft.

- **Mood / Tone Selector (Mobile)**
  On the mobile composer, the user may optionally select an emoji-represented emotional tone (e.g., Grateful, Joyful, Peaceful, Thoughtful, Hopeful) to associate with the note.

- **Tag and Category Management**
  The user can attach topical and book-level tags to a note. On desktop, tags are entered as free-text chips with autocomplete suggestions drawn from the existing tag vocabulary. On mobile, a preset chip palette allows one-tap selection and deselection, plus an "Add" action for custom tags. Up to eight tags are supported.

- **Visibility Control**
  Before publishing, the user selects one of three audience options: Public (anyone), Community Only (community members), or Private (only the author). The selected state is highlighted and persisted with the note.

- **Draft Saving**
  The user can explicitly save a note as a draft via a "Save Draft" button. The system also autosaves in the background; an autosave status indicator in the action bar shows whether the draft is actively saving or was last saved at a specific time.

- **Note Publishing**
  A primary "Publish Note" action submits the note to the platform. The button transitions through a loading state ("Publishing…") to a confirmation state ("Published!") before resetting.

- **Community Feed**
  A scrollable feed of note cards from community members and followed authors. Cards display the contributor's avatar, name, timestamp, scripture reference pill, note title, a truncated excerpt, an optional verse pull-quote, topical chips, and engagement action buttons (like, comment, bookmark, read). On desktop, the feed supports a masonry two-column layout. On mobile, it is a single-column list.

- **Feed Filtering and Sorting (Desktop)**
  A search field filters notes by content, verse, or author name. Filter and Sort buttons allow further refinement. Feed tabs segment the feed by scope: All Notes, Following, New Testament, Old Testament, Psalms.

- **Feed Category Chips (Mobile)**
  A horizontally scrollable chip strip at the top of the mobile feed filters notes by category (All, Genesis, Psalms, New Testament, Devotionals, Trending, Old Testament, Epistles).

- **Featured / Trending Card**
  The top note in the mobile feed may be visually promoted as "Trending Today" with an inverted dark card treatment and a featured badge.

- **Note Detail View**
  Tapping or clicking "Read" on a feed card opens the full note, displaying the author's name and avatar, publication date, scripture callout block, full note body, tags, and a reading progress indicator (mobile: a progress bar; desktop: implied by scroll). Estimated read time is shown on the desktop detail view.

- **Social Engagement on Notes**
  Each note detail page provides Like (heart), Save/Bookmark, Share, and Comment count actions. Like and Bookmark states toggle visually. The Share button copies a link and provides a brief confirmation.

- **Follow Author**
  A Follow button on a note's author row allows the reader to follow that contributor. The button toggles to "Following" state when active.

- **Comments / Reflections Thread**
  Below each note, existing comments (labeled "Reflections") are listed with commenter avatar, name, timestamp, comment text, per-comment like button, and a Reply button. A fixed comment input at the bottom of the screen (mobile) or an inline input area (desktop) allows the current user to add a new comment. Submitting a comment appends it to the thread and updates the comment count.

- **Trending Verses Widget (Desktop)**
  A right-sidebar panel ranks the most-referenced verses in the community by note count and active discussion count, with a percentage trend indicator.

- **Active Members Widget (Desktop)**
  A right-sidebar grid displays community members with online presence indicators (green dot).

- **Verse of the Day Widget (Desktop)**
  A prominently styled right-sidebar card surfaces a daily scripture passage.

- **Upcoming Study Widget (Desktop)**
  A right-sidebar card shows the next scheduled group study event with date, passage, title, time, and an attendee count.

- **Related Notes and Suggested Passages (Desktop Detail View)**
  The right sidebar of the note detail page surfaces cards for thematically or scripturally related notes (with verse, title, author, and tags) and a list of suggested passages relevant to the note's themes.

- **Reading Plan Progress (Desktop Sidebar)**
  The left sidebar of the desktop detail view contains a compact reading plan widget showing the plan title, a progress bar, and days remaining.

- **Floating Action Button / Write Entry Point (Mobile Feed)**
  A persistent FAB on the mobile feed provides a one-tap shortcut to open the note composer. Tapping it again dismisses it (the icon toggles to ×).

- **Navigation**
  Desktop: a persistent left sidebar with labeled sections (Explore, My Content, Community) and nav badges for unread counts. Mobile: a bottom tab bar (Home, Search, Add Note, Saved, Profile) and a top bar with notification and search icon buttons.

---

## User Flows

### 1. Write and Publish a Note (Desktop)

1. The user selects **Write a Note** from the left sidebar navigation. The active state is highlighted.
2. The Write a Note screen loads with a breadcrumb trail (Home → My Notes → Write a Note).
3. The user types a Bible reference in the **Bible Reference** field. A dropdown of verse suggestions appears, each showing the reference, verse text excerpt, and translation.
4. The user selects a verse from the dropdown. The input field is replaced by a styled selected-verse pill showing the reference and italicized verse text. A remove (×) button is available.
5. The user types their reflection in the **Your Note** text area. The character counter updates. Autosave triggers; the bottom bar shows "Saving…" then "Draft saved just now."
6. The user adds tags by typing in the tag input field. Autocomplete suggestions appear; selecting one adds a chip. Existing chips can be removed individually.
7. The user selects a **Visibility** option (Public, Community Only, or Private) from the radio card group. The selected card gains a highlighted border and filled icon.
8. The user clicks **Publish Note**. The button shows "Publishing…" with a spinner, then "Published!" before resetting.
9. Optionally, the user clicks **Save Draft** to explicitly save without publishing.

### 2. Write and Publish a Note (Mobile)

1. The user taps the FAB (or the **Add Note** bottom nav item) from the feed.
2. The **New Note** screen opens. A back button ("Notes") and a text-link "Publish" button are in the top nav.
3. The user enters a Bible reference in the input field. Quick-pick verse hint pills are shown below the field for common references.
4. Selecting a hint pill or typing a known reference displays a **scripture preview card** with the verse text and reference.
5. The user types their note body in the text area (character limit shown as `x / 2000`).
6. Optionally, the user selects a **mood** from the emoji button row.
7. The user toggles topic/category chips (preset list; active chips are filled, inactive are outlined). An "Add" chip allows custom entry.
8. The user selects a visibility option (Public, Community, Private) from the three-card row.
9. The user taps **Publish Note** (primary button) or **Save Draft** (secondary button) in the sticky bottom bar.

### 3. Browse the Community Feed (Desktop)

1. The user opens or navigates to the Feed / Home section.
2. The top bar displays a search field, Filter button, Sort button, and a "Share a Note" CTA.
3. Feed tabs allow filtering: All Notes, Following, New Testament, Old Testament, Psalms. The active tab is underlined.
4. Note cards are displayed in a two-column masonry grid. Each card shows contributor info, verse pill, title, excerpt, optional quote block, chips, and action buttons.
5. The user may like (heart), bookmark, or navigate to the full note via "Read →" on any card.
6. The right sidebar displays Verse of the Day, Trending Verses, Active Members, and Upcoming Study widgets.

### 4. Browse the Community Feed (Mobile)

1. The user lands on the Home tab. The top bar shows the logo, notification bell, search icon, and avatar.
2. A horizontally scrollable category chip strip filters the feed.
3. Note cards are displayed in a single-column list. The first card may be featured (dark treatment, "Trending Today" badge).
4. The user scrolls to browse notes and can like, bookmark, or tap "Read →" on any card.
5. A FAB in the lower-right provides a shortcut to compose a new note.

### 5. Read a Note (Desktop)

1. From the feed, the user clicks "Read →" on a note card.
2. The Note Detail page opens with a breadcrumb back to Feed.
3. The page displays the note title, author row (name, church, date, read time, Follow button), scripture callout block (verse + reference), full body text, tags, and the reaction bar (Like, Save, Share).
4. The user may toggle Like (heart count updates), toggle Save (button label changes to "Saved"), or click Share (confirmation state).
5. The user may click Follow to follow the author (button toggles to "Following").
6. Below the reaction bar, the Reflections section lists existing comments. The user types in the inline textarea and submits to append a new comment. The count in the heading updates.
7. The right sidebar shows Related Notes cards (verse, title, author avatar, tags) and Suggested Passages list items.

### 6. Read a Note (Mobile)

1. From the feed, the user taps a note card or "Read" button.
2. The Note Detail screen opens with a back arrow in the top nav.
3. A thin reading progress bar below the top nav advances as the user scrolls.
4. The screen shows category tag, title, author row (with Follow and More actions), scripture callout, body, tags, and the reactions row (heart count, comment count, Share).
5. A bookmark icon in the top nav toggles save state (filled/outlined, yellow when bookmarked).
6. Tapping the comment count scrolls to the Reflections section.
7. A fixed bottom input bar with a text field and send button allows the user to add a comment. Sending appends the comment and updates the count.

---

## States and Variants

### Verse Lookup
- **Empty:** Input shows placeholder text; no dropdown.
- **Typing:** Dropdown appears with suggestion rows. The first row may be pre-highlighted.
- **Selected:** Input is hidden; a selected-verse pill appears with reference, quoted text, and a remove button.
- **Cleared:** Tapping the remove button returns to the empty input state.
- **Mobile quick-picks:** Static hint pills are shown below the input; disappear or are supplemented by the scripture preview card once a known reference is entered.

### Note Textarea
- **Empty:** Italic placeholder text is shown.
- **Focused:** Border highlights in teal; soft glow shadow applied.
- **Near limit (mobile):** Character counter turns red when approaching 2000 characters.

### Visibility Selector
- **Default selected:** Community Only is pre-selected on both desktop and mobile.
- **Selected state:** Card has highlighted border, filled/colored icon.
- **Unselected state:** Card has neutral border and muted icon.

### Autosave Indicator (Desktop)
- **Idle (saved):** Green dot + "Draft saved just now."
- **Saving:** Pulsing muted dot + "Saving…"

### Tag Input (Desktop)
- **With chips:** Existing chips shown inline; remove button on each chip.
- **Autocomplete open:** Suggestion list appears below the input.

### Tag Chips (Mobile)
- **Active chip:** Filled teal background.
- **Inactive chip:** White background, outlined border.
- **Add chip:** Dashed border, triggers custom tag entry.

### Publish Button
- **Default:** Primary filled style.
- **Publishing:** Spinner + "Publishing…" label; button disabled.
- **Success:** Check icon + "Published!" briefly before reset.

### Save Draft Button
- **Default:** Ghost/outlined style.
- **Saved confirmation:** Check icon + "Saved!" with sage-colored treatment, briefly before reset.

### Feed Cards
- **Default:** Subtle shadow, white/cream background.
- **Hover (desktop):** Elevated shadow, slight upward translate, teal border tint.
- **Featured (mobile):** Dark inverted card with "Trending Today" badge.
- **Liked state:** Heart icon filled red; count incremented.
- **Bookmarked state:** Bookmark icon filled teal.

### Note Detail — Reaction States
- **Unliked:** Heart outline; neutral border.
- **Liked:** Heart filled red; warm border and tint background.
- **Unsaved:** Bookmark outlined; "Save" label.
- **Saved:** Bookmark filled teal; "Saved" label.
- **Share:** Default on click transitions to "Copied!" confirmation for ~2 seconds.

### Bookmark (Mobile Detail Top Nav)
- **Bookmarked:** Icon filled yellow.
- **Not bookmarked:** Icon outlined clay.

### Follow Button
- **Unfollow state:** Outlined button, "Follow" label.
- **Following state:** Filled teal button, "Following" with check icon.

### Comment Input
- **Empty:** Placeholder text; send button present.
- **Focus (desktop):** Border highlights teal with glow shadow.
- **Submitted:** New comment appended with fade-in animation; input cleared; count updated.

### Reading Progress Bar (Mobile Detail)
- Initialized at ~0%; advances proportionally as the user scrolls the content; minimum visible width of ~4%.

### Mobile Bottom Nav
- Active item highlighted in sage-green with active indicator dot; icon slightly raised on hover.

---

## Acceptance Criteria

### Bible Reference Lookup
- The user can type a partial reference (e.g., "John 3") and see a dropdown of matching verses.
- Each dropdown row displays the reference, verse text, and translation label.
- The user can select a verse from the dropdown; the input is replaced by a pill showing the reference and verse text.
- The user can remove the selected verse by clicking the × button on the pill, returning to an empty input.
- On mobile, tapping a hint pill pre-fills the input and shows a scripture preview card.
- If the entered reference matches a known verse, the scripture preview card displays the quoted text and reference.

### Note Composer
- The text area accepts multi-line input with a minimum height.
- The character count updates in real time as the user types.
- On mobile, the character counter turns red when the user approaches 2000 characters.
- The formatting toolbar buttons toggle an active state when clicked.
- The system autosaves the draft periodically; the autosave indicator transitions from "Saving…" to "Draft saved just now" after saving completes.

### Mood Selector (Mobile)
- Tapping a mood emoji button applies a selected visual state to that button and deselects any previously selected mood.

### Tag Management (Desktop)
- The user can type in the tag input field and see autocomplete suggestions matching the entered text.
- Selecting a suggestion adds a chip to the input row.
- Pressing Enter or comma while typing a tag name adds the tag as a chip without a suggestion.
- Pressing Backspace when the input is empty removes the last chip.
- The user can remove any chip by clicking its × button.

### Tag Management (Mobile)
- The user can toggle preset category chips between active (filled) and inactive (outlined) states by tapping them.
- Tapping the "Add" chip allows entry of a custom tag.
- Custom tags appear as active chips in the chip palette.

### Visibility Control
- Three visibility options are presented: Public, Community Only, Private.
- Community Only is selected by default.
- Selecting an option highlights the card and fills the associated icon; the previously selected option reverts to unselected state.
- Only one option may be selected at a time.

### Draft Saving
- Clicking "Save Draft" triggers the autosave animation and shows a "Saved!" confirmation on the button for approximately 2 seconds before resetting.

### Note Publishing
- Clicking "Publish Note" (or the "Publish" text button on mobile) transitions the button to a loading state ("Publishing…" with spinner).
- After approximately 1.5 seconds the button shows "Published!" confirmation for approximately 2.5 seconds before resetting.
- During the publishing state the button is disabled and cannot be clicked again.

### Community Feed
- The feed displays note cards in a two-column masonry grid (desktop) or single-column list (mobile).
- Each card shows contributor avatar, name, timestamp, verse pill, note title, truncated excerpt, optional verse quote block, topic chips, and engagement action buttons.
- The total note count for the day is displayed in the feed header (desktop) and feed header row (mobile).

### Feed Filtering (Desktop)
- Typing in the search field is accepted; the field is visible and focusable.
- Clicking a feed tab changes its active/underline state; only one tab may be active at a time.
- Filter and Sort buttons are present and interactive.

### Feed Category Chips (Mobile)
- The chip strip is horizontally scrollable.
- Tapping a chip sets it to active state and deactivates the previously active chip.

### Featured Card (Mobile)
- The first note card in the feed may render with a dark inverted theme and a "Trending Today" badge.
- All standard card actions (like, bookmark, read) remain functional on the featured card.

### Like Action
- Clicking the heart/like button toggles between liked (filled red icon, incremented count) and unliked (outlined icon, decremented count) states.

### Bookmark Action
- Clicking the bookmark button toggles between bookmarked (filled icon, teal color) and unbookmarked (outlined icon, muted color) states.

### Share Action
- Clicking Share transitions the button to a "Copied!" confirmation state for approximately 2 seconds before reverting.

### Follow Author
- Clicking "Follow" on a note detail page changes the button to "Following" with a check icon and filled background.
- Clicking again reverts the button to the "Follow" state.

### Reading Progress Bar (Mobile Detail)
- The progress bar width increases proportionally as the user scrolls through the note content.
- The bar has a minimum visible width at 0% scroll.

### Comments / Reflections
- Existing comments display commenter avatar, name, timestamp, comment text, like count, and a Reply button.
- The user can type a comment in the input field and submit by clicking the send button (mobile) or pressing Enter (desktop, non-shift).
- Submitting a non-empty comment appends a new comment item to the thread with a fade-in transition, clears the input, and increments the comment count in the section heading.
- The user cannot submit an empty comment.
- Per-comment like buttons toggle between liked and unliked states with count updates.

### Right Sidebar Widgets (Desktop)
- Trending Verses widget displays at least five ranked verses with note counts and trend percentages.
- Active Members widget displays member avatars with online presence indicators (green dot) for currently active members.
- Verse of the Day widget displays a scripture quote and reference.
- Upcoming Study widget displays event title, passage reference, date/time, and attendee count.
- Related Notes cards on the detail view display verse, title, author avatar/name, and tags; each card is clickable.
- Suggested Passages list items display a reference and theme label; each item is clickable.

### Navigation
- The active sidebar nav item is visually highlighted with a distinct background and accent marker (desktop).
- Navigating to a section updates the active nav item.
- Nav badges display unread or new-item counts and are visible when non-zero.
- The bottom tab bar active item is highlighted in sage-green with an indicator dot (mobile); tapping a tab updates the active state.
- The breadcrumb on the note detail view provides a back link to the feed.
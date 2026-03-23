# Design System Specification: The Analog Digitalist

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Heirloom"**

This design system rejects the cold, sterile nature of modern productivity apps in favor of an "Emotional Archive." We are not building a database; we are crafting a digital version of a premium, heavy-stock paper journal. 

To break the "template" look, this system utilizes **Intentional Asymmetry**. Instead of perfectly centered grids, we use generous, unequal margins that mimic the gutter of a physical book. We prioritize **Tonal Depth** over structural lines, ensuring the UI feels like a series of layered, high-quality papers rather than a flat screen. The experience should feel slow, intentional, and deeply personal.

---

## 2. Colors & Surface Philosophy
The palette is rooted in `surface` (#faf9f6), a warm white that mimics unbleached paper. The primary accent, a calming Sage Green (`primary`: #4f645b), is used sparingly to signify growth and continuity.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. 
Boundaries must be created through:
*   **Tonal Shifts:** Placing a `surface-container-low` (#f4f4f0) element against a `surface` background.
*   **Negative Space:** Using the Spacing Scale (specifically `8` or `10`) to create a cognitive break between content blocks.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. 
*   **Base Layer:** `surface` (#faf9f6) for the main background.
*   **Secondary Content (e.g., Sidebars):** `surface-container` (#eeeeea).
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide a "lifted" feel.
*   **Modal/Overlay Layers:** Use Glassmorphism by applying `surface` at 80% opacity with a `backdrop-filter: blur(20px)` to maintain a sense of environmental awareness.

### Signature Textures
For primary CTAs or the 'Fire' streak counter background, use a subtle linear gradient from `primary` (#4f645b) to `primary-container` (#d1e8dd). This adds a "silk-press" ink quality that flat colors lack.

---

## 3. Typography
The typography is the soul of this system. We use **Noto Serif KR** to evoke the tactile sensation of a fountain pen on paper, complemented by **Manrope** for functional metadata to ensure legibility.

*   **Display (Display-LG/MD):** Used for dates and emotional headers. The large scale (up to 3.5rem) emphasizes the "Life Chapter" feel.
*   **Body (Body-LG):** Set at 1rem. This is the "Journal Entry" font. It must have a line-height of 1.8 to mimic lined paper.
*   **Labels (Label-MD/SM):** Set in Manrope. These are the "marginalia"—small, functional notes like timestamps or weather data that shouldn't distract from the main prose.

**Identity Note:** Korean characters (Hangeul) have a natural squareness. By using a Serif font with generous `3.5 (1.2rem)` letter-spacing in titles, we soften the grid and create a poetic, editorial rhythm.

---

## 4. Elevation & Depth
Traditional drop shadows are too "tech." We utilize **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** To highlight a diary entry, do not add a border. Place a `surface-container-lowest` card on a `surface-container-low` background. The subtle 2% difference in luminosity creates a natural edge.
*   **Ambient Shadows:** For floating elements (like a FAB or Mood Picker), use a diffused shadow: `box-shadow: 0 10px 40px rgba(48, 51, 48, 0.06);`. The shadow color is derived from `on-surface`, making it feel like a natural cast-shadow on paper.
*   **The Ghost Border:** If a form field requires a container, use `outline-variant` (#b0b3ae) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons & Interaction
*   **Primary Button:** Rounded `xl` (1.5rem). Background is `primary`, text is `on-primary`. Use a slight `surface-tint` overlay on hover to simulate a physical press.
*   **Ghost Action:** For "Cancel" or "Back," use `on-surface-variant` with no container. Typography alone drives the action.

### The "Paper" Card
*   **Style:** Forbid all divider lines.
*   **Padding:** Use `6` (2rem) for internal padding to give the text "room to breathe."
*   **Corners:** Use `lg` (1rem) for a friendly, organic feel.

### Input Fields (Journal Entry)
*   **Text Area:** No borders. The active state is signaled by the cursor and a subtle background shift to `surface-container-lowest`. 
*   **Placeholder Text:** Set in `outline` color, italicized to look like a faint pencil sketch.

### Streak Counter (The 'Fire' Emoji)
*   **Styling:** Encased in a `secondary-container` chip with `full` rounding. The 'Fire' emoji should be the only high-saturation element in the UI, acting as a "burning ember" on the page.

### Weather & Mood Icons
*   **Style:** Custom monoline strokes using the `primary` color. Avoid solid fills. The icons should look like hand-drawn illustrations in the margin of a notebook.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins (e.g., `margin-left: 8`, `margin-right: 4`) for a "Book Gutter" effect.
*   **Do** prioritize Hanja or Hangeul characters as visual elements themselves.
*   **Do** use `surface-container-highest` for "Pressed" states to show depth.

### Don't
*   **Don't** use pure black (#000000). Always use `on-surface` (#303330) for text to maintain the "ink on paper" softness.
*   **Don't** use 90-degree corners. Everything must have at least a `sm` (0.25rem) radius.
*   **Don't** use standard "Success" greens. Use the `primary` sage green for all positive reinforcements to maintain the brand's emotional tonal range.
*   **Don't** use dividers. If you feel you need a line, use a `2rem` vertical gap instead.
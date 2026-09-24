# Web Interface Guidelines & Agent Operating Instructions (Vercel & Ecossistema Montanha)

> Concised and actionable rules for building accessible, fast, resilient, and delightful web interfaces.
> Any AI agent (Antigravity, Cursor, Claude Code, Windsurf) operating in this repository MUST comply with these instructions from the first iteration.

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting published git history — force pushing, or rebasing/amending/squashing commits that are already pushed — as it rewrites history on Lovable's side and the user will likely lose their project history.
> Commits you push to the connected branch sync back to Lovable and show up in the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

---

## 1. Ecossistema Montanha Core Rules (MANDATORY)

- **Git Author Identity (MUST):** Always commit with the verified GitHub author:
  ```bash
  git commit --author="Coach-Montanha <Coach-Montanha@users.noreply.github.com>" -m "..."
  ```
  *Rationale:* Prevents the Vercel Hobby team collaboration lock 🔒 (`The deployment was blocked because Vercel couldn't find a Git account for the commit author`).
- **SSR & Serverless Nitro Bundling (MUST):** Keep `"tslib": "^2.8.1"` in `dependencies` of `package.json` and `inline: ["tslib"]` in `nitro.externals` inside `vite.config.ts`.
  *Rationale:* Prevents fatal `500 Internal Server Error` on Vercel AWS Lambda (`Cannot find package 'tslib' imported from /var/task/_libs/...`).
- **Unified 10-Digit PIN & Legacy Codes (MUST):** User authentication supports exactly 10 numeric digits (`/^\d{10}$/`) and legacy trial format (`MTN-XXXX`).
- **1-Click WhatsApp Onboarding (MUST):** All apps recognize URL activation query parameters (`?trial=1&email=...&pass=...`) allowing instant entry without auth obstacles.
- **Autonomous Git Sync (MUST):** When completing user tasks, verify build (`bun run build` exit code 0), stage changes, commit with verified author, and push to `origin main` autonomously.

---

## 2. Web Interface Guidelines (Vercel Standards)

### 2.1. Interactions

#### Keyboard & Focus
- **MUST:** Full keyboard support across all interactive elements per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/).
- **MUST:** Visible, unobscured focus rings using `:focus-visible` (group with `:focus-within`). Sticky headers, footers, and overlays must never cover the focused element.
- **MUST:** Manage focus (focus traps, move, and return) properly in modals and drawers.
- **NEVER:** `outline: none` without a clear, accessible visual focus replacement.

#### Targets & Input
- **MUST:** Hit target size ≥ 24px (mobile ≥ 44px). If visual target is < 24px, expand the interactive hit area with transparent padding.
- **MUST:** Mobile `<input>` font-size ≥ 16px to prevent iOS Safari auto-zoom/pan on focus.
- **NEVER:** Disable browser zoom (`user-scalable=no`, `maximum-scale=1`).
- **MUST:** Set `touch-action: manipulation` on buttons, links, and inputs to eliminate the 300ms double-tap zoom delay.
- **SHOULD:** Set `-webkit-tap-highlight-color: transparent` (or matching design) to eliminate ugly browser tap overlays.

#### Forms & Validation
- **MUST:** Hydration-safe inputs: inputs must never lose focus or value during or after hydration.
- **NEVER:** Block paste in `<input>` or `<textarea>`. Allow password managers, 2FA codes, and copied tokens.
- **MUST:** Loading buttons must show a spinner and **keep the original label text** (never wipe the label).
- **MUST:** `Enter` submits single-line inputs; in `<textarea>`, `Cmd/Ctrl + Enter` submits.
- **MUST:** Keep submit button enabled until request starts; then disable during in-flight request with a spinner.
- **MUST:** Accept free text and validate after submission or on blur — do not block keystrokes silently.
- **MUST:** Allow submitting incomplete forms to surface field-level validation feedback.
- **MUST:** Errors placed inline next to fields; on submit error, automatically focus the first invalid field.
- **MUST:** Explicit `autocomplete` attribute and meaningful `name` attribute on all inputs for autofill.
- **MUST:** Correct `type` and `inputmode` (`numeric`, `email`, `tel`, etc.) for optimal virtual keyboards.
- **SHOULD:** Disable `spellcheck` for emails, codes, usernames, and passwords.
- **SHOULD:** Placeholders end with an ellipsis (`…`) and demonstrate example formats (e.g., `(11) 98765-4321…`).
- **MUST:** Warn on unsaved changes before page navigation when user data could be lost.
- **MUST:** Automatically trim trailing whitespace on inputs to prevent validation errors caused by mobile autocorrect.
- **MUST:** No dead zones on checkboxes and radios: label and control share a single hit target.

#### State & Navigation
- **MUST:** URL reflects view state (deep-link filters, active tabs, pagination, and open dialogs via query params).
- **MUST:** Back/Forward navigation restores previous scroll position.
- **MUST:** Navigation links use semantic `<a>` or framework `<Link>` (supporting Cmd/Ctrl+Click, middle click, right click).
- **NEVER:** Use `<div onClick>` or `<button>` for navigational links.

#### Feedback & Touch
- **SHOULD:** Optimistic UI: update immediately on user action; reconcile on response; rollback or offer Undo on failure.
- **MUST:** Destructive actions require explicit confirmation or provide an Undo window.
- **MUST:** Use polite `aria-live` for toasts and inline notifications.
- **SHOULD:** Use the ellipsis character (`…`, not three dots `...`) for buttons that open dialogs ("Renomear…") and loading states ("Salvando…").
- **MUST:** Tooltip timing: delay the first tooltip in a group (~300ms); subsequent peer tooltips display instantly.
- **MUST:** `overscroll-behavior: contain` in modals, sheets, and drawers to prevent parent scroll chaining.
- **MUST:** During drag operations, disable text selection and apply `inert` to dragged elements.
- **MUST:** Every gesture (drag, swipe, pinch) has a keyboard and tap/click equivalent.
- **MUST:** If an element looks clickable, it MUST be interactive. No dead zones.
- **SHOULD:** Autofocus on desktop only when there is a single primary input; avoid autofocus on mobile.

---

### 2.2. Animation & Motion
- **MUST:** Honor `prefers-reduced-motion` (provide reduced-motion variant or disable motion).
- **SHOULD:** Preference order: CSS transitions/animations > Web Animations API > JavaScript libraries.
- **MUST:** Animate compositor-friendly GPU properties (`transform`, `opacity`) only.
- **NEVER:** Animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
- **NEVER:** `transition: all` — explicitly declare animated properties (`transition: opacity 150ms ease, transform 150ms ease`).
- **SHOULD:** Animate only when it clarifies cause-and-effect or adds deliberate functional delight.
- **MUST:** Animations must be cancelable and interruptible by new user interactions.
- **MUST:** Autoplay motion > 5 seconds has visible pause, stop, or hide controls.
- **MUST:** Correct `transform-origin` anchored to where motion physically starts.
- **MUST:** SVG transforms applied to `<g>` wrappers with `transform-box: fill-box; transform-origin: center;`.

---

### 2.3. Layout & Visual Design
- **SHOULD:** Optical alignment: adjust ±1px when human perception beats rigid geometry.
- **MUST:** Deliberate alignment to grid, baseline, or edges — no accidental positioning.
- **SHOULD:** Balance icon and text lockups (matching visual weight, size, spacing, and color).
- **MUST:** Responsive coverage: verify on mobile (375px), laptop (1440px), and ultra-wide (>2000px).
- **MUST:** Respect safe areas with `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, etc.
- **MUST:** Prevent unwanted scrollbars and horizontal layout overflow.
- **SHOULD:** Concentric nested radii: `Inner Radius = Outer Radius - Padding`.
- **SHOULD:** Layered shadows: combine ambient light with direct light in at least 2 layers for realistic depth.
- **SHOULD:** Crisp semi-transparent borders combined with soft shadows.
- **SHOULD:** Tint borders, shadows, and secondary text toward the background hue for cohesive color harmony.

---

### 2.4. Content & Accessibility
- **SHOULD:** Inline explanations first; tooltips only as a last resort.
- **MUST:** Skeletons mirror final layout dimensions exactly to eliminate Cumulative Layout Shift (CLS).
- **MUST:** Document `<title>` accurately reflects the current page and sub-view context.
- **MUST:** No dead ends: every screen offers a recovery path or clear next action.
- **MUST:** Explicit design for empty states, sparse data, dense lists, and error states.
- **SHOULD:** Curly quotes (“ ”) and balanced text wrapping (`text-wrap: balance` on headings).
- **MUST:** `font-variant-numeric: tabular-nums` (or Tailwind `tabular-nums`) for timers, counters, currency, and numerical comparisons.
- **MUST:** Redundant status cues: never convey state through color alone; always pair with icons/text.
- **MUST:** Accessible names exist on all interactive elements even when visual labels are hidden.
- **MUST:** Headings have `scroll-margin-top` to account for sticky navigation bars.
- **MUST:** Long text resilience: text containers must handle long strings (`truncate`, `line-clamp-*`, `break-words`). Flex children need `min-w-0` to allow truncation.
- **MUST:** Icon-only buttons must have descriptive `aria-label`.
- **MUST:** Decorative graphics have `aria-hidden="true"`.
- **MUST:** Locale-aware formatting for currency, dates, and times (`Intl.NumberFormat`, `Intl.DateTimeFormat`).
- **MUST:** Non-breaking spaces between numbers and units (`10&nbsp;MB`, `500&nbsp;ms`, `R$&nbsp;100`).

---

### 2.5. Performance
- **MUST:** Zero Cumulative Layout Shift (CLS): explicit `width` and `height` (or aspect-ratio) on all images and embeds.
- **MUST:** Preload critical above-the-fold images; lazy-load all off-screen assets.
- **MUST:** Critical fonts preloaded with `font-display: swap`.
- **SHOULD:** Preconnect to external CDN domains (`<link rel="preconnect" href="...">`).
- **SHOULD:** Use `<video autoplay muted loop playsinline>` instead of animated GIFs for looping graphics.
- **MUST:** Offload long tasks to Web Workers to keep the main UI thread responsive (60fps).
- **MUST:** Virtualize large lists (>50 items) to maintain DOM lightness.
- **MUST:** Mutations (`POST`/`PATCH`/`DELETE`) target response times under 500ms.

---

### 2.6. Dark Mode & Theming
- **MUST:** `color-scheme: dark` explicitly declared on `<html>` for dark themes so browser scrollbars and inputs render with proper contrast.
- **SHOULD:** `<meta name="theme-color">` dynamically matches the active page background (`#09090b` / `#000000`).
- **MUST:** Native `<select>` elements must have explicit `background-color` and `color` set to prevent invisible text bugs in Windows dark mode.

---

### 2.7. Copywriting (Vercel Style)
- **Active voice:** Use clear directives ("Instale o CLI" instead of "O CLI será instalado").
- **Title Case in buttons and headings:** Capitalize principal words (e.g., "Criar Projeto", "Salvar Alterações").
- **Clear & concise:** Use the fewest words necessary to convey the exact action.
- **Numerals for counts:** Always use digits ("8 deploys", not "oito deploys").
- **Action-oriented error messages:** State the issue and provide immediate resolution steps (e.g., "Chave de API expirada. Gere uma nova chave nas configurações da sua conta.").

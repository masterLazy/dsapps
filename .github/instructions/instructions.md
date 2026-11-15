# dsapps — UI Design Instructions

Purpose
- Provide a single-page, actionable instructions file describing the UI design language used across the repository and how agents/devs should implement or update UI.
- Target audience: contributors, automated agents, and CI checks.

Scope
- Applies to all pages under the repo root except where explicitly noted in "Exceptions".
- Primary focus: pages using the Material-like token set (index.html, a1z26.html, format.html, gen.html, graph.html, masonry.html). These pages follow an M3-inspired design system implemented with CSS custom properties.

Design Tokens (canonical)
- Theme preference: `system`, `light`, or `dark`, persisted as `dsapps-theme` in local storage. Shared pages resolve system preference before first paint and expose the reusable `.theme-picker` control.
- Color values: define light and dark semantic values only in `styles/tokens.css`; page/component styles must use semantic tokens rather than hardcoded surface/text colors.
- Color tokens (CSS custom properties):
  - --primary: #4f7c9e
  - --on-primary: #fff
  - --primary-container: #d1e4f5
  - --on-primary-container: #1a3a4f
  - --secondary: #6b7d8e
  - --surface: #f8fafc
  - --surface-dim: #dde3e9
  - --surface-container: #edf1f5
  - --on-surface: #1b1c1e
  - --on-surface-variant: #44474a
  - --outline: #7b8086
  - --outline-variant: #c2c7cd
  - --error: #ba1a1a
- Spacing & shape:
  - --radius-sm: 8px
  - --radius-md: 12px
  - --radius-lg: 16px
  - --radius-full: 9999px
  - --duration: 0.2s
- Elevation & shadow:
  - --elevation1: subtle card shadow
  - --elevation2: stronger hover shadow
- Typography:
  - --font: 'Inter', system fallbacks
  - Body base ≈ 0.875rem; headings use 600 weight

Principles & Tone
- Clean, utilitarian, soft pastels and subtle elevation.
- Rounded corners, consistent spacing, and gentle motion on hover/active.
- Prefer readable text contrast and muted variants for secondary text.

Core Components (classes & rules)
- Top bar: `.top-bar` — sticky, 12–24px vertical padding, border-bottom: `1px solid var(--outline-variant)`.
- Container: `.container` — centered, max-width varies by page (apps ~680px, index/graph ~1100–1200px), padding 24–32px.
- Buttons: `.btn` base + modifiers:
  - `.btn--primary` (filled primary), `.btn--outline`, `.btn--danger`, `.btn--full` (100% width).
  - Rounded with `--radius-full`, hover shows background/light elevation, active state scales to ~0.97.
- Chips: `.chip` + `.chip--selected` — use for mode toggles, selected uses `--primary-container` and primary border.
- Cards: `.app-card`, `.info-card`, `.action-card` — `--radius-md`, border `1px solid var(--outline-variant)`, hover lifts with `--elevation2`.
- Inputs & textareas: 2px border `var(--outline-variant)`, focus -> `border-color: var(--primary)`.
- Search: `.search-wrap` uses `:focus-within` to highlight border.
- Results & copy: `.result-box` background `var(--surface-container)`; copy control `.copy-btn` top-right with `.copied` state styling.
- Modals: `.modal` overlay with semi-opaque background + `backdrop-filter: blur()`, modal card uses `--radius-lg` and pop animation.
- Responsive: use breakpoints at ~860px, 740–820px, 640px, 480px. Stack sidebars and reduce header sizes accordingly.

Behavioral & JavaScript Conventions
- Prefer progressive enhancement: minimal HTML/CSS first, JS for behavior.
- Copy interactions: use `navigator.clipboard` with textarea fallback.
- Gallery tagging: filename-based tag parsing expects `-` delimited parts and optional `[class]tag` syntax; maintain this parser when changing filename conventions.
- Graphs: D3-based force simulation, create arrow markers per-edge for directed graphs; selection toggles stroke width for feedback.

Accessibility
- Keep interactive hit targets reasonably large (buttons/chips >= 40px high when possible).
- Use `<label>` for inputs and `aria-label` for icon-only controls.
- Escape key should close modals; focus should not be trapped unless modal is opened programmatically and ARIA focus management is added.

CSS/Naming Conventions
- Use descriptive class names, prefer modifiers with `--` (`.chip--selected`, `.btn--primary`).
- Define design tokens only in `styles/tokens.css`; do not copy `:root` token blocks into pages.
- Keep global resets and document defaults in `styles/base.css`, and reusable components in `styles/components.css`.
- Keep page-specific rules in `styles/pages/<page>.css`. Page styles load before `styles/shared.css`, so shared component rules remain canonical; add page-specific selectors rather than redefining shared component selectors.
- Avoid inline styles where possible; prefer classes and CSS variables.

Project & Shared Component Workflow
- This repository uses Vite as a static multi-page build. The root HTML files are page entries and retain their individual `.html` URLs; do not convert the tools to a client-side router or SPA.
- Run `npm run dev` for local work and `npm run build` to generate `docs/`. Do not edit generated files in `docs/`.
- Shared navigation/header and footer markup live in `src/partials/site-header.html` and `src/partials/site-footer.html`. Page entries use the `dsapps:site-header` and `dsapps:site-footer` markers, which the Vite plugin replaces at build time.
- Before adding a component, check whether it is useful on more than one page. If it is, implement it once in the appropriate shared stylesheet or partial, then use it from every applicable page. Do not copy a shared component's markup or styles between pages.
- When making an existing page component reusable, move its canonical styles/markup to the shared location and update all affected pages in the same change. Keep truly page-specific behavior and layout in that page's CSS/HTML.
- `cmo.html` is an archived legacy game source and is not included in the current build output. Do not delete it unless explicitly requested.
- `cmo_2.html` is the active independent game theme, copied unchanged with its `sound/` assets; keep it outside the shared site theme controls unless explicitly re-theming it.

Exceptions
- `cmo.html` is an archived legacy/game theme and intentionally diverges (vivid gradients, Font Awesome, different tokens). Do not migrate it to the M3 token set unless intentionally re-theming the archived game.

Migration & Enforcement Guidance
- New pages should follow the Vite multi-page pattern: add the HTML entry to `vite.config.js`, add its title/heading/description metadata to the shared shell plugin, link its page stylesheet before `styles/shared.css`, and use the shared shell markers.
- Every shared component change must be checked across all pages that use it, including responsive states. Keep `cmo.html` excluded.

Example prompts for automated edits or agents
- "Refactor `index.html` to import `styles/tokens.css` and remove duplicate `:root` variables while preserving visual output. Keep `cmo.html` unchanged."
- "Create a reusable `.btn--primary` component in `styles/components.css` and update `gen.html`, `format.html`, and `a1z26.html` to use it."

What to watch for (review checklist)
- Visual diff: confirm primary/secondary colors match after token centralization.
- Interactions: hover/active motion remains subtle (translateY, small shadow changes).
- Accessibility: labels and keyboard behaviors preserved.

— End of instructions

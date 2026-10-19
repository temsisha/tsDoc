# Repository Guidelines

## Project Structure & Module Organization

This repository is a dependency-free static documentation site. All production files live at the repository root:

- `index.html` contains the documentation content, navigation, search modal, and semantic page structure.
- `styles.css` defines the responsive layout, component styles, color tokens, and light/dark themes.
- `app.js` provides navigation highlighting, mobile-menu behavior, theme persistence, search, and copy buttons.

Keep related HTML, CSS, and JavaScript changes synchronized. Section IDs in `index.html` are used by sidebar links, the table of contents, URL hashes, and the search index.

## Build, Test, and Development Commands

There is no package manager or build step. Serve the repository with any static HTTP server; for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. A server is preferred over opening `index.html` directly because it more closely matches deployment behavior. Before submitting changes, inspect the page at desktop and mobile widths and test both themes. Use `git diff --check` to catch whitespace errors and `git status --short` to confirm the intended files are included.

## Coding Style & Naming Conventions

Follow the existing plain HTML/CSS/JavaScript style; do not introduce frameworks or dependencies without discussion. Use two-space indentation in HTML and CSS and four-space indentation in JavaScript. Prefer semantic HTML and preserve accessibility attributes such as `aria-label` and `aria-hidden`.

Use kebab-case for CSS classes and section IDs (`mobile-menu-button`, `complete-flow`) and camelCase for JavaScript variables and functions (`searchTrigger`, `openSearch`). Add reusable colors and layout values as CSS custom properties in `:root`, with corresponding dark-theme overrides when needed.

## Testing Guidelines

No automated test framework or coverage requirement is currently configured. Manually verify navigation links, scroll highlighting, `Ctrl/Cmd+K` search, copy buttons, theme persistence, and the mobile sidebar. Check the browser console for errors. For content edits, confirm protocol examples remain valid JSON and match the surrounding explanation.

## Commit & Pull Request Guidelines

The short history uses brief messages (`first commit`, `updated`, `change`), but contributors should use clear, imperative summaries such as `Clarify initialization message flow`. Keep each commit focused.

Pull requests should explain the user-visible change, list manual checks performed, and link any relevant issue. Include screenshots for layout, theme, or responsive-design changes. Call out protocol-content changes explicitly so reviewers can validate technical accuracy.

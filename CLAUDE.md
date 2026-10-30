@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

- **portfolio-next**: bilingual (EN/UK) personal portfolio site, single Next.js 16 App Router app (not a monorepo), statically generated, deployed to Vercel.
- **Stack**: TypeScript (strict), SCSS Modules, Radix Primitives, next-intl (later), React Hook Form + zod (later), Jest + React Testing Library, Playwright (later).
- **Package manager**: pnpm; all pnpm settings live in `pnpm-workspace.yaml`, never in `.npmrc`.

## Commands

```bash
pnpm dev            # start dev server at http://localhost:3000
pnpm build          # production build
pnpm start          # serve production build
pnpm lint           # ESLint on the whole project
pnpm typecheck      # generate Next.js types, then tsc --noEmit
pnpm format         # Prettier write (whole project)
pnpm format:check   # Prettier check (CI / pre-push)
pnpm test           # Jest (single run)
pnpm test:watch     # Jest in watch mode
```

## Next.js version warning

This project uses **Next.js 16.4.3** with **React 19.3.0** — versions that may have breaking changes compared to training data. Before writing any Next.js-specific code, consult `node_modules/next/dist/docs/` for current APIs and conventions; see `AGENTS.md`.

## Architecture

- **Framework**: Next.js App Router (`src/app/`)
- **Path alias**: `@/*` resolves to `./src/*`
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`
- `src/app/layout.tsx` is the root layout — HTML shell, font variables, global providers. Page-level metadata is a `Metadata` export per route file.
- **Layout components**: `src/components/layout/` — `Header/` (client component with `useIsScrolled` hook), `Footer/` (server component).

## Conventions

- **Indentation**: 4 spaces; JSON, YAML, and Markdown use 2.
- **Imports**: two groups — packages first under `// outsource dependencies`, then local (`@/` alias and relative paths) under `// local dependencies`, one blank line between groups; within each group sort by line length, shortest first. ESLint (perfectionist) enforces this.
- **Styles**: SCSS Modules colocated with the component (`Component.module.scss`); no Tailwind, no CSS-in-JS.
- **Unit tests**: colocated next to the module as `*.test.tsx` / `*.test.ts`.
- **Component folders**: each component lives in its own folder (`ComponentName/`) containing `ComponentName.tsx`, `ComponentName.module.scss`, and `ComponentName.test.tsx`.
- **Commits**: Conventional Commits for commit messages and PR titles.
- **Tests**: import `describe`, `it`, `expect` explicitly from `@jest/globals`; no global Jest types (`@types/jest` is not installed).

## Checks

Before reporting a task as done run:

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Skip a script only if it does not exist yet, and say so in the report.

## Styling

- Token source: `src/styles/_tokens.scss` — SCSS maps for colors (light/dark), spacing, radius, shadows, layout, effects, and type styles. Emitted as CSS custom properties in `src/app/globals.scss` (light on `:root`, dark on `:root[data-theme="dark"]`).
- Shared SCSS utilities: `@use "styles" as *;` — resolves to `src/styles/_index.scss` (forwarding `_breakpoints.scss` and `_mixins.scss`); available from any SCSS file via `sassOptions.loadPaths: ["src"]` in `next.config.ts`.
- Components: use only `var(--)` for token values; never hard-code colors, spacing, radius, or type properties.
- Responsive breakpoints: `@include below(mobile)` / `@include below(tablet)` from `_breakpoints.scss`; never use CSS variables in media queries.
- Available mixins: `container`, `focus-ring`, `visually-hidden`, `text($style)` — see `src/styles/_mixins.scss` for the full list of type-style names.

## Rules for the agent

- Do NOT commit, push, create branches, or open PRs — the developer does that.
- Do not add dependencies a task does not ask for; if one seems necessary, propose it in the report instead.
- Keep research short and start implementing; stay within the files the task names.
- End every task with a short report: changed files, check results, open questions.

---
name: i18n-keys
description: >
  Use when adding or changing any user-visible text, aria-label, alt, title,
  placeholder, page metadata, or translation keys in messages/*.json.
---

# i18n-keys skill

## Where texts live

`messages/en.json` and `messages/uk.json`. Always edit both files in the same
change. `en.json` is the source of truth for types — `src/types/global.d.ts`
maps `Messages` to `typeof en`, so adding a key only in `uk.json` causes a
TypeScript error; missing it in `uk.json` fails the key-parity test in
`src/i18n/locales.test.ts`.

## Key structure

- One **namespace per component or page**, PascalCase, matching the component
  name exactly (e.g. `Header`, `Footer`, `Home`, `Metadata`).
- Keys are **camelCase**.
- Nest only for real logical groups: `nav.experience`, `brand.name`. Avoid
  nesting just to group loosely related strings.
- **Never reuse a key across namespaces.** If the same English string appears in
  two components, each gets its own key — they may diverge in Ukrainian.
- No generic `Common` namespace unless the exact same text is shared by multiple
  independent components (rare).

## How to use translations

**Client components and server components (non-async):**

```tsx
const t = useTranslations("Header");
// → t("nav.experience"), t("brand.name"), …
```

**`generateMetadata` and async server components:**

```ts
const t = await getTranslations("Metadata");
// locale comes automatically from next/root-params
// → t("title"), t("description")
```

**Server Actions** — root params are not available inside actions, so pass the
locale explicitly from the form:

```ts
const t = await getTranslations({ locale, namespace: "Contact" });
```

This will be relevant for the contact form.

**ICU params** — pass values as an object, never concatenate strings:

```json
{ "copyright": "© {year} Oleksandr Perekhrest" }
```

```tsx
t("copyright", { year: new Date().getFullYear() });
```

**Rich text** — use `t.rich`, never embed HTML in messages:

```tsx
t.rich("bio", { em: (c) => <em>{c}</em> });
```

## Ukrainian plurals

Ukrainian has four plural forms by CLDR last-digit rules:

- `one` — ends in 1, except 11 (1, 21, 101, …)
- `few` — ends in 2–4, except 12–14 (2, 22, 104, …)
- `many` — 0, ends in 5–9, or ends in 11–14 (5, 11, 12, 25, …)
- `other` — fractions (1,5)

English uses `one` / `other`.

**Example — years of experience:**

```json
// en.json
"years": "{count, plural, one {# year} other {# years}}"

// uk.json
"years": "{count, plural, one {# рік} few {# роки} many {# років} other {# року}}"
```

Outputs: `1 рік`, `21 рік`, `3 роки`, `22 роки`, `5 років`, `11 років`, `1,5 року`.

Note: ICU's `#` is formatted by the locale, so `uk` uses a decimal comma (`1,5`).

**Test with `renderWithIntl`:**

```tsx
import { describe, it, expect } from "@jest/globals";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/renderWithIntl";
import ExperienceYears from "./ExperienceYears";

describe("ExperienceYears (uk plurals)", () => {
  it.each([
    [1, "1 рік"],
    [21, "21 рік"],
    [3, "3 роки"],
    [11, "11 років"],
    [5, "5 років"],
    [1.5, "1,5 року"],
  ])("count %s → %s", (count, expected) => {
    renderWithIntl(<ExperienceYears count={count} />, { locale: "uk" });
    expect(screen.getByText(expected)).toBeTruthy();
  });
});
```

## What stays untranslated

- Job title **"Web Engineer"** — a proper professional title, used as-is in both
  locales (see `Header.brand.role`).
- Technology names: Next.js, SCSS, Radix, TypeScript, etc.
- Brand initials: "OP".

## Ukrainian wording

- Use **2019 orthography**: compound web- words written together —
  `вебсайт`, `веброзробник`, `вебдодаток`.
- Write natural Ukrainian, not a word-for-word translation of the English.
- **After every text change, show the user a review table before finalising:**

| Key             | en           | uk             |
| --------------- | ------------ | -------------- |
| `Namespace.key` | English text | Ukrainian text |

The user has the final word on Ukrainian wording. Do not mark the task done
until the table is approved.

## ESLint enforcement

`eslint.config.mjs` applies `no-restricted-syntax` to
`src/components/**` and `src/app/**` (excluding `*.test.tsx` and
`global-not-found.tsx`). It flags:

- `JSXText` containing Latin or Cyrillic letters.
- `aria-label`, `alt`, `title`, `placeholder` attributes with string literals.
- String literals inside JSX expression containers.

Any hardcoded visible text is a lint error — move it to `messages/*.json`.

## Done criteria

Run in order; all three must pass before reporting the task complete:

```bash
pnpm lint        # no hardcoded JSX text errors
pnpm typecheck   # unknown or missing keys are type errors
pnpm test        # key-parity test in src/i18n/locales.test.ts passes
```

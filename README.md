# Faster

Faster UI is a small, production-ready component library built for a Design System assignment. It ships Button, Input and Dialog primitives, backed by reusable design tokens, documented in Storybook, and covered by Jest and Cypress tests.

This is an [Nx](https://nx.dev) monorepo containing:

- **[`libs/faster`](./libs/faster)** — the `@chehovskii-a/faster` component library (published to GitHub Packages)
- **[`apps/showcase`](./apps/showcase)** — a demo app consuming the library
- **[`apps/showcase-e2e`](./apps/showcase-e2e)** — Cypress E2E tests for the showcase app

### Figma

- Original: https://www.figma.com/design/WYuHdUuUq31HzkdJhoKwXl/TapTap-Design-System%E4%B8%A8Developers--Community-?node-id=12-11244&p=f&t=IdkiBp7B4GxCdKAF-0
- Duplicate: https://www.figma.com/design/lXoWsgMekR00jKGtXIffk0/TapTap-Design-System%E4%B8%A8Developers--Community---Copy-?node-id=15-12480&p=f&t=NmaF1oCl62G1IJJ7-0

## Tech stack

- React + TypeScript
- Tailwind CSS + design tokens
- Jest + React Testing Library (unit tests)
- Cypress (component & e2e tests)
- Storybook (documentation & interactive controls)
- Nx (task orchestration) + GitHub Actions (CI/CD)

## Getting started

Requires Node.js 24 and npm.

```sh
npm ci
```

## Common tasks

Run against the whole workspace:

```sh
npx nx run-many -t lint test build typecheck component-test e2e build-storybook
```

Or target a single project (`faster` or `showcase`):

```sh
npx nx show project showcase
```

### Library (`faster`)

```sh
npx nx run faster:test            # Jest + React Testing Library
npx nx run faster:component-test  # Cypress component tests
npx nx run faster:storybook       # Storybook dev server
npx nx run faster:build           # library build (dist/)
```

### Showcase app

```sh
npx nx serve showcase       # dev server
npx nx build showcase       # production bundle
npx nx e2e showcase-e2e     # Cypress E2E tests
```

## Using the library

```sh
echo "@chehovskii-a:registry=https://npm.pkg.github.com" >> .npmrc
npm install @chehovskii-a/faster
```

```tsx
import '@chehovskii-a/faster/index.css';
import { Button, Dialog, Input } from '@chehovskii-a/faster';
```

See [`libs/faster/README.md`](./libs/faster/README.md) for library-specific details.

## CI/CD

- [`ci.yml`](./.github/workflows/ci.yml) runs on every push/PR: install, lint, test, build, typecheck, component tests, e2e, and Storybook build.
- [`publish.yml`](./.github/workflows/publish.yml) publishes `@chehovskii-a/faster` to GitHub Packages on release.

## Scaffolding reference

<details>
<summary>Commands used to generate this workspace</summary>

### Workspace

```sh
npx create-nx-workspace@latest faster \
  --preset=react-monorepo \
  --appName=showcase \
  --bundler=webpack \
  --unitTestRunner=jest \
  --e2eTestRunner=cypress \
  --ci=github \
  --style=css
```

### Library

```sh
npx nx g @nx/react:library libs/faster \
  --unitTestRunner=jest \
  --linter=eslint \
  --style=css
```

### Storybook

```sh
npx nx g @nx/react:storybook-configuration '@faster/faster'
```

### Components

```sh
npx nx g @nx/react:component libs/faster/src/lib/button/button \
  --export \
  --style=css

npx nx g @nx/react:component libs/faster/src/lib/input/input \
  --export \
  --style=css

npx nx g @nx/react:component libs/faster/src/lib/dialog/dialog \
  --export \
  --style=css
```

### Stories

```sh
npx nx g @nx/react:stories \
  --project='@faster/faster' \
  --interactionTests=true
```

### Component tests

```sh
npx nx g @nx/react:component-test \
  --project='@faster/faster' \
  --componentPath='lib/button/button.tsx'

npx nx g @nx/react:component-test \
  --project='@faster/faster' \
  --componentPath='lib/input/input.tsx'

npx nx g @nx/react:component-test \
  --project='@faster/faster' \
  --componentPath='lib/dialog/dialog.tsx'
```

</details>

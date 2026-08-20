# @chehovskii-a/faster

Faster UI — the Button, Input and Dialog primitives of the Faster design system.

Published to GitHub Packages. The scope must match the repository owner
(`chehovskii-a`), otherwise `npm publish` is rejected by the registry.

## Install

```sh
echo "@chehovskii-a:registry=https://npm.pkg.github.com" >> .npmrc
npm install @chehovskii-a/faster
```

## Usage

```tsx
import '@chehovskii-a/faster/index.css';
import { Button, Dialog, Input } from '@chehovskii-a/faster';
```

## Tasks

```sh
npx nx run faster:test            # Jest + React Testing Library
npx nx run faster:component-test  # Cypress component tests
npx nx run faster:storybook       # Storybook dev server
npx nx run faster:build           # library build (dist/)
```

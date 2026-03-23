# Diary Starter

Server-first diary app starter built with Next.js App Router, TypeScript, Tailwind CSS, Jotai, and TanStack Query.

## Stack

- Next.js 16 App Router with `src/`
- React 19 + TypeScript
- Tailwind CSS 4
- Jotai for client-only shared UI state
- TanStack Query for interactive client fetching and cache
- Vitest + React Testing Library

## Prerequisites

This project pins its toolchain with Volta:

```bash
volta install node@22.17.0
volta install yarn@1.22.22
```

Once those tools are installed, Volta will automatically use the pinned versions from `package.json`.

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `yarn dev`: start the local development server
- `yarn build`: create a production build
- `yarn start`: run the production build locally
- `yarn lint`: run ESLint
- `yarn typecheck`: run TypeScript type checks
- `yarn test`: run the Vitest suite

## Project Notes

- The landing page demonstrates an async server component for the default diary snapshot.
- `/api/reflection-prompt` is a small route handler used by a TanStack Query client component.
- Shared workspace mode is stored in Jotai rather than mirroring server data into client state.

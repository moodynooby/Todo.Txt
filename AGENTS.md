# Agent Instructions

## Package Management

Please use `bun` for all package management tasks (installing, updating, removing dependencies).

For example:
- `bun install` instead of `npm install` or `yarn install`
- `bun add <package>` instead of `npm install <package>` or `yarn add <package>`
- `bun run <script>` instead of `npm run <script>` or `yarn <script>`

## Building the Project

The project uses Rsbuild. Common commands:
- `bun run dev`: Starts the development server.
- `bun run build`: Creates a production build.

## PWA & Service Worker

The service worker is located at `src/sw.js` and is managed by Workbox.
The PWA manifest is at `public/manifest.json`.
Client-side service worker registration and update handling is in `src/index.jsx`.

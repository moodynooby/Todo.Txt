# Agent Instructions

# Details

this is built using Rspack

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

- The service worker is located at `src/sw.js` and is managed by Workbox.
- The PWA manifest is at `public/manifest.json`. PWA icons (e.g., `icon192.png`, `icon512_maskable.png`) are located in `public/assets/`. Rsbuild copies the contents of the `public` directory to the build output.
- Client-side service worker registration, update detection, and the update toast notification logic are implemented in `src/index.jsx`.

# Agent Instructions for todo.txt_2

This document provides instructions for AI agents working on the `todo.txt_2` project.

## Project Overview

This is a React-based application, formerly using Rspack and now migrated to Parcel for its build system. It functions as a modern Todo.txt editor and viewer and is a Progressive Web App (PWA).

## Development

### Prerequisites

-   Node.js (version specified in `.nvmrc` if present, otherwise latest LTS)
-   npm (comes with Node.js)

### Setup

1.  Clone the repository.
2.  Run `npm install` to install dependencies.

### Running the Development Server

-   Execute `npm start`.
-   This will start the Parcel development server, typically at `http://localhost:1234`.
-   The entry point for Parcel is `src/index.html`.

### Building for Production

-   Execute `npm run build`.
-   This command uses Parcel to build the application for production.
-   Output files will be placed in the `dist/` directory.

### Previewing the Production Build

-   After running `npm run build`, you can preview the production build.
-   The `npm run preview` script is set up as `parcel build src/index.html && serve dist`.
-   This requires the `serve` package. If not installed globally, you can run `npx serve dist` directly after a build, or install it as a dev dependency: `npm install serve --save-dev`.

## Key Technologies & Configurations

-   **Build Tool**: Parcel. Parcel handles most compilation and bundling with minimal configuration.
    -   Entry point: `src/index.html`
    -   Output directory: `dist/`
-   **Framework**: React.
-   **Styling**:
    -   Sass/SCSS for general styling.
    -   Tailwind CSS for utility classes, configured via `postcss.config.mjs`. If `tailwind.config.js` is absent, Tailwind uses its default configuration.
    -   DaisyUI (a Tailwind CSS plugin) is also used.
-   **PWA Features**:
    -   Service Worker: `src/sw.js` is registered in `src/index.jsx`. Parcel bundles this service worker.
    -   Web App Manifest: `src/manifest.webmanifest` is linked in `src/index.html`. Parcel includes this in the build and copies linked assets.
-   **Linting & Formatting**:
    -   ESLint: Configuration in `eslint.config.mjs`. Run with `npm run lint`.
    -   Prettier: Configuration in `.prettierrc`. Run with `npm run format`.

## Working with Parcel

-   Parcel relies heavily on `package.json` for dependencies and its `scripts` section.
-   It automatically detects and transforms many file types (JS, JSX, TS, CSS, SCSS, HTML, image formats, etc.).
-   For assets like images or fonts referenced in HTML, CSS, or JS, Parcel usually handles them automatically, including them in the build and updating references.
-   Static assets not directly referenced in code but needed in the build (e.g., some PWA icons if not covered by manifest processing) might need to be placed in a `static` folder by convention, or a plugin like `parcel-reporter-static-files-copy` could be used if Parcel's default handling isn't sufficient. Currently, assets are referenced directly (e.g. in `manifest.webmanifest` or `index.html`) and Parcel should handle them.

## Clean Up Post-Migration

-   The Rspack configuration file (`rsbuild.config.mjs`) should be deleted.
-   Ensure all Rspack-specific dependencies (`@rsbuild/...`, `@aaroon/workbox-rspack-plugin`, etc.) have been removed from `package.json`.

## Testing

-   Run the development server and thoroughly test all application functionalities.
-   Perform a production build and test the output from the `dist` directory.
-   Use browser developer tools (especially Lighthouse) to audit PWA capabilities (installability, service worker, offline support if configured in `sw.js`).
-   Check for console errors in both development and production builds.
-   Verify styling and responsive design.

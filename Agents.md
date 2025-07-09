# Agent Instructions and general intro

## Details

this is built using Rspack and further uses tailwind as a postCSS plugin and has a rspack-react plugin and uses daisyUI as css library

## Code Practicies

- try to use jsx and scss only for javascript/typescript and css code
- try to make or use reusable components like daisyUI

## Structure

- src contains jsx and scss project
- src/assets contain the static icons and media

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

- basic manifest is located in the rsbuild.config.mjs.
- other manifest and sw support is being added

## Features not compatible smoothly (YET)

| Feature | Reason                                                                                                                                                                                                                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ShadCN  | Shadcn/ui's reliance on Tailwind CSS and specific project configurations can cause compatibility issues with Rspack. Ensuring Rspack correctly processes Tailwind and resolves path aliases is key for successful integration. Manual configuration may be needed to align Rspack with Shadcn/ui's build process. |

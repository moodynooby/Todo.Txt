# Agent Instructions and general intro

## Details

this is built using Rspack and further uses tailwind as a postCSS plugin and has a rspack-react plugin and uses daisyUI as css library

## Code Practicies

- try to use jsx and scss only for javascript/typescript and css code
- never make rigid components always make reusable and reusable components
- try to make or use reusable and responsive components like daisyUI
- never edit \*.lock files
- always try to create the handling and trigger in a same reusable and responsive component
- never create components that only return value
- always try to make the component as self sufficient as possible

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

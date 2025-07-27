---
trigger: always_on
---

## Details

this is built using Vite and uses daisyUI as css library

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
- public contain the static icons and media and static libraries

## Package Management

Please use `bun` for all package management tasks (installing, updating, removing dependencies).

For example:

- `bun install` instead of `npm install` or `yarn install`
- `bun add <package>` instead of `npm install <package>` or `yarn add <package>`
- `bun run <script>` instead of `npm run <script>` or `yarn <script>`

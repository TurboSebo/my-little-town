# my-little-town

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## CSS structure

Styles are now global and split into three files under `src/assets/`:

- `main.css` – app layout and general styles (reset, background, containers, responsiveness)
- `ui.css` – UI elements: info panel, dice, action buttons, legend, start modal, round scores table
- `board.css` – game board: grid, column/row headers, cells, and states (hover, highlight, temporary changes, locked)

Imports are added in `src/main.ts` (order matters — `main.css` first, then UI and board):

```ts
import './assets/main.css'
import './assets/ui.css'
import './assets/board.css'
```

Note: styles used to be `scoped` inside components and were moved to global CSS. Class names are fairly specific (e.g., `.legend`, `.dice-section`, `.board-row`, `.cell`), but if you add new styles and notice name collisions, consider prefixing by component (e.g., `.legend-...`, `.dice-...`, `.board-...`) or using a BEM convention.

Where to put new styles:

- layout/general elements — `main.css`
- UI (buttons, panels, modals, lists) — `ui.css`
- board grid and cells — `board.css`

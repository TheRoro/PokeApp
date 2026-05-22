# PokeApp — Pokédex Search Engine & Type Calculator

A Pokédex-inspired web app built with React + TypeScript. Search Pokémon, explore moves, calculate type matchups, and discover team-building insights — all powered by [PokeAPI](https://pokeapi.co/).

## Features

- **Search Pokémon** — View stats, types, evolution chains, and movesets. Clickable evolutions for quick navigation.
- **Search Move** — Detailed move info including type, category, power, accuracy, and effect descriptions.
- **Type Calculator** — Select a type combo to see defensive/offensive coverage using updated terminology (Extremely Effective, Mostly Ineffective). Displays Pokémon that share your selected type combination.
- **Full Pokédex (Gen 1–9)** — All 1025 Pokémon from Kanto through Paldea, including regional forms and Paradox Pokémon.
- **Shiny Easter Egg** — 1/100 chance of encountering a shiny sprite when searching a Pokémon ✨
- **Pokémon Quotes** — 135 iconic quotes from games and anime on the home page.

## Tech Stack

- React 18 + TypeScript 5
- Vite 7
- React Router v6
- Bootstrap 5 / react-bootstrap 2
- styled-components v5
- Axios
- PokeAPI

## Design

Pokédex device-inspired dark theme featuring:
- Charcoal background with red accent borders and indicator lights
- Type-colored pills, coverage cards, and ghost-style buttons
- Responsive layout optimized for desktop and mobile

## Access

- [Home](https://pokeapp.onrender.com/)
- [Search Pokémon](https://pokeapp.onrender.com/search/)
- [Search Move](https://pokeapp.onrender.com/move)
- [Type Calculator](https://pokeapp.onrender.com/calc)

You can access any Pokémon directly by name or ID:
- `https://pokeapp.onrender.com/search/pikachu`
- `https://pokeapp.onrender.com/search/25`

## Deployment

Install dependencies and run the app locally:

```bash
yarn install
yarn dev
```

Run the same checks used by CI:

```bash
yarn test
yarn build
```

GitHub Actions validates tests and production builds on Linux and Windows and
reviews dependency changes in pull requests.

PokeApp is deployed on [Render](https://render.com/) as a static site:

- Build command: `yarn install --frozen-lockfile && yarn build`
- Publish directory: `dist`

The included `public/_redirects` rule routes direct SPA URLs back to
`index.html`. PokeApp intentionally does not install a service worker; its
PokeAPI-backed content requires a network connection.

---

Made with 🦔 by [@TheRoro](https://github.com/TheRoro)

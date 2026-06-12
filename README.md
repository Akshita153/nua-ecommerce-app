# nua — Frontend Assignment

A mini e-commerce web app built with React 18 + Vite + SCSS Modules.

**Live demo:**

https://nua-ecommerce-app.netlify.app/


## Setup

Requires **Node 18+**.

```bash
# Clone
git clone <your-repo-url>
cd nua-ecommerce-app

# Install
npm install

# Run dev server
npm run dev

# Production build
npm run build
```

`npm run dev` starts at `http://localhost:5173`.

---

## Features

- **Product listing** — fetched from [Fake Store API](https://fakestoreapi.com), filterable by category, loading skeleton cards
- **Product detail** — image gallery with thumbnail switcher, colour swatches, size buttons with available/low-stock/sold-out states, quantity picker, Add to Cart
- **Variant URL state** — `?colour=Midnight&size=M` deep-links to a specific variant
- **Sale prices** — every third product shows a crossed-out original price with a sale badge
- **Cart drawer** — slides in from right, quantity controls, remove items, subtotal + shipping + total
- **localStorage persistence** — cart survives a page refresh
- **Responsive** — 4-column desktop grid → 2-column mobile, single-column detail page on mobile with horizontally-scrolling thumbnails

---

## Project structure

```
src/
  components/
    Navbar/             Navbar.jsx + Navbar.module.scss
    CartDrawer/         CartDrawer.jsx + CartDrawer.module.scss
    ProductCard/        ProductCard.jsx + ProductCard.module.scss
    ProductDetail/      ProductDetail.jsx + ProductDetail.module.scss
  hooks/
    useFetch.js         Generic fetch hook (loading / data / error)
    useVariant.js       Colour + size selection, synced to URL params
  stores/
    CartContext.jsx     Cart state (Context API + useReducer) with localStorage
  router/
    index.jsx           Route definitions
  data/
    variants.js         Deterministic fake variant generator (see DECISIONS.md)
  styles/
    _variables.scss     Design tokens (colours, spacing, type, breakpoints)
    _mixins.scss        Reusable SCSS mixins (flex helpers, focus ring, etc.)
    global.scss         CSS reset + base styles
  pages/
    ProductListingPage.jsx + .module.scss
    ProductDetailPage.jsx
  App.jsx
  main.jsx
DECISIONS.md
docs/                   Lighthouse screenshot (add after first deploy)
```

---

## Design decisions

See [DECISIONS.md](./DECISIONS.md) for the full write-up. Short version:

- **Context API** over Zustand — cart is a flat list with no async; built-in solution is sufficient
- **Flexbox throughout** — `display: flex` with `flex-wrap` instead of CSS Grid for all layouts
- **Deterministic fake variants** — Fake Store API returns no colour/size data; variants are generated per product id so states like sold-out and low-stock are testable and consistent

---

## Known trade-offs

- Fake variant data — see DECISIONS.md #1
- Category filter isn't URL-persisted (deep-linkable) — quick addition left out for time
- No error boundary component

---

## Deployment

```bash
npm run build       # outputs to /dist
```

Deploy the `/dist` folder to Vercel or Netlify. On Vercel:

```bash
npx vercel --prod
```

Add a `vercel.json` for SPA routing (React Router needs this):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

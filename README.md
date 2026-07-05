# Inphint — React (Vite)

The Inphint site converted from the single HTML file into a component-based React app.
Same design, same content, same Inphox chatbot — now maintainable as components.

## Run it

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build
```

Requires Node 18+.

## Structure

```
index.html                 – page shell + Google Fonts
src/
  main.jsx                 – React entry
  index.css                – all styles (unchanged from the original)
  data.js                  – services, projects, AI projects, chatbot brain
  hooks.js                 – scroll-reveal + reduced-motion helpers
  App.jsx                  – composes every section
  components/
    Nav.jsx                – sticky nav + mobile menu
    Hero.jsx               – hero + rotating 3D "engine" (Three.js)
    Strip.jsx              – capability marquee + animated stat counters
    Services.jsx           – AI-automation feature block + service grid
    Process.jsx            – 5-step process with draw-in line
    Work.jsx               – filters, AI project cards, project grid
    AboutCta.jsx           – About + final call-to-action
    Contact.jsx            – contact form (controlled + validated)
    Footer.jsx             – footer
    Chatbot.jsx            – Inphox AI assistant
public/assets/             – logo, Inphox avatar, project thumbnails (.webp)
```

## Editing content

- **Projects** – edit `PROJECTS` in `src/data.js`. Thumbnails live in `public/assets/<img>.webp`.
- **AI projects** – add objects to `AI_PROJECTS` in `src/data.js`; the cards tile automatically.
- **Services** – edit `SERVICES` / `AI_CHIPS` in `src/data.js`.
- **Chatbot knowledge** – edit `SYSTEM` (live model) and `fallback()` (offline) in `src/data.js`.

## Chatbot: going live securely

`Chatbot.jsx` calls the Anthropic API directly, which works in preview environments.
On your own hosting that call needs an API key — **never put the key in the frontend.**
Add a small serverless function that holds the key and forwards messages, then point
`callAPI()` in `Chatbot.jsx` at your endpoint instead of `https://api.anthropic.com/...`.
Until then, the built-in keyword `fallback()` answers automatically.

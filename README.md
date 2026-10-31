# CRO consultant site (React + Vite)

## Run it
    npm install
    npm run dev       # local dev server
    npm run build     # production build in /dist

## Change things
- Text, email address, case studies, and photo path: `src/content.js`
- Layout and sections: `src/App.jsx`
- Styling and colors (CSS variables at the top): `src/index.css`
- Your photo: put it in `public/` (for example `public/kenny.jpg`) and set `PHOTO = "/kenny.jpg"` in `src/content.js`.

## Hosting
`npm run build`, then upload the `dist` folder to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.

## Contact form
The form opens the visitor's email app addressed to `SITE.email`. For submissions that arrive without the visitor's email app, connect a form service such as Formspree.

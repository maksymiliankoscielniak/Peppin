# Peppin

Client-side reconstitution calculator and educational compound library (Vite + React + TypeScript).
Educational / satirical project – not medical advice.

## Develop
```
npm install
npm run dev
```

## Deploy to GitHub Pages
1. Create a GitHub repository and push this folder to the `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, builds the site and publishes it at
   `https://<user>.github.io/<repo>/`.

`vite.config.ts` uses `base: './'`, so the site works under any repository path.

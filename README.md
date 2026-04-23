# harryjwang.com — Portfolio

Personal portfolio website for Harry Wang, built with Vite + React + Three.js and deployed to GitHub Pages via GitHub Actions.

---

## Live Sites

| URL | Description |
|-----|-------------|
| harryjwang.com | Industry portfolio — React |
| harryjwang.com/room | Interactive 3D room — Three.js |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite | Build tool & dev server |
| React 18 | Industry portfolio UI |
| Three.js | 3D room scene |
| GitHub Pages | Free static hosting |
| GitHub Actions | Auto-deploy on push |

---

## Project Structure

```
PortfolioWebsite/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deploy to GitHub Pages on push to main
├── public/
│   ├── CNAME                   # Custom domain: harryjwang.com
│   ├── 404.html                # SPA redirect hack for GitHub Pages routing
│   ├── favicon.ico
│   └── icons.svg
├── src/
│   ├── components/             # React components for industry site
│   │   ├── Nav.jsx + .module.css
│   │   ├── Hero.jsx + .module.css
│   │   ├── Experience.jsx + .module.css
│   │   ├── Projects.jsx + .module.css
│   │   ├── Terminal.jsx + .module.css
│   │   └── Contact.jsx + .module.css
│   ├── data/
│   │   └── index.js            # All content: experience, projects, skills, terminal commands
│   ├── pages/
│   │   ├── Portfolio.jsx       # Industry site page (route: /)
│   │   ├── Portfolio.module.css
│   │   ├── Room.jsx            # Three.js room page (route: /room)
│   │   └── Room.module.css
│   ├── room/
│   │   └── scene.js            # All Three.js scene code
│   ├── App.jsx                 # Path-based router (/ vs /room)
│   ├── main.jsx                # React entry point
│   └── index.css               # Global CSS variables and resets
├── index.html                  # HTML shell
├── vite.config.js              # Vite config (base: '/')
├── package.json
└── .gitignore
```

---

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Clone the repo
git clone https://github.com/harryjwang/PortfolioWebsite.git
cd PortfolioWebsite

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 for the industry site.
Open http://localhost:5173/room for the Three.js room.

---

## Updating Content

All content lives in one file: src/data/index.js

- EXP — work experience and design teams
- PROJECTS — starred projects
- SKILLS — skill tags shown in hero
- TERMINAL_COMMANDS — all terminal command responses

Edit that file and push — the site auto-deploys within 60 seconds.

---

## Deployment

### How it works

1. You push to main
2. GitHub Actions runs .github/workflows/deploy.yml
3. It runs npm ci + npm run build
4. The dist/ folder is pushed to the gh-pages branch
5. GitHub Pages serves the gh-pages branch at harryjwang.com

### Manual deploy (if needed)
```bash
npm run build
npx gh-pages -d dist --no-history
```

### First-time GitHub Pages setup
1. Go to github.com/harryjwang/PortfolioWebsite/settings/pages
2. Set Source branch to gh-pages
3. Set Custom domain to harryjwang.com
4. Enable Enforce HTTPS

### GitHub Actions permissions
The workflow needs write access to push to gh-pages.
Go to github.com/harryjwang/PortfolioWebsite/settings/actions
and set Workflow permissions to Read and write permissions.
Or the deploy.yml includes permissions: contents: write which handles this automatically.

---

## Custom Domain DNS Records

Set these at your domain registrar:

| Type  | Name | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | harryjwang.github.io |

---

## Routing

GitHub Pages only serves static files, so /room would normally 404.
This is solved with the SPA redirect trick:

1. public/404.html — when GitHub Pages can't find /room, it serves this file
2. 404.html redirects to /?redirect=/room
3. App.jsx reads the redirect query param and restores the path
4. React renders the correct page (Room or Portfolio)

---

## Three.js Notes

- Uses Three.js latest (upgraded from r128 to fix a read-only property conflict with React)
- Light intensities are higher than typical r128 examples because newer Three.js changed physically correct lighting defaults
- The scene is built imperatively in src/room/scene.js and mounted via a canvas ref in Room.jsx
- StrictMode is disabled in main.jsx to prevent Three.js double-initialization issues

---

## Known Issues / Gotchas

| Issue | Fix |
|-------|-----|
| Blank screen on GitHub Pages | Check vite.config.js has base: '/' (not /PortfolioWebsite/) when using custom domain |
| /room returns 404 | Ensure public/404.html exists and App.jsx handles the ?redirect= param |
| Three.js scene too dark | Bump ambient light to ~8 and directional lights to ~3 after upgrading Three.js |
| .DS_Store in git | .gitignore handles this — never commit node_modules/ or dist/ |
| vite: command not found | Run npm install first to restore node_modules/ |

---

## To Do / Future

- Add real company links to experience entries
- Add actual GitHub repo links to all projects
- Add more room details and interactivity
- Code-split Three.js into a separate chunk to reduce initial bundle size
- Add og:image meta tags for social sharing previews

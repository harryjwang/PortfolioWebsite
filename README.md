# harryjwang.com — Portfolio

Built with Vite + React + Three.js.

| Route | Page |
|-------|------|
| `/` | Industry React portfolio |
| `/room` | Three.js interactive room |

## Local development
```bash
npm install
npm run dev       # http://localhost:5173
```

## Deploy to GitHub Pages

### Build
```bash
npm run build     # outputs to dist/
```

### Push dist/ to GitHub Pages
```bash
# One-time: install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

npm run deploy
```

Or push the whole repo and use GitHub Actions (see below).

### GitHub Actions (auto-deploy on push)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### DNS records for harryjwang.com
| Type  | Name | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | harryjwang.github.io |

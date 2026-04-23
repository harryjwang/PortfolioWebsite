# harryjwang.com

Personal portfolio — two sites in one repo.

| File | Description | URL |
|------|-------------|-----|
| `index.html` | Industry React portfolio | `harryjwang.com/` |
| `room.html` | Three.js interactive room | `harryjwang.com/room` |
| `404.html` | Custom 404 + redirect | automatic |
| `CNAME` | Custom domain config | — |

## Deploy to GitHub Pages

### First time setup

1. Create (or use existing) repo named `harryjwang.github.io`
2. Push all files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "initial portfolio deploy"
   git remote add origin https://github.com/harryjwang/harryjwang.github.io.git
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Site goes live at `https://harryjwang.github.io`

### Custom domain (harryjwang.com)

The `CNAME` file is already included. You just need to point your domain DNS:

**At your domain registrar, add these DNS records:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | harryjwang.github.io |

Then in GitHub: **Settings → Pages → Custom domain → harryjwang.com → Save**

Enable **Enforce HTTPS** once the cert is issued (~10 min).

## Update workflow

Any push to `main` auto-deploys. To update content:
```bash
# edit index.html or room.html locally
git add .
git commit -m "update portfolio content"
git push
```
Changes are live in ~30 seconds.

## Local preview

No build step needed — just open the files directly:
```bash
# Option 1: Python server (recommended, avoids CORS issues)
python3 -m http.server 8080
# then open http://localhost:8080

# Option 2: Just open index.html in browser
open index.html
```

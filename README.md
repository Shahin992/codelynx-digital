# codelynx-digital

Static website for Codelynx Digital: plain HTML, CSS and GSAP.

## Branches

- `main`: work in progress. Edit and commit here.
- `production`: the live site. Every push or merged pull request into `production`
  runs [the deploy workflow](.github/workflows/deploy.yml), which builds the site,
  uploads it to the `codelynx-digital-site` R2 bucket and deploys the Worker that serves it.

To release, open a pull request from `main` into `production` and merge it, or:

```bash
git checkout production && git merge main && git push && git checkout main
```

## Working locally

Open the folder with any static server (for example Live Server) and edit the files directly.
`./build.sh` writes the minified site to `build/` if you want to check the production output.

## Layout

- `index.html`, `about/`, `services/`, `insights/` ... : one folder per page
- `css/style.css`, `js/` (nav, footer, posts, main), `images/`
- `build.sh`: production build (copy pages, minify CSS/JS, cache-busting links)
- `worker/index.js`, `wrangler.toml`: the Cloudflare Worker that serves the site from R2

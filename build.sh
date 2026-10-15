#!/usr/bin/env bash
# Builds the deployable site into build/ (ignored by git).
#
#   ./build.sh
#
# The deploy workflow (.github/workflows/deploy.yml) runs this same script on every
# push to the production branch, then uploads build/ to R2 for the Worker to serve.
# Locally you only need it to preview the minified output.
#
# It:
#   1. copies every page (index.html), 404.html, images/, assets/ and fonts/ into build/
#   2. minifies css/ and js/ with esbuild (falls back to plain copies if npx is missing)
#   3. adds ?v=<hash> to the CSS/JS links so browsers load fresh files after each deploy
#   4. adds robots.txt and llms.txt, and generates sitemap.xml from the pages
set -euo pipefail
cd "$(dirname "$0")"

OUT=build
ESBUILD=esbuild@0.24.2

rm -rf "$OUT"
mkdir -p "$OUT/css" "$OUT/js"

# 1. pages + images (assets/images holds the site's photos as WebP)
find . -name index.html -not -path "./$OUT/*" -not -path './.git/*' -not -path './node_modules/*' -not -path './.wrangler/*' | while read -r page; do
  mkdir -p "$OUT/$(dirname "$page")"
  cp "$page" "$OUT/$page"
done
cp 404.html "$OUT/404.html"
cp -r images "$OUT/images"
cp -r assets "$OUT/assets"
cp -r fonts "$OUT/fonts"

# 2. css + js
if command -v npx >/dev/null 2>&1 && npx --yes "$ESBUILD" --version >/dev/null 2>&1; then
  npx --yes "$ESBUILD" css/style.css --minify --outdir="$OUT/css" --log-level=warning
  npx --yes "$ESBUILD" js/*.js --minify --outdir="$OUT/js" --log-level=warning
else
  echo "npx/esbuild not available: copying CSS and JS without minifying" >&2
  cp css/*.css "$OUT/css/"
  cp js/*.js "$OUT/js/"
fi

# 3. cache-busting version on the CSS/JS links
VERSION=$(cat "$OUT"/css/*.css "$OUT"/js/*.js | md5sum | cut -c1-8)
find "$OUT" -name '*.html' -exec sed -i -E \
  -e "s#(css/style\.css)\"#\1?v=$VERSION\"#" \
  -e "s#(js/(nav|footer|posts|main)\.js)\"#\1?v=$VERSION\"#g" {} +


# 4. robots.txt, llms.txt and sitemap.xml
# They (and every page's canonical link, social tags and structured data) use __SITE_URL__
# instead of a fixed domain: the Worker fills in the address the
# site is visited on. To write a fixed address instead, build with
#   SITE_URL=https://www.example.com ./build.sh
cp robots.txt llms.txt "$OUT/"
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  # every page except the thank-you page; <lastmod> is the page's last commit date
  find "$OUT" -name index.html | sed "s#^$OUT/##; s#index\.html\$##" | grep -vx 'thank-you/' | sort | while read -r path; do
    lastmod=$(git log -1 --format=%cs -- "${path}index.html" 2>/dev/null || true)
    printf '  <url>\n    <loc>__SITE_URL__/%s</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' "$path" "${lastmod:-$(date -u +%F)}"
  done
  echo '</urlset>'
} > "$OUT/sitemap.xml"
if [ -n "${SITE_URL:-}" ]; then
  find "$OUT" -name '*.html' -exec sed -i "s#__SITE_URL__#${SITE_URL%/}#g" {} +
  sed -i "s#__SITE_URL__#${SITE_URL%/}#g" "$OUT/robots.txt" "$OUT/llms.txt" "$OUT/sitemap.xml"
fi

echo "Built $(find "$OUT" -name index.html | wc -l) pages into $OUT/ (version $VERSION, $(du -sh "$OUT" | cut -f1))"

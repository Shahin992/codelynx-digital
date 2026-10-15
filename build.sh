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
#   1. copies every page (index.html) and the images folder into build/
#   2. minifies css/ and js/ with esbuild (falls back to plain copies if npx is missing)
#   3. adds ?v=<hash> to the CSS/JS links so browsers load fresh files after each deploy
set -euo pipefail
cd "$(dirname "$0")"

OUT=build
ESBUILD=esbuild@0.24.2

rm -rf "$OUT"
mkdir -p "$OUT/css" "$OUT/js"

# 1. pages + images
find . -name index.html -not -path "./$OUT/*" -not -path './.git/*' -not -path './node_modules/*' -not -path './.wrangler/*' | while read -r page; do
  mkdir -p "$OUT/$(dirname "$page")"
  cp "$page" "$OUT/$page"
done
cp -r images "$OUT/images"

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
find "$OUT" -name index.html -exec sed -i -E \
  -e "s#(css/style\.css)\"#\1?v=$VERSION\"#" \
  -e "s#(js/(nav|footer|posts|main)\.js)\"#\1?v=$VERSION\"#g" {} +

echo "Built $(find "$OUT" -name index.html | wc -l) pages into $OUT/ (version $VERSION, $(du -sh "$OUT" | cut -f1))"

/* Serves the built Codelynx Digital site from the R2 bucket bound as SITE
   (see wrangler.toml). The deploy workflow uploads build/ into the bucket on
   every push to the production branch, keeping the same paths, e.g.
     /                -> index.html
     /contact/        -> contact/index.html
     /css/style.css   -> css/style.css */

const TYPES = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  ico: 'image/x-icon',
  txt: 'text/plain; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  woff2: 'font/woff2'
};

const NOT_FOUND_PAGE = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | Codelynx Digital</title>' +
  '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;' +
  'color:#f6f7fa;background:radial-gradient(#141d1e,#000);text-align:center}a{color:#79d7e3}</style></head>' +
  '<body><main><h1>Page not found</h1><p>The page you are looking for does not exist.</p>' +
  '<p><a href="/">Go to the homepage</a></p></main></body></html>';

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const url = new URL(request.url);
    let path;
    try {
      path = decodeURIComponent(url.pathname);
    } catch (e) {
      return notFound(env);
    }

    // Pages live at folder/index.html, so /contact redirects to /contact/
    const lastSegment = path.slice(path.lastIndexOf('/') + 1);
    if (lastSegment && !lastSegment.includes('.')) {
      const page = await env.SITE.head(path.slice(1) + '/index.html');
      if (!page) return notFound(env);
      return Response.redirect(url.origin + path + '/' + url.search, 301);
    }

    const key = path.endsWith('/') ? path.slice(1) + 'index.html' : path.slice(1);
    const object = await env.SITE.get(key);
    if (!object) return notFound(env);

    const ext = key.slice(key.lastIndexOf('.') + 1).toLowerCase();
    const headers = new Headers({
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl(ext, url),
      'ETag': object.httpEtag,
      'X-Content-Type-Options': 'nosniff'
    });

    if (request.headers.get('If-None-Match') === object.httpEtag) {
      return new Response(null, { status: 304, headers });
    }
    return new Response(request.method === 'HEAD' ? null : object.body, { headers });
  }
};

function cacheControl(ext, url) {
  // Pages always revalidate so a new deploy shows up straight away.
  if (ext === 'html') return 'public, max-age=0, must-revalidate';
  // build.sh adds ?v=<hash> to CSS/JS links, so each build gets new URLs.
  if ((ext === 'css' || ext === 'js') && url.searchParams.has('v')) return 'public, max-age=31536000, immutable';
  return 'public, max-age=86400';
}

// Uses the site's own 404.html from the bucket, or a plain built-in page if it is missing.
async function notFound(env) {
  const page = await env.SITE.get('404.html');
  return new Response(page ? page.body : NOT_FOUND_PAGE, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

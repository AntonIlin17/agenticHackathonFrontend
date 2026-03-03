export default {
  async fetch(request, env, ctx) {
    // Try to serve the requested static asset from the Vite build
    const assetResponse = await env.ASSETS.fetch(request);

    // If the asset exists, return it
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // For SPA routes, fall back to index.html so React Router (if used)
    // can handle client-side navigation.
    const url = new URL(request.url);
    if (request.method === "GET" && !url.pathname.startsWith("/_")) {
      const indexRequest = new Request(`${url.origin}/index.html`, request);
      return env.ASSETS.fetch(indexRequest);
    }

    // If it's not a GET or some special path, just return the 404
    return assetResponse;
  },
};


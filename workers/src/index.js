/**
 * Cloudflare Worker for Transport Guidesign Generator
 * This worker serves the React application and provides API endpoints
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API endpoints
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(url, request);
    }

    // Serve static assets from the React build
    // In production, assets should be uploaded to Cloudflare Workers Sites or R2
    return new Response('React app should be served here. Configure Workers Sites or R2 for production.', {
      headers: { 'content-type': 'text/plain' },
    });
  },
};

/**
 * Handle API requests
 */
async function handleAPI(url, request) {
  // Example API endpoint
  if (url.pathname === '/api/hello') {
    return new Response(JSON.stringify({ 
      message: 'Hello from Cloudflare Workers!',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  // Example POST endpoint
  if (url.pathname === '/api/generate' && request.method === 'POST') {
    try {
      const body = await request.json();
      return new Response(JSON.stringify({
        success: true,
        data: body,
        message: 'Data received successfully'
      }), {
        headers: { 'content-type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  // 404 for unknown API routes
  return new Response(JSON.stringify({ 
    error: 'Not Found',
    path: url.pathname 
  }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  });
}

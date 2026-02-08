/**
 * Transport Guidesign Generator - Cloudflare Worker
 * 
 * This worker provides backend API endpoints for the Transport Guidesign Generator application.
 */

export interface Env {
  ENVIRONMENT?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers for development
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Root endpoint
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(JSON.stringify({
        message: 'Transport Guidesign Generator API',
        version: '1.0.0',
        environment: env.ENVIRONMENT || 'development',
        endpoints: {
          health: '/health',
          api: '/api/*',
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || 'development',
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // API routes
    if (url.pathname.startsWith('/api/')) {
      // Example API endpoint
      if (url.pathname === '/api/example' && request.method === 'GET') {
        return new Response(JSON.stringify({
          message: 'This is an example API endpoint',
          data: {
            timestamp: new Date().toISOString(),
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // API endpoint not found
      return new Response(JSON.stringify({
        error: 'API endpoint not found',
        path: url.pathname,
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // 404 for all other routes
    return new Response(JSON.stringify({
      error: 'Not found',
      path: url.pathname,
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  },
};

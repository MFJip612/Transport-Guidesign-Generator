# Cloudflare Workers

This directory contains the Cloudflare Workers project for the Transport Guidesign Generator.

## Structure

```
workers/
├── src/
│   └── index.js    # Main worker entry point
└── README.md       # This file
```

## Development

To run the worker locally:

```bash
npm run worker:dev
```

This will start a local development server on `http://localhost:8787` where you can test the worker.

## API Endpoints

The worker provides the following API endpoints:

- `GET /api/hello` - Returns a hello message with timestamp
- `POST /api/generate` - Accepts JSON data and echoes it back

## Deployment

To deploy the worker to Cloudflare:

```bash
npm run worker:deploy
```

Note: You need to be logged in to Cloudflare using `wrangler login` before deploying.

## Configuration

The worker configuration is in `wrangler.toml` at the project root.

## Integration with React

In production, this worker can:
1. Serve the built React application from Cloudflare Workers Sites or R2
2. Provide API endpoints for the React app to consume
3. Handle server-side logic and data processing

For development, run the React app and worker separately:
- React app: `npm run dev` (port 5173)
- Worker: `npm run worker:dev` (port 8787)

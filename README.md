# Transport Guidesign Generator

A React-based web application with Cloudflare Workers backend for generating transport guide signs.

## Project Structure

This project consists of two main parts:

1. **React Frontend** - Built with Vite and React
2. **Cloudflare Workers Backend** - Serverless API and static file serving

```
.
├── src/              # React application source
├── public/           # Static assets
├── workers/          # Cloudflare Workers
│   ├── src/         # Worker source code
│   └── README.md    # Workers documentation
├── wrangler.toml    # Cloudflare Workers configuration
└── package.json     # Dependencies and scripts
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the React development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Run the Cloudflare Worker locally:

```bash
npm run worker:dev
```

The worker will be available at `http://localhost:8787`

### Building

Build the React application:

```bash
npm run build
```

### Deployment

Deploy the Cloudflare Worker:

```bash
npm run worker:deploy
```

Note: You need to be logged in to Cloudflare using `wrangler login` before deploying.

## Available Scripts

- `npm run dev` - Start React development server
- `npm run build` - Build React application for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint the codebase
- `npm run worker:dev` - Start Cloudflare Worker development server
- `npm run worker:deploy` - Deploy worker to Cloudflare
- `npm run worker:tail` - Stream logs from deployed worker

## Technologies

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Cloudflare Workers** - Serverless compute platform
- **Wrangler** - CLI for Cloudflare Workers

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)


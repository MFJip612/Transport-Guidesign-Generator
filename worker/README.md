# Transport Guidesign Generator - Cloudflare Worker

This is the Cloudflare Workers backend for the Transport Guidesign Generator application.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

```bash
# Navigate to worker directory
cd worker

# Install dependencies
npm install
```

### Development

```bash
# Start local development server
npm run dev
```

The worker will be available at `http://localhost:8787` by default.

### Deployment

```bash
# Deploy to development environment
npm run deploy

# Deploy to production environment
npm run deploy:production
```

## 📁 Project Structure

```
worker/
├── src/
│   └── index.ts        # Main worker entry point
├── package.json        # Worker dependencies
├── tsconfig.json       # TypeScript configuration
├── wrangler.toml       # Cloudflare Workers configuration
└── README.md           # This file
```

## 🔌 API Endpoints

### Root Endpoint
- **GET** `/` - Returns API information and available endpoints

### Health Check
- **GET** `/health` - Returns health status and environment info

### Example API
- **GET** `/api/example` - Example API endpoint

## 🛠️ Configuration

The worker configuration is managed in `wrangler.toml`. Key settings include:

- `name`: Worker name
- `main`: Entry point file
- `compatibility_date`: Cloudflare Workers compatibility date
- Environment-specific variables (development/production)

## 📝 Development Notes

- The worker uses TypeScript for type safety
- CORS is enabled for all origins (configure as needed for production)
- Different environment configurations are available (development/production)

## 🔐 Authentication

Add authentication logic in `src/index.ts` as needed for your application.

## 📚 Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Workers TypeScript](https://developers.cloudflare.com/workers/languages/typescript/)

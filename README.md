# Transport Guidesign Generator

A modern React application for generating transport guide signs, built with cutting-edge technologies.

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful and accessible component library

### Backend
- **Cloudflare Workers** - Serverless backend API

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (for backend deployment, optional)

### Frontend Installation

```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Installation

```bash
# Navigate to worker directory
cd worker

# Install worker dependencies
npm install

# Start worker development server
npm run dev

# Deploy worker (requires Cloudflare account)
npm run deploy
```

## 🎨 Using Shadcn/UI Components

Shadcn/UI is already configured. To add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# ... and more
```

Components will be added to `src/components/ui/`.

## 📁 Project Structure

```
├── src/                # Frontend React application
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # App entry point
│   └── index.css      # Global styles with Tailwind
├── worker/            # Cloudflare Workers backend
│   ├── src/
│   │   └── index.ts   # Worker entry point
│   ├── package.json   # Worker dependencies
│   ├── tsconfig.json  # Worker TypeScript config
│   ├── wrangler.toml  # Cloudflare configuration
│   └── README.md      # Worker documentation
├── public/            # Static assets
├── components.json    # Shadcn/UI configuration
├── tailwind.config.js # Tailwind configuration
└── vite.config.ts     # Vite configuration
```

## 🛠️ Development

The project uses:
- ESLint for code linting
- TypeScript for type checking
- Tailwind CSS for styling
- Vite for fast development and building

## 📝 License

MIT

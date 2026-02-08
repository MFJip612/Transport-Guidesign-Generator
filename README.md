# Transport Guidesign Generator

A modern React application for generating transport guide signs, built with cutting-edge technologies.

## 🚀 Tech Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful and accessible component library

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
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
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # App entry point
│   └── index.css      # Global styles with Tailwind
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

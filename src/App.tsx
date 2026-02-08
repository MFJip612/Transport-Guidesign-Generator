function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">
          Transport Guidesign Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          React project initialized with Vite, TypeScript, Tailwind CSS, and Shadcn/UI
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">React + Vite</h3>
            <p className="text-sm text-muted-foreground">Fast refresh with HMR</p>
          </div>
          <div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">TypeScript</h3>
            <p className="text-sm text-muted-foreground">Type-safe development</p>
          </div>
          <div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Tailwind CSS</h3>
            <p className="text-sm text-muted-foreground">Utility-first styling</p>
          </div>
          <div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Shadcn/UI</h3>
            <p className="text-sm text-muted-foreground">Beautiful components</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

import { SignProvider } from './context/SignContext';
import { MainLayout } from './components/layout/MainLayout';
import { TemplateSelector } from './components/templates/TemplateSelector';
import { SignPreview } from './components/preview/SignPreview';
import { SignEditor } from './components/editor/SignEditor';
import { ExportPanel } from './components/export/ExportPanel';
import { IconSelector } from './components/icons/IconSelector';

function App() {
  return (
    <SignProvider>
      <MainLayout
        leftPanel={
          <div className="space-y-6">
            <TemplateSelector />
            <IconSelector />
          </div>
        }
        centerPanel={<SignPreview />}
        rightPanel={
          <>
            <SignEditor />
            <ExportPanel />
          </>
        }
      />
    </SignProvider>
  );
}

export default App

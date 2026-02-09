import React from 'react';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ leftPanel, centerPanel, rightPanel }) => {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* 左侧面板 - 模板选择 */}
      <div className="w-64 border-r border-border bg-card overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">模板选择</h2>
          {leftPanel}
        </div>
      </div>

      {/* 中间面板 - 预览 */}
      <div className="flex-1 flex items-center justify-center bg-muted p-8">
        {centerPanel}
      </div>

      {/* 右侧面板 - 编辑工具 */}
      <div className="w-80 border-l border-border bg-card overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">编辑工具</h2>
          {rightPanel}
        </div>
      </div>
    </div>
  );
};

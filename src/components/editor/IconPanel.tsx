import React from 'react';
import { useSign } from '../../context/SignContext';

export const IconPanel: React.FC = () => {
  const { icons } = useSign();

  // 处理图标拖拽开始
  const handleDragStart = (e: React.DragEvent, iconId: string) => {
    e.dataTransfer.setData('iconId', iconId);
  };

  return (
    <div className="space-y-4 mt-8 pt-4 border-t border-border">
      <h3 className="text-sm font-medium">图标选择</h3>
      <div className="grid grid-cols-3 gap-3">
        {icons.map((icon) => {
          return (
            <div
              key={icon.id}
              className="border border-border rounded-md p-3 text-center cursor-grab hover:bg-muted transition-colors"
              draggable
              onDragStart={(e) => handleDragStart(e, icon.id)}
              aria-label={icon.name}
            >
              <div className="flex items-center justify-center mb-2">
                {/* 占位符图标 */}
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">📌</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{icon.name}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        拖拽图标到预览区域添加
      </p>
    </div>
  );
};

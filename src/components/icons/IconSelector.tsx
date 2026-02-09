import React, { useState, useEffect } from 'react';
import { useSign } from '../../context/SignContext';

interface IconFile {
  id: string;
  name: string;
  path: string;
  type: 'svg' | 'tsx';
}

export const IconSelector: React.FC = () => {
  const { addIcon, config } = useSign();
  const [icons, setIcons] = useState<IconFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 读取src/icons/下的svg文件和tsx组件
  useEffect(() => {
    const loadIcons = async () => {
      try {
        setIsLoading(true);
        
        // 使用import.meta.glob动态导入svg文件
        const svgModules = import.meta.glob('/src/icons/**/*.svg', { query: '?url', import: 'default' });
        const allIcons: IconFile[] = [];
        
        // 处理svg文件
        for (const [path, module] of Object.entries(svgModules)) {
          const iconPath = await module();
          const iconId = path.split('/').pop()?.replace('.svg', '') || '';
          allIcons.push({
            id: iconId,
            name: iconId,
            path: iconPath,
            type: 'svg' as const
          });
        }
        
        setIcons(allIcons);
      } catch (error) {
        console.error('Failed to load icons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcons();
  }, []);

  // 处理图标点击添加
  const handleIconClick = (iconId: string, iconType: 'svg' | 'tsx') => {
    // 计算新图标的位置（从左到右排列）
    const iconCount = config?.icons?.length || 0;
    if (iconCount >= 12) return; // 最多12个图标
    
    const x = 50 + iconCount * 96; // 每个图标间隔96px
    const y = config?.height / 2 || 50; // 上下居中
    
    addIcon(iconId, x, y, iconType);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">图标选择</h3>
      <div className="grid grid-cols-5 gap-2">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="border border-border rounded-md p-2 text-center cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleIconClick(icon.id, icon.type)}
            aria-label={icon.name}
          >
            <div className="flex items-center justify-center">
              {icon.type === 'svg' ? (
                <img
                  src={icon.path}
                  alt={icon.name}
                  className="w-6 h-6"
                />
              ) : (
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs">TSX</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        拖拽图标到预览区域添加
      </p>
    </div>
  );
};

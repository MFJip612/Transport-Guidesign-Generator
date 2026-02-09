import React, { useState } from 'react';
import { useSign } from '../../context/SignContext';

export const SignEditor: React.FC = () => {
  const { config, updateChineseText, updateEnglishText, updateSize, updateFontSize, addIcon } = useSign();
  const [isTextEditorExpanded, setIsTextEditorExpanded] = useState(false);

  // 处理文字作为特殊图标添加
  const handleAddTextAsIcon = () => {
    if (!config.chineseText && !config.englishText) return;
    
    // 计算新图标的位置（从左到右排列）
    const iconCount = config.icons.length;
    if (iconCount >= 12) return; // 最多12个图标
    
    const x = 50 + iconCount * 96; // 每个图标间隔96px
    const y = config.height / 2; // 上下居中
    
    // 组合中文和英文文本
    const combinedText = `${config.chineseText} ${config.englishText}`.trim();
    
    // 添加文字作为特殊图标
    addIcon('text', x, y, 'tsx', combinedText);
  };

  // 自动调整宽度以适应图标数量
  React.useEffect(() => {
    const iconCount = config.icons.length;
    // 计算最小宽度为元素数量*100，步长为100
    const minWidth = Math.max(100, iconCount * 100);
    
    // 只有当当前宽度小于最小宽度时才自动调整
    // 这样用户可以设置更大的宽度，不会被覆盖
    if (config.width < minWidth) {
      // 确保宽度不超过1200
      const newWidth = Math.min(1200, minWidth);
      updateSize(newWidth, config.height);
    }
  }, [config.icons.length, config.width, config.height, updateSize]);

  return (
    <div className="space-y-6">
      {/* 文字编辑 - 点击展开/收起 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">文字内容</label>
          <button
            onClick={() => setIsTextEditorExpanded(!isTextEditorExpanded)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isTextEditorExpanded ? '收起' : '编辑'}
          </button>
        </div>
        {isTextEditorExpanded ? (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={config.chineseText}
                onChange={(e) => updateChineseText(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="输入中文文字"
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={config.englishText}
                onChange={(e) => updateEnglishText(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="输入英文文字"
              />
              <button
                onClick={handleAddTextAsIcon}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                disabled={!config.chineseText && !config.englishText}
              >
                添加为图标
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 border border-border rounded-md bg-background text-foreground">
            {config.chineseText || config.englishText ? (
              <div>
                {config.chineseText && <div>{config.chineseText}</div>}
                {config.englishText && <div className="text-sm text-muted-foreground">{config.englishText}</div>}
              </div>
            ) : (
              '无文字内容'
            )}
          </div>
        )}
      </div>

      {/* 尺寸调整 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">尺寸设置</label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>宽度: {config.width}px (最小{Math.max(100, config.icons.length * 100)}px, 最大1200px)</span>
            </div>
            <input
              type="range"
              min={Math.max(100, config.icons.length * 100)}
              max="1200"
              step="100"
              value={config.width}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                const minWidth = Math.max(100, config.icons.length * 100);
                const clampedValue = Math.max(minWidth, Math.min(1200, newValue));
                updateSize(clampedValue, config.height);
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>高度: {config.height}px</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              value={config.height}
              onChange={(e) => updateSize(config.width, Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 字体大小调整 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">字体大小</label>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>大小: {config.fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="48"
            value={config.fontSize}
            onChange={(e) => updateFontSize(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 图标数量信息 */}
      <div className="text-sm text-muted-foreground">
        图标数量: {config.icons.length}/12 (最多12个图标)
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { useSign } from '../../context/SignContext';

const svgUrlMap = Object.entries(
  import.meta.glob('/src/icons/**/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>
).reduce<Record<string, string>>((acc, [path, url]) => {
  const iconId = path.split('/').pop()?.replace('.svg', '');
  if (iconId) {
    acc[iconId] = url as string;
  }
  return acc;
}, {});

const getSvgUrl = (iconId: string) => svgUrlMap[iconId] || '';

export const SignPreview: React.FC = () => {
  const { config, addIcon, updateIconPosition, removeIcon } = useSign();
  const [chineseWidth, setChineseWidth] = useState<number>(0);
  const chineseRef = useRef<HTMLSpanElement>(null);

  // 当文字内容或字体大小变化时，重新计算中文宽度
  useEffect(() => {
    if (chineseRef.current) {
      setChineseWidth(chineseRef.current.offsetWidth);
    }
  }, [config.chineseText, config.fontSize]);

  // 处理拖放事件
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const iconId = e.dataTransfer.getData('iconId');
    const iconType = e.dataTransfer.getData('iconType') || 'svg';
    if (iconId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addIcon(iconId, x, y, iconType as 'svg' | 'tsx');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 处理图标拖拽
  const handleIconDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('iconIndex', index.toString());
  };

  const handleIconDrop = (e: React.DragEvent, iconIndex: number) => {
    e.preventDefault();
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateIconPosition(iconIndex, x, y);
    }
  };

  const handleIconDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          className="flex items-center justify-center rounded-md shadow-lg transition-all duration-300 relative overflow-hidden preview-container"
          style={{
            width: `${config.width}px`,
            height: `${config.height}px`,
            backgroundColor: config.template.backgroundColor,
            color: config.template.textColor,
            fontSize: `${config.fontSize}px`,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* 文字内容 - 支持中英文两行显示，无文字时不显示 */}
          {(config.chineseText || config.englishText) && (
            <div className="text-center font-medium px-4 z-10 flex flex-col items-center justify-center">
              {config.chineseText && (
                <span ref={chineseRef} style={{ fontSize: `${config.fontSize}px` }}>{config.chineseText}</span>
              )}
              {config.englishText && (
                <span style={{
                  fontSize: `${config.fontSize / 3}px`,
                  maxWidth: `${chineseWidth || '100%'}px`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{config.englishText}</span>
              )}
            </div>
          )}

          {/* 图标 */}
          {config.icons.map((iconPosition, index) => {
            return (
              <div
                key={`${iconPosition.iconId}-${index}`}
                className="absolute cursor-move z-20"
                style={{
                  left: `${iconPosition.x}px`,
                  top: `${iconPosition.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                draggable
                onDragStart={(e) => handleIconDragStart(e, index)}
                onDrop={(e) => handleIconDrop(e, index)}
                onDragOver={handleIconDragOver}
              >
                <div className="relative">
                  {/* 根据图标类型渲染不同内容，以96*96大小显示 */}
                  {iconPosition.iconType === 'svg' ? (
                    <div style={{ width: '96px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={getSvgUrl(iconPosition.iconId)}
                        alt={iconPosition.iconId}
                        style={{
                          width: '96px',
                          height: '96px',
                          // 根据背景色和图标类型调整图标颜色
                          filter: (config.template.backgroundColor === '#FFFFFF'
                            ? 'invert(0%)' // 白色背景时，其他图标保持黑色
                            : 'invert(100%)') // 黑色背景时，其他图标变为白色
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: '96px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{
                        color: config.template.textColor,
                        fontSize: '24px'
                      }}>
                        {iconPosition.textContent || 'TSX'}
                      </span>
                    </div>
                  )}
                  {/* <button
                    className="absolute -top-4 -right-4 bg-destructive text-destructive-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeIcon(index);
                    }}
                    aria-label="删除图标"
                  >
                    ×
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        尺寸: {config.width}px × {config.height}px
      </div>

      {/* 元素管理区域 */}
      <div className="w-full max-w-md mt-4">
        <h3 className="text-sm font-medium mb-3">当前元素</h3>
        <div className="border border-border rounded-md p-3 space-y-2">
          {config.icons.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无元素</p>
          ) : (
            config.icons.map((iconPosition, index) => (
              <div
                key={`${iconPosition.iconId}-${index}`}
                className="flex items-center justify-between p-2 hover:bg-muted rounded transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {/* 元素预览 */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {iconPosition.iconType === 'svg' ? (
                      <img
                        src={getSvgUrl(iconPosition.iconId)}
                        alt={iconPosition.iconId}
                        className="w-6 h-6"
                        style={{
                          filter: (config.template.backgroundColor === '#FFFFFF'
                            ? 'invert(0%)'
                            : 'invert(100%)')
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs">{iconPosition.textContent?.substring(0, 2) || 'TSX'}</span>
                      </div>
                    )}
                  </div>
                  {/* 元素信息 */}
                  <div>
                    <p className="text-sm font-medium">
                      {iconPosition.iconType === 'svg'
                        ? iconPosition.iconId
                        : iconPosition.textContent || '文字元素'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      位置: ({Math.round(iconPosition.x)}, {Math.round(iconPosition.y)})
                    </p>
                  </div>
                </div>
                {/* 删除按钮 */}
                <button
                  className="p-1.5 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors"
                  onClick={() => removeIcon(index)}
                  aria-label="删除元素"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

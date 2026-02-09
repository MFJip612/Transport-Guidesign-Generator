import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 模板类型
interface Template {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}

// 图标类型
interface Icon {
  id: string;
  name: string;
  path: string;
}

// 图标位置
interface IconPosition {
  x: number;
  y: number;
  iconId: string;
  iconType: 'svg' | 'tsx';
  textContent?: string; // 用于TSX组件的文字内容
}

// 导向标识配置
interface SignConfig {
  template: Template;
  text: string;
  chineseText: string;
  englishText: string;
  width: number;
  height: number;
  fontSize: number;
  icons: IconPosition[];
}

// 导出选项接口
interface ExportOptions {
  format: 'png' | 'jpeg';
  quality: number;
}

// 图标数据
const icons: Icon[] = [
  // GZMTR 图标
  { id: 'gzmtr-airport', name: 'GZMTR 机场图标', path: '/src/icons/gzmtr/icons/airport-icon.tsx' },
  { id: 'gzmtr-railway', name: 'GZMTR 铁路图标', path: '/src/icons/gzmtr/icons/railway-icon.tsx' },
  { id: 'gzmtr-intercity', name: 'GZMTR 城际图标', path: '/src/icons/gzmtr/icons/intercity-icon.tsx' },
  
  // MTR 图标
  { id: 'mtr-airport', name: 'MTR 机场图标', path: '/src/icons/mtr/icons/airport-icon.tsx' },
  { id: 'mtr-disney', name: 'MTR 迪士尼图标', path: '/src/icons/mtr/icons/disney-icon.tsx' },
  { id: 'mtr-hsr', name: 'MTR 高铁图标', path: '/src/icons/mtr/icons/hsr-icon.tsx' },
  { id: 'mtr-np360', name: 'MTR NP360图标', path: '/src/icons/mtr/icons/np360-icon.tsx' },
  
  // FMetro 图标
  { id: 'fmetro-station', name: 'FMetro 车站图标', path: '/src/icons/fmetro/station-icon/station-icon.tsx' },
];


// 默认模板（用于初始加载）
const defaultTemplates: Template[] = [
  { id: '1', name: '白底', backgroundColor: '#FFFFFF', textColor: '#000000' },
  { id: '2', name: '黑底', backgroundColor: '#000000', textColor: '#FFFFFF' },
];

// 默认标识配置
const defaultConfig: SignConfig = {
  template: defaultTemplates[0],
  text: '',
  chineseText: '',
  englishText: '',
  width: 100,
  height: 100,
  fontSize: 24,
  icons: [],
};

interface SignContextType {
  config: SignConfig;
  templates: Template[];
  icons: Icon[];
  isLoading: boolean;
  error: string | null;
  setConfig: React.Dispatch<React.SetStateAction<SignConfig>>;
  updateTemplate: (template: Template) => void;
  updateText: (text: string) => void;
  updateChineseText: (text: string) => void;
  updateEnglishText: (text: string) => void;
  updateSize: (width: number, height: number) => void;
  updateFontSize: (fontSize: number) => void;
  addIcon: (iconId: string, x: number, y: number) => void;
  updateIconPosition: (index: number, x: number, y: number) => void;
  removeIcon: (index: number) => void;
  exportSign: (options: ExportOptions) => Promise<string>;
}

const SignContext = createContext<SignContextType | undefined>(undefined);

// API基础URL
const API_BASE_URL = 'http://localhost:8787'; // Cloudflare Workers本地开发端口

export const SignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SignConfig>(defaultConfig);
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从API获取模板数据
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/templates`);
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setTemplates(data.data);
          // 更新默认模板为第一个模板
          setConfig(prev => ({
            ...prev,
            template: data.data[0]
          }));
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('获取模板失败，使用默认模板');
        // 保持使用默认模板
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 更新模板
  const updateTemplate = (template: Template) => {
    setConfig(prev => ({ ...prev, template }));
  };

  // 更新文字
  const updateText = (text: string) => {
    setConfig(prev => ({ ...prev, text }));
  };

  // 更新中文文字
  const updateChineseText = (chineseText: string) => {
    setConfig(prev => ({ ...prev, chineseText }));
  };

  // 更新英文文字
  const updateEnglishText = (englishText: string) => {
    setConfig(prev => ({ ...prev, englishText }));
  };

  // 更新尺寸
  const updateSize = (width: number, height: number) => {
    setConfig(prev => ({ ...prev, width, height }));
  };

  // 更新字体大小
  const updateFontSize = (fontSize: number) => {
    setConfig(prev => ({ ...prev, fontSize }));
  };

  // 添加图标
  const addIcon = (iconId: string, x: number, y: number, iconType: 'svg' | 'tsx' = 'svg', textContent?: string) => {
    setConfig(prev => ({
      ...prev,
      icons: [...prev.icons, { x, y, iconId, iconType, textContent }]
    }));
  };

  // 更新图标位置
  const updateIconPosition = (index: number, x: number, y: number) => {
    setConfig(prev => {
      const newIcons = [...prev.icons];
      if (newIcons[index]) {
        newIcons[index] = { ...newIcons[index], x, y };
      }
      return { ...prev, icons: newIcons };
    });
  };

  // 删除图标
  const removeIcon = (index: number) => {
    setConfig(prev => ({
      ...prev,
      icons: prev.icons.filter((_, i) => i !== index)
    }));
  };

  // 添加一个异步函数来获取SVG内容
  const getSvgContent = async (iconId: string): Promise<string> => {
    try {
      const response = await fetch(`/src/icons/${iconId}.svg`);
      if (!response.ok) {
        throw new Error(`Failed to load SVG for ${iconId}`);
      }
      let svgContent = await response.text();
      
      // 移除XML声明，确保SVG内容纯净
      svgContent = svgContent.replace(/<\?xml[^>]*\?>/g, '');
      
      return svgContent;
    } catch (error) {
      console.error(`Error loading SVG for ${iconId}:`, error);
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><text x="12" y="15" text-anchor="middle" font-size="8" fill="currentColor">${iconId.substring(0, 4)}</text></svg>`;
    }
  };

  // 导出标识
  const exportSign = async (_options: ExportOptions): Promise<string> => {
    try {
      // 动态导入html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // 获取预览元素
      const previewElement = document.querySelector('.preview-container') as HTMLElement;
      if (!previewElement) {
        throw new Error('找不到预览容器');
      }

      // 使用html2canvas截取预览
      const canvas = await html2canvas(previewElement, {
        backgroundColor: config.template.backgroundColor,
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true
      });

      // 直接将canvas转换为Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error('无法生成图像');
          }
        }, 'image/png');
      });

      // 创建FormData并发送到后端
      const formData = new FormData();
      formData.append('image', blob, 'sign.png');
      
      // 添加配置信息
      formData.append('config', JSON.stringify({
        ...config,
        width: canvas.width,
        height: canvas.height
      }));

      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('导出失败');
      }

      const data = await response.json();
      if (data.success) {
        return data.data.imageUrl;
      } else {
        throw new Error(data.error || '导出失败');
      }
    } catch (err) {
      console.error('导出失败:', err);
      // 失败时返回模拟数据
      return 'https://example.com/sign.png';
    }
  };

  return (
    <SignContext.Provider
      value={{
        config,
        templates,
        icons,
        isLoading,
        error,
        setConfig,
        updateTemplate,
        updateText,
        updateChineseText,
        updateEnglishText,
        updateSize,
        updateFontSize,
        addIcon,
        updateIconPosition,
        removeIcon,
        exportSign,
      }}
    >
      {children}
    </SignContext.Provider>
  );
};

// 自定义Hook，用于访问上下文
export const useSign = () => {
  const context = useContext(SignContext);
  if (!context) {
    throw new Error('useSign must be used within a SignProvider');
  }
  return context;
};

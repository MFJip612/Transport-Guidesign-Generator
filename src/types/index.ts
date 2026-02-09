// 模板类型
export interface Template {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}

// 图标类型
export interface Icon {
  id: string;
  name: string;
  path: string;
}

// 图标位置
export interface IconPosition {
  x: number;
  y: number;
  iconId: string;
  iconType: 'svg' | 'tsx';
  textContent?: string;
  svgContent?: string;
}

// 导向标识配置
export interface SignConfig {
  template: Template;
  text: string;
  chineseText: string;
  englishText: string;
  width: number;
  height: number;
  fontSize: number;
  icons: IconPosition[];
}

// 导出选项
export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality: number;
}
import React, { useState } from 'react';
import { useSign } from '../../context/SignContext';

// 导出选项接口
interface ExportOptions {
  format: 'png' | 'jpeg';
  quality: number;
}

export const ExportPanel: React.FC = () => {
  const { exportSign } = useSign();
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format: 'png',
        quality: 0.9,
      };
      const url = await exportSign(options);
      setExportUrl(url);
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 mt-8 pt-4 border-t border-border">
      <h3 className="text-sm font-semibold">导出设置</h3>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? '导出中...' : '导出标识'}
      </button>
      {exportUrl && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">导出成功！</p>
          <a
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            查看导出的标识
          </a>
        </div>
      )}
    </div>
  );
};

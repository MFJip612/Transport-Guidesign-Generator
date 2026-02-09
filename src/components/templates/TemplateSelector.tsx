import React from 'react';
import { useSign } from '../../context/SignContext';

export const TemplateSelector: React.FC = () => {
  const { templates, config, updateTemplate, isLoading, error } = useSign();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 ${
              config.template.id === template.id
                ? 'ring-2 ring-primary ring-offset-2'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: template.backgroundColor }}
            onClick={() => updateTemplate(template)}
            aria-label={template.name}
          >
            <span
              className="text-xs font-medium"
              style={{ color: template.textColor }}
            >
              {template.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Transport Guidesign Generator - Cloudflare Worker
 * 
 * This worker provides backend API endpoints for the Transport Guidesign Generator application.
 */

export interface Env {
  ENVIRONMENT?: string;
}

// 预设模板数据
const presetTemplates = [
  { id: '1', name: '白底', backgroundColor: '#FFFFFF', textColor: '#000000' },
  { id: '2', name: '黑底', backgroundColor: '#000000', textColor: '#FFFFFF' },
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers for development
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Root endpoint
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(JSON.stringify({
        message: 'Transport Guidesign Generator API',
        version: '1.0.0',
        environment: env.ENVIRONMENT || 'development',
        endpoints: {
          health: '/health',
          templates: '/api/templates',
          export: '/api/export',
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || 'development',
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // API routes
    if (url.pathname.startsWith('/api/')) {
      // Templates API - GET all templates
      if (url.pathname === '/api/templates' && request.method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          data: presetTemplates,
          timestamp: new Date().toISOString(),
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Export API - POST to export sign
      if (url.pathname === '/api/export' && request.method === 'POST') {
        try {
          // 检查是否为multipart/form-data请求
          if (request.headers.get('content-type')?.includes('multipart/form-data')) {
            // 解析表单数据
            const formData = await request.formData();
            const imageBlob = formData.get('image') as Blob | null;
            const configStr = formData.get('config') as string;

            if (!imageBlob) {
              throw new Error('缺少图像数据');
            }

            if (!configStr) {
              throw new Error('缺少配置数据');
            }

            // 将Blob转换为ArrayBuffer
            const arrayBuffer = await imageBlob.arrayBuffer();
            
            // 转换为base64编码
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64String = btoa(binary);
            
            // 返回图像数据URL
            return new Response(JSON.stringify({
              success: true,
              data: {
                imageUrl: `data:image/png;base64,${base64String}`,
                // 如果需要，也可以返回原始图像
                imageBlob: base64String,
              },
              timestamp: new Date().toISOString(),
            }), {
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            });
          } else {
            // 如果不是multipart请求，仍然支持JSON格式
            const config = await request.json();
            
            // 生成SVG作为后备方案
            const svg = generateSignSVG(config);
            
            // Create a data URL for the SVG
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
            
            return new Response(JSON.stringify({
              success: true,
              data: {
                svg,
                svgDataUrl,
                // For now, we'll return the SVG data URL as the image URL
                // In a production environment, you might want to upload to a storage service
                imageUrl: svgDataUrl,
              },
              timestamp: new Date().toISOString(),
            }), {
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            });
          }
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Failed to generate sign',
            details: error instanceof Error ? error.message : String(error),
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
      }

      // API endpoint not found
      return new Response(JSON.stringify({
        error: 'API endpoint not found',
        path: url.pathname,
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // 404 for all other routes
    return new Response(JSON.stringify({
      error: 'Not found',
      path: url.pathname,
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  },
};

// 生成SVG格式的导向标识（保留为后备方案）
function generateSignSVG(config: any): string {
  const {
    text,
    chineseText = '',
    englishText = '',
    width = 300,
    height = 100,
    fontSize = 24,
    icons: iconPositions = [],
    screenshot,
    template: {
      backgroundColor = '#E53935',
      textColor = '#FFFFFF'
    }
  } = config;

  // 如果有预览截图，直接返回包含该截图的SVG
  if (screenshot) {
    // 提取图像数据URL中的Base64数据
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
    
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <image width="${width}" height="${height}" href="data:image/png;base64,${base64Data}" />
      </svg>
    `;
  }

  // 否则使用原来的SVG生成逻辑
  // 根据图标数量调整宽度，确保每个图标至少占用100px宽度
  const iconCount = Array.isArray(iconPositions) ? iconPositions.length : 0;
  const minWidth = Math.max(100, iconCount * 100);
  const adjustedWidth = Math.max(width, minWidth);

  // 生成图标元素
  const iconElements = iconPositions.map((position: any) => {
    if (position.iconType === 'svg') {
      // 使用从前端传来的SVG内容
      let iconSvg = position.svgContent || '';
      
      if (!iconSvg) {
        // 如果没有SVG内容，返回一个默认的图标占位符
        return `
          <g transform="translate(${position.x}, ${position.y})">
            <rect x="-48" y="-48" width="96" height="96" fill="#ccc" opacity="0.5" rx="4" />
            <text x="0" y="5" text-anchor="middle" fill="${textColor}" font-size="16" font-family="Arial, sans-serif">
              ${position.iconId.substring(0, 4)}
            </text>
          </g>
        `;
      }
      
      // 确保移除任何XML声明和DOCTYPE声明
      iconSvg = iconSvg.replace(/<\?xml[^>]*\?>/g, '').replace(/<!DOCTYPE[^>]*>/g, '');
      
      // 特殊处理以"arrow"开头的图标，根据背景色自动调整颜色
      if (position.iconId.toLowerCase().startsWith('arrow')) {
        // 替换SVG中的颜色属性为模板指定的颜色，特别注意箭头类图标
        iconSvg = iconSvg.replace(/(stroke|fill)="([^"]*)"/g, (match: string, attr: string, colorValue: string) => {
          // 检查是否为通用颜色属性或特定颜色值
          if (colorValue.toLowerCase() === 'currentcolor' || 
              colorValue.includes('#000') || 
              colorValue.includes('black') || 
              colorValue.includes('#fff') || 
              colorValue.includes('white')) {
            return `${attr}="${textColor}"`;
          }
          // 如果原颜色非常接近黑色或白色，也替换为模板颜色
          if (colorValue.toLowerCase() === '#ffffff' || colorValue.toLowerCase() === '#000000') {
            return `${attr}="${textColor}"`;
          }
          // 其他颜色保持不变
          return match;
        });
      } else {
        // 对于非箭头类图标，只替换明显的颜色关键词
        iconSvg = iconSvg.replace(/(stroke|fill)="([^"]*)"/g, (match: string, attr: string, colorValue: string) => {
          // 如果原来的值是currentColor或者是颜色关键词，则替换为textColor
          if (colorValue.toLowerCase() === 'currentcolor' || 
              colorValue.includes('#000') || 
              colorValue.includes('black') ||
              colorValue.toLowerCase() === '#ffffff' ||
              colorValue.toLowerCase() === '#000000') {
            return `${attr}="${textColor}"`;
          }
          // 其他颜色保持不变
          return match;
        });
      }
      
      return `
        <g transform="translate(${position.x}, ${position.y})">
          <g transform="translate(-48, -48) scale(2)">
            ${iconSvg}
          </g>
        </g>
      `;
    } else {
      // 处理TSX组件
      const textContent = position.textContent || 'TSX';
      return `
        <g transform="translate(${position.x}, ${position.y})">
          <rect x="-48" y="-48" width="96" height="96" fill="${backgroundColor === '#FFFFFF' ? '#6B7280' : '#E5E7EB'}" opacity="0.5" rx="4" />
          <text x="0" y="5" text-anchor="middle" fill="${textColor}" font-size="24" font-family="Arial, sans-serif">
            ${textContent}
          </text>
        </g>
      `;
    }
  }).join('');

  // 组合最终的文字内容
  const finalText = chineseText && englishText 
    ? `${chineseText}\n${englishText}` 
    : chineseText || englishText || text;

  return `
    <svg width="${adjustedWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="4" ry="4" />
      ${finalText ? `
      <!-- 文字内容 - 支持中英文两行显示 -->
      <g transform="translate(${adjustedWidth/2}, ${height/2})">
        ${(() => {
          // 检查是否有换行符，如果有则按多行处理
          if (finalText.includes('\n')) {
            const lines = finalText.split('\n');
            if (lines.length === 2) {
              return `
                <text
                  x="0"
                  y="-${fontSize/3}"
                  font-size="${fontSize}"
                  font-weight="500"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  fill="${textColor}"
                  font-family="Arial, sans-serif"
                >
                  ${lines[0]}
                </text>
                <text
                  x="0"
                  y="${fontSize/3}"
                  font-size="${fontSize/3}"
                  font-weight="500"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  fill="${textColor}"
                  font-family="Arial, sans-serif"
                >
                  ${lines[1]}
                </text>
              `;
            }
          }
          
          // 单行文本处理
          return `
            <text
              x="0"
              y="0"
              font-size="${fontSize}"
              font-weight="500"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="${textColor}"
              font-family="Arial, sans-serif"
            >
              ${finalText}
            </text>
          `;
        })()}
      </g>
      ` : ''}
      ${iconElements}
    </svg>
  `;
}
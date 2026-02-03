/**
 * Sitemap 增强工具
 * 生成图片 sitemap 和带优先级的 sitemap
 */

import { writeFile, readdir, stat } from 'fs/promises';
import { join as joinPath, relative as relativePath } from 'path';

interface ImageSitemapEntry {
  loc: string;
  caption?: string;
  title?: string;
  geo_location?: string;
  license?: string;
}

interface ImageSitemapUrl {
  loc: string;
  image: ImageSitemapEntry[];
}

/**
 * 生成图片 sitemap
 */
export async function buildImageSitemap(
  siteUrl: string,
  publicDir: string,
  outDir: string
): Promise<void> {
  const images: ImageSitemapUrl[] = [];
  const imagesDir = joinPath(publicDir, 'images');

  try {
    // 递归扫描 images 目录
    const scanImages = async (dir: string, relativeDir: string = '') => {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = joinPath(dir, entry.name);
        const relPath = joinPath(relativeDir, entry.name);

        if (entry.isDirectory()) {
          await scanImages(fullPath, relPath);
        } else if (entry.isFile() && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(entry.name)) {
          const webPath = `/images/${relPath}`;

          images.push({
            loc: `${siteUrl}${webPath.replace(/\\/g, '/')}`,
            image: [
              {
                loc: `${siteUrl}${webPath.replace(/\\/g, '/')}`,
                title: entry.name.replace(/\.[^/.]+$/, ''), // 文件名作为标题
              }
            ]
          });
        }
      }
    };

    await scanImages(imagesDir);

    // 生成图片 sitemap XML
    const imageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(img => `  <url>
    <loc>${img.loc}</loc>
    ${img.image.map(i => `<image:image>
      <image:loc>${i.loc}</image:loc>
      ${i.title ? `<image:title>${escapeXml(i.title)}</image:title>` : ''}
    </image:image>`).join('\n    ')}
  </url>`).join('\n')}
</urlset>`;

    await writeFile(joinPath(outDir, 'image-sitemap.xml'), imageSitemapXml, 'utf-8');
  } catch (error) {
    console.warn('Failed to generate image sitemap:', error);
  }
}

/**
 * 计算 sitemap 优先级
 */
export function calculatePagePriority(relativePath: string): number {
  if (relativePath === 'index.md') return 1.0;

  const indexPaths = [
    'Basic/index.md',
    'Advanced/index.md',
    'Practice/index.md',
    'Articles/index.md'
  ];
  if (indexPaths.some(p => relativePath.endsWith(p))) return 0.9;

  if (relativePath.includes('00-preface') ||
      relativePath.includes('00-quick-start') ||
      relativePath.includes('00-recommended-config')) return 0.8;

  if (relativePath.startsWith('Basic/') && !relativePath.includes('appendix')) return 0.8;
  if (relativePath.startsWith('Advanced/')) return 0.7;
  if (relativePath.startsWith('Practice/')) return 0.7;
  if (relativePath.startsWith('Articles/')) return 0.6;

  if (relativePath.includes('appendix') || relativePath.includes('99-')) return 0.5;

  return 0.6;
}

/**
 * 计算更新频率
 */
export function calculateChangeFreq(relativePath: string): string {
  if (relativePath === 'index.md') return 'weekly';
  if (relativePath.includes('index.md')) return 'weekly';
  if (relativePath.startsWith('Basic/')) return 'monthly';
  if (relativePath.startsWith('Advanced/')) return 'monthly';
  return 'yearly';
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

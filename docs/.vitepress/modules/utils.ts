/**
 * 工具函数模块
 * 提供文本处理、路径转换、XML转义等通用功能
 */

/**
 * 移除 Markdown frontmatter
 */
export function stripFrontmatter(markdownSource: string): string {
  if (!markdownSource.startsWith('---')) return markdownSource;
  const match = markdownSource.match(/^---\s*\n[\s\S]*?\n---\s*\n/);
  if (!match) return markdownSource;
  return markdownSource.slice(match[0].length);
}

/**
 * 简单解析 frontmatter（仅提取键值对）
 */
export function parseSimpleFrontmatter(markdownSource: string): Record<string, string> {
  if (!markdownSource.startsWith('---')) return {};
  const match = markdownSource.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return {};

  const body = match[1];
  const result: Record<string, string> = {};
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf(':');
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '').trim();
    if (key) result[key] = value;
  }
  return result;
}

/**
 * 移除 Markdown 语法，提取纯文本
 */
export function stripMarkdown(markdownSource: string): string {
  let text = stripFrontmatter(markdownSource);
  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/`[^`]*`/g, ' ');
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/^>\s?/gm, '');
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * 截断文本到指定长度
 */
export function truncateText(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength).trim();
}

/**
 * 从 Markdown 提取描述
 */
export function extractDescriptionFromMarkdown(markdownSource: string): string | undefined {
  const text = stripMarkdown(markdownSource);
  if (!text) return undefined;
  return truncateText(text, 160);
}

/**
 * XML 转义
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * CDATA 安全包装
 */
export function safeCdata(text: string): string {
  return text.replace(/]]>/g, ']]]]><![CDATA[>');
}

/**
 * JSON-LD 安全转义
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * 路径转 URL 路径
 */
export function urlPathForPage(relativePath: string): string {
  const p = relativePath.replace(/\\/g, '/');
  if (p === 'index.md') return '/';
  if (p.endsWith('/index.md')) return `/${p.slice(0, -'/index.md'.length)}/`;
  return `/${p.replace(/\.md$/, '.html')}`;
}

/**
 * 估算阅读时间（分钟）
 * 中文：200字/分钟，英文：200词/分钟
 */
export function estimateReadingTime(markdownSource: string): number {
  const text = stripMarkdown(markdownSource);
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return Math.ceil((chineseChars + englishWords) / 200);
}

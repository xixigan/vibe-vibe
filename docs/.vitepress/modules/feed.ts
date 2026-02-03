/**
 * RSS Feed 和 robots.txt 生成模块
 */

import { writeFile } from 'fs/promises';
import type { SiteConfig } from 'vitepress';
import {
  escapeXml,
  safeCdata,
  urlPathForPage,
  extractDescriptionFromMarkdown,
  estimateReadingTime,
  stripFrontmatter,
  parseSimpleFrontmatter
} from './utils';

/**
 * RSS Item 类型定义
 */
export type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
  author?: string;
  readingTime?: number;
};

/**
 * 生成优化的 robots.txt
 */
export async function generateRobotsTxt(siteConfig: SiteConfig, siteUrl: string): Promise<void> {
  const sitemapLine = siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : '\n';
  const robotsContent = `User-agent: *
Allow: /
Crawl-delay: 1${sitemapLine}

# 禁止爬取缓存和临时文件
Disallow: /cache/
Disallow: /.vitepress/cache/

# 禁止爬取搜索结果页（如果有）
Disallow: /search?

# 允许主要搜索引擎
User-agent: Googlebot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Slurp
Allow: /
`;
  await writeFile(`${siteConfig.outDir}/robots.txt`, robotsContent, 'utf-8');
}

/**
 * 从页面内容提取 RSS Item
 */
export async function extractRssItem(
  source: string,
  page: string,
  siteUrl: string,
  siteDescription: string
): Promise<RssItem> {
  const frontmatter = parseSimpleFrontmatter(source);
  const contentSource = stripFrontmatter(source);

  const title =
    frontmatter.title ||
    (contentSource.match(/^#\s+(.+)\s*$/m)?.[1]?.trim() || '') ||
    page.replace(/\/index\.md$/i, '').replace(/\.md$/i, '');

  const description =
    frontmatter.description ||
    extractDescriptionFromMarkdown(source) ||
    siteDescription;

  const link = `${siteUrl}${urlPathForPage(page)}`;

  // 提取分类信息
  let category: string | undefined;
  if (page.startsWith('Basic/')) category = '基础篇';
  else if (page.startsWith('Advanced/')) category = '进阶篇';
  else if (page.startsWith('Practice/')) category = '实践篇';
  else if (page.startsWith('Articles/')) category = '优质文章';

  // 计算阅读时间
  const readingTime = estimateReadingTime(source);

  // 获取发布时间
  const pubDateCandidate = frontmatter.date ? new Date(frontmatter.date as string) : undefined;
  const pubDate = pubDateCandidate && !Number.isNaN(pubDateCandidate.getTime())
    ? pubDateCandidate
    : new Date();

  return {
    title,
    link,
    description,
    pubDate,
    category,
    author: 'Eyre',
    readingTime
  };
}

/**
 * 构建 RSS XML
 */
export function buildRssXml(
  items: RssItem[],
  siteTitle: string,
  siteUrl: string,
  siteDescription: string
): string {
  const lastBuildDate = items[0]?.pubDate ?? new Date();

  const rssItemsXml = items
    .slice(0, 200)
    .map((item) => {
      const title = escapeXml(item.title);
      const link = escapeXml(item.link);
      const pubDate = escapeXml(item.pubDate.toUTCString());
      const description = safeCdata(item.description);
      const category = item.category ? `<category>${escapeXml(item.category)}</category>` : '';
      const author = item.author ? `<author>${escapeXml(item.author)}</author>` : '';
      const readingTime = item.readingTime ? `<docs:readingTime>${item.readingTime}</docs:readingTime>` : '';

      return [
        '<item>',
        `<title>${title}</title>`,
        `<link>${link}</link>`,
        `<guid isPermaLink="true">${link}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description><![CDATA[${description}]]></description>`,
        category,
        author,
        readingTime,
        '</item>'
      ].join('');
    })
    .join('');

  const channelTitle = escapeXml(siteTitle);
  const channelLink = escapeXml(siteUrl);
  const channelDescription = safeCdata(siteDescription);
  const channelLanguage = 'zh-CN';
  const channelLastBuildDate = escapeXml(lastBuildDate.toUTCString());
  const channelManagingEditor = 'Eyre (contact@vibevibe.cn)';
  const channelWebMaster = 'Eyre (contact@vibevibe.cn)';
  const channelCategory = '编程教程';

  const rssXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:docs="http://example.com/docs">',
    '<channel>',
    `<title>${channelTitle}</title>`,
    `<link>${channelLink}</link>`,
    `<description><![CDATA[${channelDescription}]]></description>`,
    `<language>${channelLanguage}</language>`,
    `<lastBuildDate>${channelLastBuildDate}</lastBuildDate>`,
    `<managingEditor>${channelManagingEditor}</managingEditor>`,
    `<webMaster>${channelWebMaster}</webMaster>`,
    `<category>${channelCategory}</category>`,
    `<docs>https://www.rssboard.org/rss-specification</docs>`,
    `<generator>VibeVibe RSS Generator</generator>`,
    `<ttl>60</ttl>`,
    rssItemsXml,
    '</channel>',
    '</rss>'
  ].join('');

  return rssXml;
}

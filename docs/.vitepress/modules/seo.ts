/**
 * SEO 优化模块
 * 提供结构化数据、面包屑导航、meta 标签生成等功能
 */

import type { HeadConfig } from 'vitepress';
import { urlPathForPage, safeJsonLd } from './utils';

/**
 * 从路径段提取显示名称
 */
function displayNameFromPathSegment(segment: string): string {
  const decoded = decodeURIComponent(segment);
  const withoutExt = decoded.replace(/\.html$/i, '');
  return withoutExt.replace(/[-_]+/g, ' ').trim() || decoded;
}

/**
 * 构建面包屑导航的结构化数据
 */
export function buildBreadcrumbList(
  urlPath: string,
  fullUrl: string,
  siteUrl: string
): Record<string, unknown> | undefined {
  const normalizedPath = urlPath.replace(/\?.*$/, '').replace(/#.*$/, '');
  const trimmed = normalizedPath.replace(/^\/+|\/+$/g, '');
  const parts = trimmed ? trimmed.split('/').filter(Boolean) : [];
  if (parts.length === 0) return undefined;

  const originMatch = fullUrl.match(/^(https?:\/\/[^/]+)/i);
  const origin = originMatch ? originMatch[1] : siteUrl;

  const elements: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首页',
      item: `${origin}/`
    }
  ];

  let current = '';
  for (let i = 0; i < parts.length; i += 1) {
    current += `/${parts[i]}`;
    const isLast = i === parts.length - 1;
    const itemUrl = isLast ? fullUrl : `${origin}${current}/`;
    elements.push({
      '@type': 'ListItem',
      position: i + 2,
      name: displayNameFromPathSegment(parts[i]),
      item: itemUrl
    });
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: elements
  };
}

/**
 * 构建增强的结构化数据
 */
export interface StructuredDataOptions {
  url: string;
  title: string;
  description: string;
  siteUrl: string;
  siteTitle: string;
  siteTitleFriendly: string;
  siteDescription: string;
  isArticle: boolean;
  frontmatter?: Record<string, unknown>;
  readingTime?: number;
}

export function buildStructuredData(options: StructuredDataOptions): Record<string, unknown> {
  const {
    url,
    title,
    description,
    siteUrl,
    siteTitle,
    siteTitleFriendly,
    siteDescription,
    isArticle,
    frontmatter,
    readingTime
  } = options;

  const urlPath = urlPathForPage(url.replace(siteUrl, ''));
  const breadcrumbList = buildBreadcrumbList(urlPath, url, siteUrl);

  const jsonLdGraph: Array<Record<string, unknown>> = [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteTitle,
      alternateName: siteTitleFriendly,
      description: siteDescription,
      inLanguage: 'zh-CN',
      publisher: {
        '@type': 'Organization',
        name: 'Datawhale',
        url: 'https://github.com/datawhalechina'
      }
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      inLanguage: 'zh-CN',
      ...(readingTime && { timeRequired: `PT${readingTime}M` })
    }
  ];

  // 文章类型添加 Article 结构化数据
  if (isArticle) {
    const datePublished = typeof frontmatter?.date === 'string' ? frontmatter.date : undefined;
    const dateModified = typeof frontmatter?.updated === 'string' ? frontmatter.updated : undefined;

    jsonLdGraph.push({
      '@type': 'Article',
      '@id': `${url}#article`,
      url,
      headline: title,
      description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      inLanguage: 'zh-CN',
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      author: {
        '@type': 'Person',
        name: 'Eyre'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Datawhale',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    });
  }

  if (breadcrumbList) jsonLdGraph.push(breadcrumbList);

  return {
    '@context': 'https://schema.org',
    '@graph': jsonLdGraph
  };
}

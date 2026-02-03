/**
 * Automated Default Values System
 * Automatically applies frontmatter defaults to all pages without manual maintenance
 */

import type { PageData } from 'vitepress';

/**
 * 根据路径自动生成 Meta Description
 */
export function generateAutoDescription(
  title: string,
  relativePath: string,
  content?: string
): string {
  const section = relativePath.split('/')[0];
  const sectionMap: Record<string, string> = {
    'Basic': '零基础入门',
    'Advanced': '进阶全栈',
    'Practice': '项目实战',
    'Articles': '优质文章'
  };

  const sectionName = sectionMap[section] || 'Vibe Coding 教程';

  // 从内容提取关键词或使用默认
  const keywords = extractKeywords(content || '');

  // 生成描述模板
  const templates = [
    `${title} - ${sectionName}。${keywords}，适合初学者和进阶学习者。`,
    `${title} | Vibe Vibe ${sectionName}，掌握${keywords}实战技能。`,
    `学习${title}，${sectionName}章节。包含${keywords}详解，代码示例丰富。`
  ];

  // 选择最合适的模板（不超过 160 字符）
  for (const template of templates) {
    if (template.length <= 160) {
      return template;
    }
  }

  return templates[0].substring(0, 157) + '...';
}

/**
 * 从内容中提取关键词
 */
function extractKeywords(content: string): string {
  const keywordMap: Record<string, string[]> = {
    'Basic': ['AI编程', 'Vibe Coding', 'Cursor', 'MVP', '零基础'],
    'Advanced': ['Next.js', 'TypeScript', 'React', 'Tailwind', '数据库', '部署'],
    'Practice': ['项目实战', '全栈开发', 'AI Agent', '案例分析'],
    'Articles': ['技术博客', '最佳实践', '行业动态']
  };

  // 根据内容特征匹配
  if (content.includes('Next.js') || content.includes('React')) {
    return 'Next.js, React, 全栈开发';
  }
  if (content.includes('数据库') || content.includes('PostgreSQL')) {
    return '数据库设计, SQL, ORM';
  }
  if (content.includes('部署') || content.includes('Vercel')) {
    return '部署, 运维, CI/CD';
  }

  return 'AI辅助开发, 编程教程';
}

/**
 * 根据路径自动推断难度等级
 */
export function inferDifficulty(relativePath: string): string {
  if (relativePath.startsWith('Basic/')) return 'beginner';
  if (relativePath.startsWith('Advanced/')) return 'intermediate';
  if (relativePath.startsWith('Practice/')) return 'intermediate';
  return 'beginner';
}

/**
 * 生成相关页面推荐（基于路径匹配）
 */
export function generateRelatedPages(relativePath: string): string[] {
  const section = relativePath.split('/')[0];
  const currentChapter = relativePath.split('/')[1];

  // 同章节的其他页面
  const sameChapter: string[] = [];

  // 相关章节推荐
  const relatedSections: Record<string, string[]> = {
    'Basic/00-preface': ['Basic/01-awakening', 'Basic/02-mindset'],
    'Basic/01-awakening': ['Basic/02-mindset', 'Basic/03-technique'],
    'Basic/02-mindset': ['Basic/03-technique', 'Advanced/03-prd-doc-driven'],
    'Basic/03-technique': ['Basic/04-practice-0-to-1', 'Advanced/02-ai-tuning-guide'],
    'Basic/04-practice-0-to-1': ['Basic/05-advanced', 'Practice/01-for-liberal-arts'],
    'Basic/05-advanced': ['Advanced/01-environment-setup', 'Practice/10-core-skills'],

    'Advanced/01-environment-setup': ['Advanced/02-ai-tuning-guide', 'Advanced/04-dev-fundamentals'],
    'Advanced/02-ai-tuning-guide': ['Advanced/03-prd-doc-driven', 'Basic/03-technique'],
    'Advanced/03-prd-doc-driven': ['Advanced/04-dev-fundamentals', 'Basic/02-mindset'],
    'Advanced/04-dev-fundamentals': ['Advanced/05-ui-ux', 'Advanced/06-data-persistence-database'],
    'Advanced/05-ui-ux': ['Advanced/06-data-persistence-database', 'Basic/04-practice-0-to-1'],
    'Advanced/06-data-persistence-database': ['Advanced/07-backend-api', 'Advanced/08-auth-security'],
    'Advanced/08-auth-security': ['Advanced/09-testing-automation', 'Advanced/10-localhost-public-access'],
    'Advanced/12-serverless-deploy-cicd': ['Advanced/13-domain-dns', 'Advanced/14-vps-ops-deploy'],
  };

  return relatedSections[currentChapter] || [];
}

/**
 * Generate breadcrumb navigation data
 */
export function generateBreadcrumbData(relativePath: string) {
  const parts = relativePath.replace(/\.md$/, '').split('/');

  const breadcrumb = parts.map((part, index) => {
    const path = parts.slice(0, index + 1).join('/');
    const nameMap: Record<string, string> = {
      'Basic': '基础篇',
      'Advanced': '进阶篇',
      'Practice': '实践篇',
      'Articles': '优质文章',
      'index': '首页'
    };

    return {
      name: nameMap[part] || part.replace(/^\d+[-_]?/, '').replace(/-/g, ' '),
      path: index === parts.length - 1 ? '' : `/${path}/`
    };
  });

  return breadcrumb;
}

/**
 * 自动计算最后更新时间（基于 Git 历史或文件修改时间）
 * 注：这里返回占位符，实际需要 Git 集成
 */
export function getLastUpdatedHint(relativePath: string): string {
  // 可以根据章节推断更新优先级
  if (relativePath.startsWith('Advanced/01-environment-setup/')) {
    return '环境配置频繁更新，建议定期查看';
  }
  if (relativePath.startsWith('Basic/')) {
    return '核心概念稳定，内容定期优化';
  }
  return '内容持续维护中';
}

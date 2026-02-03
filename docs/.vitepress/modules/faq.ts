/**
 * FAQ 结构化数据生成工具
 * 为 FAQ 页面生成 Schema.org FAQPage 标记
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * 生成 FAQPage 结构化数据
 */
export function buildFAQSchema(faqs: FAQItem[], pageUrl: string, siteName: string) {
  const mainEntity = faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  };
}

/**
 * 常见问题预设库
 * 用于快速生成教程相关的 FAQ Schema
 */
export const tutorialFAQs: FAQItem[] = [
  {
    question: '我是零基础，从哪开始学习 Vibe Coding？',
    answer: '推荐先阅读 Basic/00-preface/ 找到你的位置，然后从 Basic/01-awakening/ 开始系统学习。教程从最基础的概念讲起，无需任何编程经验。'
  },
  {
    question: 'Vibe Coding 和传统编程有什么区别？',
    answer: 'Vibe Coding 强调用自然语言与 AI 对话来生成代码，而非手写每一行代码。你扮演"指挥官"角色，AI 负责"编码"，让你专注于想法实现而非语法细节。'
  },
  {
    question: '需要什么工具开始学习？',
    answer: '基础篇只需 AI 工具（ChatGPT、Claude、Cursor 任选其一）和浏览器。进阶篇推荐使用 Cursor 或 Windsurf 作为开发环境，配合 Next.js、TypeScript 等现代技术栈。'
  },
  {
    question: '学习完能做出什么？',
    answer: '基础篇后能独立完成小型 Web 应用并部署上线；进阶篇后能开发包含数据库、用户认证的全栈应用，并掌握从 0 到上线的完整产品交付流程。'
  },
  {
    question: '教程是免费的吗？',
    answer: '是的，Vibe Vibe 是完全开源的免费教程，采用 CC BY-NC-SA 4.0 许可协议。欢迎在学习、教学中使用，也欢迎社区贡献内容。'
  },
  {
    question: '如何参与贡献？',
    answer: '可以通过 GitHub Issues 反馈问题，或提交 Pull Request 完善内容。详见项目 README.md 的"参与贡献"部分。'
  }
];

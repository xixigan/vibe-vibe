---
title: "1.7 创建项目"
description: "从文件夹命名规范到项目模板创建"
chapter: "第一章"
---

# 1.7 创建项目

> **阅读完本节后，你将会收获：**
> - 掌握文件夹命名规范，避免中文路径导致的开发问题
> - 学会使用官方脚手架快速创建标准项目结构
> - 理解 Next.js 项目的目录结构

新手最容易犯的错误是：拿到 AI 生成的代码，逐个文件手动创建。正确的做法是使用项目模板，让 AI 通过脚手架命令帮你创建标准项目。

## 准备工作

### 创建项目文件夹

在创建项目前，先在文件管理器中创建一个**英文路径**的文件夹。

**重要**：完整路径中每一级都不能有中文或空格。

| 错误示例 | 原因 |
|----------|------|
| `C:/Users/张三/projects` | 用户名是中文 |
| `C:/Users/李/my project` | 文件夹名有空格 |

| 正确示例 | 说明 |
|----------|------|
| `C:/Users/YourName/projects` | 全英文，无空格 |
| `/Users/yourname/projects` | macOS 用户目录 |

**建议的文件夹结构**：
```
my-projects/          ← 总文件夹
├── my-first-app/     ← 项目1
├── blog-app/         ← 项目2
└── store-app/        ← 项目3
```

### 在文件夹中打开终端

创建好文件夹后，需要在其中打开终端来执行命令。

| 系统 | 操作 |
|------|------|
| **Windows** | 文件夹空白处右键 → "在终端中打开" |
| **Windows 旧版** | 按住 `Shift + 右键` → "在此处打开 PowerShell 窗口" |
| **Mac** | Finder → 服务 → 新建位于文件夹位置的终端窗口 |
| **IDE** | Cursor/VS Code/Trae：文件 → 打开文件夹，内置终端自动定位 |

### 什么是文件路径

文件路径是文件在文件系统中的位置。告诉 AI "修改 src/app/page.tsx" 时，AI 需要通过路径找到这个文件。

**绝对路径**：从根目录开始的完整路径
```
Windows:  C:\Users\YourName\projects\my-app\package.json
macOS:    /Users/yourname/projects/my-app/package.json
```

**相对路径**：从当前目录开始的路径
```
./package.json        # 当前目录下的 package.json
../other-project      # 上一级目录的 other-project
src/app/page.tsx      # 当前目录下 src/app/page.tsx
```

## 命名规范

开发工具对中文路径支持不佳，容易导致各种离奇报错。

| 正确示例 | 错误示例 |
|----------|----------|
| `my-project` | `我的项目`、`my project` |
| `user-profile` | `user profile`、`用户资料` |
| `app.tsx` | `应用.tsx`、`app 文件.tsx` |

**规则**：
- ✅ 使用小写英文字母
- ✅ 使用连字符 `-` 分隔单词
- ❌ 避免中文字符、空格、特殊字符

::: tip 为什么不能用中文？

**常见报错**：`ENOENT: no such file or directory`、`MODULE_NOT_FOUND`

中文路径可能导致编码问题、路径解析错误、工具兼容性问题。

:::

## 创建项目

现代框架都提供了官方脚手架，一条命令即可创建标准项目。

```bash
# 创建 Next.js 项目（my-app 是项目名，可以改）
pnpm create next-app@latest my-app

# 创建 Vite + React 项目
pnpm create vite@latest my-app -- --template react
```

创建时会询问配置选项：
- **TypeScript**：推荐选择 Yes
- **ESLint**：推荐选择 Yes
- **Tailwind CSS**：根据需要选择
- **src directory**：推荐选择 Yes（代码放 src/ 目录，结构更清晰）
- **App Router**：推荐选择 Yes

::: tip 不想记命令？

如果记不住命令，可以直接复制本教程中的示例命令。但命令很简单，建议记住：

```bash
pnpm create next-app@latest my-app
```

:::

## Next.js 项目结构

创建完成后，你会看到这样的结构：

```
my-next-app/
├── src/
│   ├── app/                 # 页面和 API
│   │   ├── page.tsx         # 首页
│   │   ├── layout.tsx       # 全局布局
│   │   └── api/             # API 接口
│   │
│   ├── components/          # UI 组件
│   └── lib/                 # 工具函数
│
├── public/                  # 静态资源（图片、字体）
├── package.json             # 依赖管理
└── tsconfig.json            # TypeScript 配置
```

**简单理解**：
- `src/app/` - 放页面文件和接口
- `src/components/` - 放可复用的 UI 组件
- `src/lib/` - 放工具函数
- `public/` - 放图片等静态资源

::: tip 代码放哪里？

当 AI 说"创建用户列表页面"时，在 `src/app/` 下创建 `users/page.tsx`。

当 AI 说"创建一个按钮组件"时，在 `src/components/` 下创建 `Button.tsx`。

:::

## 更便捷的方式：使用 /project-init

::: tip 即将推出

本教程提供 `/project-init` skill，可以自动化整个项目初始化流程。

**它能做什么**：

1. **环境检查**：自动检查 Node.js 版本、pnpm 是否安装
2. **智能推荐模板**：根据你的需求（PRD、设计稿、功能想法）推荐合适的技术栈
3. **预设模板**：
   - 推荐配置（纯前端）
   - SaaS 全栈（含数据库、认证、支付）
   - 营销网站/Landing Page
   - 管理后台/Dashboard
   - 轻量 SPA
4. **兼容性检查**：自动处理 React 版本、Tailwind v4、组件库冲突等问题
5. **自动化安装**：非交互式命令，一键创建项目

**使用示例**：

> 使用 /project-init 创建一个需要用户登录和数据库的 SaaS 项目

它会引导你完成环境检查、需求分析、模板选择、依赖安装、环境变量配置等全部流程。

教程正式发布后，会提供安装方法。想了解更多 Skills 内容，详见 [2.3 Skills 系统](../02-ai-tuning-guide/03-mcp-and-skills/)。

:::

## 启动项目

```bash
# 进入项目目录（my-app 改为你创建的项目名）
cd my-app

# 启动开发服务器
pnpm dev
```

打开浏览器访问 `http://localhost:3000`，看到欢迎页面即创建成功。

## 常见问题

### Q: 我应该用哪个模板？

| 项目类型 | 推荐模板 |
|----------|----------|
| 全栈应用 | Next.js |
| 前端 SPA | Vite + React |
| 静态站点 | Astro |

本教程使用 **Next.js + TypeScript + Tailwind CSS**，这是适合 AI 辅助开发的全栈方案。

### Q: 已经用了中文路径怎么办？

在文件资源管理器中操作：
1. 删除 `node_modules` 文件夹
2. 创建新的英文文件夹
3. 把剩余文件复制到新文件夹
4. 在新文件夹中运行 `pnpm install`

### Q: 可以让 AI 逐个创建文件吗？

不推荐。让 AI 逐个创建文件容易遗漏、耗时、可能配置错误。**正确做法**：先用脚手架创建标准项目，再让 AI 在现有结构上修改。

## 核心理念

**使用模板，而不是从零开始**。

| 方式 | 结果 |
|------|------|
| 脚手架创建 | 标准结构、预配置、一键启动 |
| 手动创建 | 容易漏文件、配置错误、浪费时间 |

**创建项目检查清单**：
- [ ] 项目名不含中文和空格
- [ ] 使用官方脚手架
- [ ] 理解各文件夹的用途
- [ ] 项目能正常启动

## 相关内容

- 详见：[1.5 Node.js 环境与包管理](./05-nodejs-and-pnpm.md)
- 详见：[1.8 Localhost 与端口](./08-localhost-and-ports.md)
- 后续：[第2章 AI调教指南](../02-ai-tuning-guide/)

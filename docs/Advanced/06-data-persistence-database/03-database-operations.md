---
title: "6.3 如何操作数据库"
description: "认识 Drizzle、Prisma 等 ORM，理解 AI 生成的 CRUD 代码"
---

# 6.3 如何操作数据库

> **待开发**

---

Drizzle ORM 是本教程推荐的数据库工具。本节学习如何让 AI 生成代码，你负责审查。

**工作流程**

1. 给 AI 下指令，描述需求
2. AI 生成 Schema 代码
3. 你审查：表结构对吗？关联正确吗？
4. AI 执行 CRUD，你检查结果
5. 有问题让 AI 修改

**本土化案例：小红书风格应用**

给 AI 的指令示例：

> "帮我设计一个小红书风格的 Schema，包含：
> - 用户（id, 昵称, 头像）
> - 帖子（id, 用户id, 内容, 图片, 发布时间）
> - 评论（id, 帖子id, 用户id, 内容）
> - 点赞（id, 帖子id, 用户id）
>
> 要求：
> - 一个用户可以有多个帖子
> - 一个帖子可以有多个评论和点赞
> - 用 Drizzle ORM 的 PostgreSQL 语法"

**AI 可能生成的代码：**

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nickname: text('nickname').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
  images: text('images').array(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
})

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id),
})
```

**审查要点：**

- ✅ 主键是否正确设置？
- ✅ 外键关联方向对吗？
- ✅ 是否加了必要的索引？
- ✅ 字段类型合适吗？（text vs varchar, integer vs bigint）
- ✅ 是否需要唯一约束？（比如一个用户只能点赞一次）

**事务操作**

下单时同时扣库存、创建订单、记录日志——要么全成功，要么全失败：

```typescript
await db.transaction(async (tx) => {
  await tx.update(products).set({ stock: sql`${products.stock} - 1` })
  await tx.insert(orders).values({ ... })
  await tx.insert(logs).values({ ... })
})
```

---

::: tip 你审查，AI 执行

不要让 AI 直接操作生产数据库。先在开发环境测试，确认无误再迁移。

:::

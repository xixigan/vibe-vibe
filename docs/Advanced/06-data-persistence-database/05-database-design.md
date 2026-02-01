---
title: "6.4 数据库设计与优化"
description: "AI 交叉论证法、索引优化、安全与备份意识"
---

# 6.4 数据库设计与优化

> **待开发**

---

好的数据库设计能让应用跑得更快、更稳。本节学习如何设计和优化。

**AI 交叉论证法（炼蛊）**

新手很难一眼看出 Schema 设计的好坏。用这个方法：

1. 让 **AI 1 号** 设计表结构
2. 把代码发给 **AI 2 号**，问："作为资深数据库架构师，这个设计合理吗？有什么性能隐患？"
3. 根据反馈让 AI 1 号修改
4. 重复 2-3 轮，得到健壮的设计

**本土化案例：微信读书笔记**

需求：用户可以看书、写笔记、划线、分享

第一轮 AI 设计可能这样：
```typescript
// 简单设计：所有数据放一张表
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  bookName: text('book_name'),  // 书名重复存储
  content: text('content'),
  page: integer('page'),
})
```

AI 2 号审查后指出问题：
- 书名重复存储，浪费空间
- 没有书籍表，无法统计一本书有多少笔记
- 缺少用户和书籍的关联

优化后的设计：
```typescript
export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  isbn: text('isbn').unique(),
})

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  bookId: integer('book_id').references(() => books.id),
  content: text('content'),
  page: integer('page'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

**索引优化**

数据多了查询变慢，加索引加速：

```typescript
// 经常按用户查笔记
export const notes = pgTable('notes', {
  ...
}, (table) => ({
  userIdIdx: index('notes_user_id_idx').on(table.userId),
}))
```

常见需要索引的字段：
- 外键（userId, bookId）
- 经常查询的字段（email, phone）
- 排序字段（createdAt）

注意：索引不是越多越好，写入会变慢。

**数据安全意识**

- **SQL 注入防护**：使用 ORM 的参数化查询，不要拼接 SQL 字符串
- **备份意识**：BaaS 平台自动备份，1Panel 也提供自动备份功能
- **环境分离**：有真实用户后，开发和生产环境要分开

---

::: tip 设计先于优化

先保证设计正确，再考虑优化。过早优化是万恶之源。

:::

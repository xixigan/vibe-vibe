<!--
Automated Page Metadata Component
Displays: difficulty level, reading time, related pages
Automatically applied to all pages with one-time configuration
-->
<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';

// 扩展 PageData 类型
declare module 'vitepress' {
  interface PageData {
    difficulty?: string;
    readingTime?: number;
    relatedPages?: string[];
    updatedHint?: string;
  }
}

const { page, frontmatter } = useData();

// 难度等级映射
const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: '零基础', color: 'green' },
  intermediate: { label: '进阶', color: 'blue' },
  advanced: { label: '高级', color: 'purple' }
};

// 当前难度
const difficulty = computed(() => {
  return page.value.difficulty || 'beginner';
});

// 难度配置
const currentDifficulty = computed(() => {
  return difficultyConfig[difficulty.value as keyof typeof difficultyConfig] || difficultyConfig.beginner;
});

// 阅读时间
const readingTime = computed(() => {
  return page.value.readingTime || 5;
});

// 相关页面
const relatedPages = computed(() => {
  return page.value.relatedPages || [];
});

// 更新提示
const updatedHint = computed(() => {
  return page.value.updatedHint || '';
});
</script>

<template>
  <!-- 难度徽章和阅读时间 -->
  <div class="page-meta" v-if="!frontmatter.index">
    <span class="difficulty-badge" :class="`difficulty-${currentDifficulty.color}`">
      {{ currentDifficulty.label }}
    </span>
    <span class="reading-time">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      预计阅读时间：{{ readingTime }} 分钟
    </span>
  </div>

  <!-- Related content recommendations -->
  <div class="related-pages" v-if="relatedPages.length > 0 && !frontmatter.index">
    <h3>📚 相关阅读</h3>
    <div class="related-list">
      <a v-for="related in relatedPages" :key="related" :href="related" class="related-item">
        {{ related.replace(/.*\//, '').replace(/\.md$/, '').replace(/-/g, ' ') }}
      </a>
    </div>
  </div>

  <!-- 更新提示 -->
  <div class="updated-hint" v-if="updatedHint && !frontmatter.index">
    <small>💡 {{ updatedHint }}</small>
  </div>
</template>

<style scoped>
.page-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  font-size: 0.9rem;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.difficulty-green {
  background: #dcfce7;
  color: #166534;
}

.difficulty-blue {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty-purple {
  background: #f3e8ff;
  color: #6b21a8;
}

.reading-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
}

.related-pages {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border-left: 4px solid var(--vp-c-brand);
}

.related-pages h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-item {
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 6px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.related-item:hover {
  background: var(--vp-c-brand);
  color: white;
  transform: translateX(4px);
}

.updated-hint {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background: #fef3c7;
  border-radius: 8px;
  color: #92400e;
}

.updated-hint small {
  font-size: 0.9rem;
}
</style>

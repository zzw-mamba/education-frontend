<template>
  <div class="max-w-4xl mx-auto">
    <!-- 步骤指示器 -->
    <div class="mb-16 px-4">
      <div class="flex items-center justify-between w-full relative">
        <!-- Step 1: Completed -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold ring-4 ring-white z-10"
          >
            <i class="fa fa-check"></i>
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-green-600"
          >
            选择数据源
          </div>
        </div>

        <!-- Line: Green -->
        <div class="flex-1 h-0.5 bg-green-500 mx-2 rounded"></div>

        <!-- Step 2: Completed -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold ring-4 ring-white z-10"
          >
            <i class="fa fa-check"></i>
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-green-600"
          >
            文档处理
          </div>
        </div>

        <!-- Line: Green -->
        <div class="flex-1 h-0.5 bg-green-500 mx-2 rounded"></div>

        <!-- Step 3: Completed -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold ring-4 ring-white z-10"
          >
            <i class="fa fa-check"></i>
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-green-600"
          >
            选择模板
          </div>
        </div>

        <!-- Line: Green -->
        <div class="flex-1 h-0.5 bg-green-500 mx-2 rounded"></div>

        <!-- Step 4: Completed -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold ring-4 ring-white z-10"
          >
            <i class="fa fa-check"></i>
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-green-600"
          >
            生成摘要
          </div>
        </div>

        <!-- Line: Green -->
        <div class="flex-1 h-0.5 bg-green-500 mx-2 rounded"></div>

        <!-- Step 5: Active -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white z-10 transition-transform group-hover:scale-105"
          >
            5
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-sm font-bold text-primary-700"
          >
            查看结果
          </div>
        </div>
      </div>
    </div>

    <!-- 页面标题 -->
    <h1 class="text-3xl font-bold mb-2">{{ summary.title }}</h1>
    <p class="text-secondary-500 mb-8">
      生成时间: {{ formatDate(summary.date) }} | 来源: {{ sourceCount }}个{{
        dataSourceType === "knowledgeBase" ? "知识库文档" : "OCR识别文档"
      }}
    </p>

    <!-- 摘要内容 -->
    <div class="card mb-8">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-secondary-800">摘要内容</h3>
        <span class="text-xs text-secondary-400">Markdown 渲染</span>
      </div>
      <div
        v-if="renderedSummaryHtml"
        class="markdown-content"
        v-html="renderedSummaryHtml"
      ></div>
      <p v-else class="text-secondary-400">暂无摘要内容</p>
    </div>

    <!-- 引用来源 -->
    <div v-if="citations.length > 0" class="card mb-8">
      <h3 class="text-lg font-semibold text-secondary-800 mb-4">
        <i class="fa fa-book mr-2 text-primary-500"></i>引用来源
      </h3>
      <ol class="space-y-3 list-none">
        <li
          v-for="item in citations"
          :key="item.key"
          class="flex gap-3 text-sm"
        >
          <span
            class="shrink-0 w-8 h-6 flex items-center justify-center rounded bg-primary-50 text-primary-600 font-mono font-semibold text-xs border border-primary-100"
          >
            {{ item.key }}
          </span>
          <div class="text-secondary-700 leading-relaxed">
            <span v-if="item.title" class="font-medium text-secondary-900">{{
              item.title
            }}</span>
            <span v-if="item.authors" class="text-secondary-500">
              — {{ item.authors }}</span
            >
            <span v-if="item.year" class="text-secondary-400">
              ({{ item.year }})</span
            >
            <span v-if="!item.title" class="text-secondary-500">{{
              item.raw
            }}</span>
          </div>
        </li>
      </ol>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button @click="exportToPdf" class="btn-secondary">
        <i class="fa fa-file-pdf-o mr-2"></i> 导出PDF
      </button>
      <button @click="exportToWord" class="btn-secondary">
        <i class="fa fa-file-word-o mr-2"></i> 导出Word
      </button>
      <button @click="regenerateSummary" class="btn-primary">
        <i class="fa fa-refresh mr-2"></i> 重新生成
      </button>
      <router-link to="/" class="btn-secondary">
        <i class="fa fa-home mr-2"></i> 返回首页
      </router-link>
    </div>

    <!-- 重新生成选项 -->
    <div v-if="showRegenerateForm" class="card">
      <h3 class="text-xl font-semibold mb-4">优化摘要</h3>
      <p class="text-secondary-600 mb-4">
        请输入您的优化要求，系统将根据您的反馈重新生成摘要。
      </p>
      <textarea
        v-model="optimizationPrompt"
        class="textarea-field h-24 mb-4"
        placeholder="例如：请增加更多技术细节，或调整摘要的结构..."
      ></textarea>
      <div class="flex justify-end">
        <button @click="cancelRegenerate" class="btn-secondary mr-4">
          取消
        </button>
        <button @click="submitRegeneration" class="btn-primary">
          提交优化
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import { marked } from "marked";
import hljs from "highlight.js";

const router = useRouter();
const store = useAppStore();

// 摘要内容
const summary = ref(store.generatedSummary);

// 数据源类型
const dataSourceType = ref(store.dataSourceType);

// 来源数量
const sourceCount = computed(() => {
  return dataSourceType.value === "knowledgeBase"
    ? store.selectedDocuments.length
    : store.ocrResults.length;
});

const escapeHtml = (unsafe) => {
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const sanitizeHtml = (dirtyHtml) => {
  if (!dirtyHtml) return "";

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(dirtyHtml, "text/html");

  documentNode
    .querySelectorAll("script, style, iframe, object, embed, form")
    .forEach((node) => node.remove());

  documentNode.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on")) {
        node.removeAttribute(attribute.name);
      }
      if (
        (name === "href" || name === "src") &&
        value.startsWith("javascript:")
      ) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return documentNode.body.innerHTML;
};

const renderer = new marked.Renderer();
renderer.link = ({ href, title, tokens }) => {
  const text = marked.parser(tokens || []);
  const safeHref = href ? String(href) : "#";
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  return `<a href="${escapeHtml(
    safeHref
  )}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
};

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

const renderedSummaryHtml = computed(() => {
  const content = summary.value?.content;
  if (!content) return "";
  const markdownHtml = marked.parse(content);
  return sanitizeHtml(markdownHtml);
});

// 引用列表：将对象 { "[1]": {...}, "[2]": {...} } 转为有序数组
const citations = computed(() => {
  const raw = summary.value?.citations;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  return Object.entries(raw).map(([key, val]) => {
    if (typeof val === "string")
      return { key, raw: val, title: null, authors: null, year: null };
    return {
      key,
      title: val.title || val.name || null,
      authors: val.authors || val.author || null,
      year: val.year || val.published_year || null,
      raw: null,
    };
  });
});

// 重新生成表单显示状态
const showRegenerateForm = ref(false);

// 优化提示词
const optimizationPrompt = ref("");

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 导出PDF
const exportToPdf = () => {
  store.exportToPdf();
};

// 导出Word
const exportToWord = () => {
  store.exportToWord();
};

// 重新生成
const regenerateSummary = () => {
  showRegenerateForm.value = true;
};

// 取消重新生成
const cancelRegenerate = () => {
  showRegenerateForm.value = false;
  optimizationPrompt.value = "";
};

// 提交重新生成
const submitRegeneration = () => {
  if (optimizationPrompt.value.trim()) {
    store.regenerateSummary(optimizationPrompt.value);
    summary.value = store.generatedSummary;
    showRegenerateForm.value = false;
    optimizationPrompt.value = "";
  }
};
</script>

<style scoped>
:deep(.markdown-content) {
  color: #334155;
  line-height: 1.8;
  font-size: 15px;
}

:deep(.markdown-content h1),
:deep(.markdown-content h2),
:deep(.markdown-content h3),
:deep(.markdown-content h4) {
  color: #0f172a;
  font-weight: 700;
  line-height: 1.35;
  margin: 1.2em 0 0.6em;
}

:deep(.markdown-content h1) {
  font-size: 1.6rem;
}

:deep(.markdown-content h2) {
  font-size: 1.35rem;
}

:deep(.markdown-content h3) {
  font-size: 1.15rem;
}

:deep(.markdown-content p) {
  margin: 0.8em 0;
}

:deep(.markdown-content a) {
  color: #0f766e;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 0.8em 0;
  padding-left: 1.4em;
}

:deep(.markdown-content li) {
  margin: 0.35em 0;
}

:deep(.markdown-content blockquote) {
  margin: 1em 0;
  padding: 0.7em 1em;
  border-left: 4px solid #14b8a6;
  background: #f0fdfa;
  border-radius: 0.35rem;
  color: #0f766e;
}

:deep(.markdown-content pre) {
  margin: 1em 0;
  padding: 0.85em 1em;
  border-radius: 0.75rem;
  background: #0f172a;
  color: #e2e8f0;
  overflow-x: auto;
}

:deep(.markdown-content code) {
  font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
  font-size: 0.92em;
}

:deep(.markdown-content :not(pre) > code) {
  padding: 0.15em 0.4em;
  border-radius: 0.35rem;
  background: #f1f5f9;
  color: #be123c;
}

:deep(.markdown-content table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.95em;
}

:deep(.markdown-content th),
:deep(.markdown-content td) {
  border: 1px solid #e2e8f0;
  padding: 0.55em 0.7em;
  text-align: left;
  vertical-align: top;
}

:deep(.markdown-content th) {
  background: #f8fafc;
  font-weight: 700;
}

:deep(.markdown-content hr) {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 1.25em 0;
}
</style>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- 步骤指示器 -->
    <div class="mb-12">
      <div class="flex justify-between items-center">
        <div class="progress-step completed">
          <div class="progress-step-number">1</div>
          <span class="ml-2 text-sm text-secondary-600">选择数据源</span>
        </div>
        <div class="progress-step-line bg-green-500"></div>
        <div class="progress-step completed">
          <div class="progress-step-number">2</div>
          <span class="ml-2 text-sm text-secondary-600">文档处理</span>
        </div>
        <div class="progress-step-line bg-green-500"></div>
        <div class="progress-step completed">
          <div class="progress-step-number">3</div>
          <span class="ml-2 text-sm text-secondary-600">选择模板</span>
        </div>
        <div class="progress-step-line bg-green-500"></div>
        <div class="progress-step completed">
          <div class="progress-step-number">4</div>
          <span class="ml-2 text-sm text-secondary-600">生成摘要</span>
        </div>
        <div class="progress-step-line bg-green-500"></div>
        <div class="progress-step active">
          <div class="progress-step-number">5</div>
          <span class="ml-2 text-sm text-secondary-600">查看结果</span>
        </div>
      </div>
    </div>

    <!-- 页面标题 -->
    <h1 class="text-3xl font-bold mb-2">{{ summary.title }}</h1>
    <p class="text-secondary-500 mb-8">
      生成时间: {{ formatDate(summary.date) }} | 来源: {{ sourceCount }}个{{ dataSourceType === 'knowledgeBase' ? '知识库文档' : 'OCR识别文档' }}
    </p>

    <!-- 摘要内容 -->
    <div class="card mb-8">
      <div class="prose max-w-none">
        <p v-for="(paragraph, index) in summary.content.split('\n\n')" :key="index" class="mb-4">
          {{ paragraph }}
        </p>
      </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store'

const router = useRouter()
const store = useAppStore()

// 摘要内容
const summary = ref(store.generatedSummary)

// 数据源类型
const dataSourceType = ref(store.dataSourceType)

// 来源数量
const sourceCount = computed(() => {
  return dataSourceType.value === 'knowledgeBase' 
    ? store.selectedDocuments.length 
    : store.ocrResults.length
})

// 重新生成表单显示状态
const showRegenerateForm = ref(false)

// 优化提示词
const optimizationPrompt = ref('')

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 导出PDF
const exportToPdf = () => {
  store.exportToPdf()
}

// 导出Word
const exportToWord = () => {
  store.exportToWord()
}

// 重新生成
const regenerateSummary = () => {
  showRegenerateForm.value = true
}

// 取消重新生成
const cancelRegenerate = () => {
  showRegenerateForm.value = false
  optimizationPrompt.value = ''
}

// 提交重新生成
const submitRegeneration = () => {
  if (optimizationPrompt.value.trim()) {
    store.regenerateSummary(optimizationPrompt.value)
    summary.value = store.generatedSummary
    showRegenerateForm.value = false
    optimizationPrompt.value = ''
  }
}
</script>

<style scoped>
/* 可以在这里添加结果查看页面特定的样式 */
.prose p {
  @apply text-secondary-700;
}
</style>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- 步骤指示器 -->
    <div class="mb-12">
      <div class="flex justify-between items-center">
        <div class="progress-step completed">
          <div class="progress-step-number">1</div>
          <span class="ml-2 text-sm text-secondary-600">选择数据源</span>
        </div>
        <div class="progress-step-line bg-green-500"></div>
        <div class="progress-step active">
          <div class="progress-step-number">2</div>
          <span class="ml-2 text-sm text-secondary-600">文档处理</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">3</div>
          <span class="ml-2 text-sm text-secondary-600">选择模板</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">4</div>
          <span class="ml-2 text-sm text-secondary-600">生成摘要</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">5</div>
          <span class="ml-2 text-sm text-secondary-600">查看结果</span>
        </div>
      </div>
    </div>

    <!-- 页面标题 -->
    <h1 class="text-3xl font-bold mb-6">知识库文档筛选</h1>
    <p class="text-secondary-600 mb-8">
      基于您输入的关键词「{{
        searchKeywords
      }}」，我们找到了以下相关文档。请选择您需要的文档，系统将为您提供关联推荐。
    </p>

    <!-- 搜索框 -->
    <div class="mb-8">
      <div class="flex">
        <input
          type="text"
          v-model="searchKeywords"
          class="input-field flex-1"
          placeholder="请输入关键词，多个关键词用空格分隔"
        />
        <button
          @click="searchDocuments"
          class="btn-primary ml-4 whitespace-nowrap"
        >
          <i class="fa fa-search mr-2"></i> 搜索
        </button>
      </div>
    </div>

    <!-- 已选文档 -->
    <div v-if="selectedDocuments.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold mb-4">
        已选文档 ({{ selectedDocuments.length }})
      </h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="doc in selectedDocuments"
          :key="doc.id"
          class="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 flex items-center"
        >
          <span class="text-primary-800 text-sm mr-3">{{ doc.title }}</span>
          <button
            @click="deselectDocument(doc.id)"
            class="text-primary-600 hover:text-primary-800"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      <!-- 初轮搜索结果 -->
      <div>
        <h3 class="text-xl font-semibold mb-4">
          初轮搜索结果 ({{ initialDocuments.length }})
        </h3>
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
          ></div>
        </div>
        <div
          v-else-if="initialDocuments.length === 0"
          class="text-center py-12"
        >
          <i class="fa fa-search text-4xl text-secondary-300 mb-4"></i>
          <p class="text-secondary-500">未找到相关文档，请尝试调整关键词</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="doc in initialDocuments"
            :key="doc.id"
            class="card hover:border-primary-300 hover:border cursor-pointer"
            @click="selectDocument(doc)"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-secondary-900">{{ doc.title }}</h4>
              <span class="badge badge-primary"
                >{{ doc.matchScore }}% 匹配</span
              >
            </div>
            <p class="text-secondary-600 text-sm mb-3 line-clamp-2">
              {{ doc.summary }}
            </p>
            <div
              class="flex justify-between items-center text-xs text-secondary-500"
            >
              <span
                ><i class="fa fa-file-text-o mr-1"></i> {{ doc.source }}</span
              >
              <span><i class="fa fa-calendar-o mr-1"></i> {{ doc.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 关联推荐 -->
      <div>
        <h3 class="text-xl font-semibold mb-4">
          关联推荐 ({{ recommendedDocuments.length }})
        </h3>
        <div v-if="recommendedDocuments.length === 0" class="text-center py-12">
          <i class="fa fa-lightbulb-o text-4xl text-secondary-300 mb-4"></i>
          <p class="text-secondary-500">请从左侧选择文档以获取关联推荐</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="doc in recommendedDocuments"
            :key="doc.id"
            class="card hover:border-primary-300 hover:border cursor-pointer"
            @click="selectDocument(doc)"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-secondary-900">{{ doc.title }}</h4>
              <span class="badge badge-primary"
                >{{ doc.matchScore }}% 匹配</span
              >
            </div>
            <p class="text-secondary-600 text-sm mb-3 line-clamp-2">
              {{ doc.summary }}
            </p>
            <div
              class="flex justify-between items-center text-xs text-secondary-500"
            >
              <span
                ><i class="fa fa-file-text-o mr-1"></i> {{ doc.source }}</span
              >
              <span><i class="fa fa-calendar-o mr-1"></i> {{ doc.date }}</span>
            </div>
            <div
              class="mt-3 text-xs text-green-600 bg-green-50 rounded-full px-2 py-1 inline-block"
            >
              <i class="fa fa-link mr-1"></i> {{ doc.reason }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between">
      <router-link to="/data-source" class="btn-secondary">
        <i class="fa fa-arrow-left mr-2"></i> 上一步
      </router-link>
      <button
        @click="nextStep"
        class="btn-primary"
        :disabled="selectedDocuments.length === 0"
      >
        下一步 <i class="fa fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";

const router = useRouter();
const store = useAppStore();

// 搜索关键词（本地可编辑）
const searchKeywords = ref(store.searchKeywords);

// 使用 computed 直接绑定 store，确保响应式更新
const initialDocuments = computed(() => store.initialDocuments);
const selectedDocuments = computed(() => store.selectedDocuments);
const recommendedDocuments = computed(() => store.recommendedDocuments);
const isLoading = computed(() => store.isLoading);

// 搜索文档（触发 store 中的异步检索）
const searchDocuments = () => {
  if (searchKeywords.value.trim()) {
    store.searchKeywords = searchKeywords.value;
    store.searchDocuments(searchKeywords.value);
  }
};

// 选择文档（直接调用 store，computed 会反映变化）
const selectDocument = (document) => {
  store.selectDocument(document);
};

// 取消选择文档
const deselectDocument = (documentId) => {
  store.deselectDocument(documentId);
};

// 下一步
const nextStep = () => {
  if (selectedDocuments.value.length > 0) {
    router.push("/template-select");
    store.nextStep();
  }
};
</script>

<style scoped>
/* 可以在这里添加知识库页面特定的样式 */
</style>

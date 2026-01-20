<template>
  <div class="max-w-6xl mx-auto">
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

        <!-- Step 2: Active -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white z-10 transition-transform group-hover:scale-105"
          >
            2
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-sm font-bold text-primary-700"
          >
            文档处理
          </div>
        </div>

        <!-- Line: Gray -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 3: Inactive -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-medium ring-4 ring-white z-10"
          >
            3
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-gray-400"
          >
            选择模板
          </div>
        </div>

        <!-- Line: Gray -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 4: Inactive -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-medium ring-4 ring-white z-10"
          >
            4
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-gray-400"
          >
            生成摘要
          </div>
        </div>

        <!-- Line: Gray -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 5: Inactive -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-medium ring-4 ring-white z-10"
          >
            5
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-gray-400"
          >
            查看结果
          </div>
        </div>
      </div>
    </div>

    <!-- 页面标题 -->
    <h1 class="text-3xl font-bold mb-6">知识库文档筛选</h1>

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
            class="bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer group relative overflow-hidden"
            :class="
              isSelected(doc.id)
                ? 'border-primary-500 shadow-md ring-1 ring-primary-500 bg-primary-50/10'
                : 'border-gray-200/50 hover:shadow-md hover:border-primary-200'
            "
            @click="handlePreview(doc)"
          >
            <!-- 复选框 -->
            <div class="absolute top-0 right-0 p-0 z-10" @click.stop>
              <label class="cursor-pointer p-4 block">
                <input
                  type="checkbox"
                  class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 transition-colors"
                  :checked="isSelected(doc.id)"
                  @change="toggleSelection(doc)"
                />
              </label>
            </div>

            <!-- 标题 -->
            <div class="flex items-start mb-2 pr-8">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 text-gray-500 font-bold text-sm group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"
                :class="isSelected(doc.id) ? '!bg-primary-500 !text-white' : ''"
              >
                S
              </div>
              <h4
                class="font-semibold text-secondary-900 line-clamp-2"
                :class="isSelected(doc.id) ? 'text-primary-700' : ''"
              >
                {{ doc.title }}
              </h4>
            </div>

            <!-- 元数据 -->
            <div class="flex flex-wrap gap-2 mb-3 pl-11">
              <span
                v-if="doc.category"
                class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
              >
                {{ doc.category }}
              </span>
              <span
                v-if="doc.authors"
                class="text-xs text-secondary-500 flex items-center"
              >
                <i class="fa fa-user-circle-o mr-1"></i> {{ doc.authors }}
              </span>
            </div>

            <!-- 底部信息 -->
            <div
              class="flex items-center justify-between text-xs text-secondary-500 border-t border-gray-100 pt-3 mt-2 pl-11"
            >
              <span v-if="doc.year" class="flex items-center">
                <i class="fa fa-clock-o mr-1"></i> {{ doc.year }}
              </span>
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
          <p class="text-secondary-500">暂无关联推荐文档</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="doc in recommendedDocuments"
            :key="doc.id"
            class="bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer group relative overflow-hidden"
            :class="
              isSelected(doc.id)
                ? 'border-primary-500 shadow-md ring-1 ring-primary-500 bg-primary-50/10'
                : 'border-gray-200/50 hover:shadow-md hover:border-primary-200'
            "
            @click="handlePreview(doc)"
          >
            <div class="absolute top-0 right-0 p-0 z-10" @click.stop>
              <label class="cursor-pointer p-4 block">
                <input
                  type="checkbox"
                  class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 transition-colors"
                  :checked="isSelected(doc.id)"
                  @change="toggleSelection(doc)"
                />
              </label>
            </div>

            <div class="flex justify-between items-start mb-2 pr-8">
              <h4
                class="font-semibold text-secondary-900 line-clamp-2"
                :class="isSelected(doc.id) ? 'text-primary-700' : ''"
              >
                {{ doc.title }}
              </h4>
            </div>

            <div
              class="flex flex-wrap items-center text-xs text-secondary-500 gap-3 mb-2"
            >
              <span v-if="doc.authors"
                ><i class="fa fa-user-circle-o mr-1"></i>
                {{ doc.authors }}</span
              >
              <span
                v-if="doc.common_tags"
                class="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full"
              >
                <i class="fa fa-tags mr-1"></i> {{ doc.common_tags }} 个共同标签
              </span>
            </div>

            <div class="flex items-center gap-2 mt-2">
              <span
                class="text-xs text-primary-600 bg-primary-50 rounded px-2 py-1"
                >推荐文档</span
              >
              <span v-if="doc.year" class="text-xs text-gray-500"
                ><i class="fa fa-clock-o mr-1"></i> {{ doc.year }}</span
              >
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
        :disabled="selectedDocuments.length === 0 || isLoading"
      >
        <span v-if="isLoading && selectedDocuments.length > 0">
          <i class="fa fa-spinner fa-spin mr-2"></i> 处理中...
        </span>
        <span v-else> 下一步 <i class="fa fa-arrow-right ml-2"></i> </span>
      </button>
    </div>

    <!-- 预览模态框 -->
    <Teleport to="body">
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
        >
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-lg font-semibold truncate">
              {{ previewPdfTitle }}
            </h3>
            <button
              @click="closePreview"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fa fa-times text-xl"></i>
            </button>
          </div>
          <div class="flex-1 overflow-auto p-4 bg-gray-100 relative">
            <div
              v-if="isPreviewLoading"
              class="absolute inset-0 flex items-center justify-center z-10"
            >
              <i class="fa fa-spinner fa-spin text-4xl text-primary-500"></i>
            </div>
            <!-- 只有当 previewPdfUrl 确实存在时才渲染组件，避免 undefined 错误 -->
            <vue-pdf-embed
              v-if="previewPdfUrl"
              :source="previewPdfUrl"
              class="shadow-lg mx-auto"
            />
            <div
              v-if="!isPreviewLoading && !previewPdfUrl"
              class="text-center mt-10 text-gray-500"
            >
              正在加载预览内容...
            </div>
          </div>
          <div class="p-4 border-t flex justify-end gap-2">
            <button @click="closePreview" class="btn-secondary">关闭</button>
            <button @click="selectFromPreview" class="btn-primary">
              选择此文档
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import VuePdfEmbed from "vue-pdf-embed";
import { getKnowledgeFile, getRecommendationsMultiple } from "../services/api";

const router = useRouter();
const store = useAppStore();

// 搜索关键词（本地可编辑）
const searchKeywords = ref(store.searchKeywords);

// 使用 computed 直接绑定 store，确保响应式更新
const initialDocuments = computed(() => store.initialDocuments);
const selectedDocuments = computed(() => store.selectedDocuments);
const recommendedDocuments = computed(() => store.recommendedDocuments);
const isLoading = computed(() => store.isLoading);

// 页面加载时获取推荐
onMounted(async () => {
  // 如果有 initialDocuments (从上一页选择的)，但没有 searchKeywords/selectedDocs 触发的推荐，则主动获取
  // 这里的逻辑是：如果用户从 step 1 选了文档过来，我们根据这些文档推荐
  // store.selectedDocuments 是用户在本页选择的，用于下一步
  // store.initialDocuments 是用户在上一页选择的

  if (store.initialDocuments && store.initialDocuments.length > 0) {
    // 默认选中初轮搜索结果
    store.initialDocuments.forEach((doc) => {
      if (!store.selectedDocuments.some((d) => d.id === doc.id)) {
        store.selectedDocuments.push(doc);
      }
    });

    const docIds = store.initialDocuments.map((doc) => doc.id);
    try {
      store.isLoading = true;
      const recommendations = await getRecommendationsMultiple(docIds);
      store.recommendedDocuments = recommendations || [];
    } catch (e) {
      console.error("Failed to fetch recommendations", e);
      store.recommendedDocuments = [];
    } finally {
      store.isLoading = false;
    }
  }
});

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

// 检查是否已选中
const isSelected = (docId) => {
  return selectedDocuments.value.some((doc) => doc.id === docId);
};

// 切换选择状态
const toggleSelection = (doc) => {
  if (isSelected(doc.id)) {
    store.deselectDocument(doc.id);
  } else {
    store.selectDocument(doc);
  }
};

// 预览相关状态
const showPreviewModal = ref(false);
const previewPdfUrl = ref(null);
const previewPdfTitle = ref("");
const isPreviewLoading = ref(false);
const currentPreviewDoc = ref(null);

// 处理预览
const handlePreview = async (doc) => {
  console.log("handlePreview triggered for:", doc); // DEBUG Log
  currentPreviewDoc.value = doc;
  previewPdfTitle.value = doc.title;
  showPreviewModal.value = true;
  console.log("showPreviewModal set to:", showPreviewModal.value); // DEBUG Log
  isPreviewLoading.value = true;
  if (previewPdfUrl.value) {
    URL.revokeObjectURL(previewPdfUrl.value);
    previewPdfUrl.value = null;
  }

  try {
    console.log("Fetching file with ID:", doc.id); // DEBUG Log
    // 假设 API 返回 Blob
    const blob = await getKnowledgeFile(doc.id);
    console.log("File fetched via API, blob size:", blob.size); // DEBUG Log
    previewPdfUrl.value = URL.createObjectURL(blob);
    console.log("Preview URL created:", previewPdfUrl.value); // DEBUG Log
  } catch (error) {
    console.error("Failed to load file preview", error);
    // 如果是 404 或其他错误，可以提示用户
    window.alert("预览加载失败：请检查后端服务或文件是否存在。");
  } finally {
    isPreviewLoading.value = false;
  }
};

// 关闭预览
const closePreview = () => {
  showPreviewModal.value = false;
  // 延迟清理 URL，避免闪烁
  setTimeout(() => {
    if (previewPdfUrl.value) {
      URL.revokeObjectURL(previewPdfUrl.value);
      previewPdfUrl.value = null;
    }
  }, 100);
};

// 从预览中选择
const selectFromPreview = () => {
  if (currentPreviewDoc.value) {
    if (!isSelected(currentPreviewDoc.value.id)) {
      store.selectDocument(currentPreviewDoc.value);
    }
    closePreview();
  }
};

// 取消选择文档
const deselectDocument = (documentId) => {
  store.deselectDocument(documentId);
};

// 下一步
const nextStep = async () => {
  if (selectedDocuments.value.length > 0) {
    try {
      await store.parseSelectedDocuments();
      router.push("/template-select");
      store.nextStep();
    } catch (error) {
      console.error("Parsing failed", error);
      // Stay on page to show error
    }
  }
};
</script>

<style scoped>
/* 可以在这里添加知识库页面特定的样式 */
</style>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- 步骤指示器 -->
    <div class="mb-16 px-4">
      <div class="flex items-center justify-between w-full relative">
        <!-- Step 1: Active -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white z-10 transition-transform group-hover:scale-105"
          >
            1
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-sm font-bold text-primary-700"
          >
            选择数据源
          </div>
        </div>

        <!-- Line -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 2 -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-medium ring-4 ring-white z-10"
          >
            2
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-xs font-medium text-gray-400"
          >
            文档处理
          </div>
        </div>

        <!-- Line -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 3 -->
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

        <!-- Line -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 4 -->
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

        <!-- Line -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 5 -->
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
    <div class="text-center mb-10">
      <h1
        class="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500"
      >
        选择数据源
      </h1>
      <p class="text-secondary-500 text-lg max-w-2xl mx-auto">
        请选择您要生成摘要的数据源，可以从知识库检索相关文档，或上传本地文档进行OCR识别
      </p>
    </div>

    <!-- 数据源选项卡 -->
    <div
      class="card p-0 overflow-hidden mb-12 border-0 shadow-xl shadow-gray-200/50"
    >
      <div class="flex bg-gray-50/80 p-2 gap-2 border-b border-gray-100">
        <button
          @click="selectDataSource('knowledgeBase')"
          class="flex-1 py-4 px-6 text-center font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
          :class="
            dataSourceType === 'knowledgeBase'
              ? 'bg-white text-primary-600 shadow-md transform scale-[1.02]'
              : 'text-secondary-500 hover:bg-white/50 hover:text-secondary-700'
          "
        >
          <i class="fa fa-database text-xl"></i> 知识库文档
        </button>
        <button
          @click="selectDataSource('ocr')"
          class="flex-1 py-4 px-6 text-center font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
          :class="
            dataSourceType === 'ocr'
              ? 'bg-white text-primary-600 shadow-md transform scale-[1.02]'
              : 'text-secondary-500 hover:bg-white/50 hover:text-secondary-700'
          "
        >
          <i class="fa fa-upload text-xl"></i> 本地文档上传
        </button>
      </div>

      <!-- 选项卡内容 -->
      <div class="p-8 md:p-10">
        <!-- 知识库文档选项 -->
        <div v-if="dataSourceType === 'knowledgeBase'" class="animate-fade-in">
          <div class="mb-8">
            <label
              for="keywords"
              class="block text-sm font-bold text-secondary-700 mb-3"
            >
              输入关键词
            </label>
            <div class="flex gap-4">
              <div class="relative flex-1">
                <i
                  class="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
                ></i>
                <input
                  type="text"
                  id="keywords"
                  v-model="searchKeywords"
                  class="input-field pl-12"
                  placeholder="请输入关键词，多个关键词用空格分隔"
                />
              </div>
              <button
                @click="searchDocuments"
                class="btn-primary min-w-[120px]"
              >
                搜索
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="text-sm text-secondary-500 mr-2 py-1">热门搜索：</span>
            <button
              class="badge badge-primary cursor-pointer hover:bg-primary-200 transition-colors"
              @click="
                searchKeywords = '人工智能';
                searchDocuments();
              "
            >
              人工智能
            </button>
            <button
              class="badge badge-primary cursor-pointer hover:bg-primary-200 transition-colors"
              @click="
                searchKeywords = '机器学习';
                searchDocuments();
              "
            >
              机器学习
            </button>
          </div>

          <!-- 搜索结果显示 -->
          <div
            v-if="isSearching"
            class="mb-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-center justify-center gap-3"
          >
            <i class="fa fa-spinner fa-spin text-primary-500 text-xl"></i>
            <span class="text-secondary-600">正在搜索中...</span>
          </div>

          <div
            v-else-if="searchError && !isSearching"
            class="mb-8 bg-red-50/50 border border-red-100 rounded-2xl p-6 flex items-start gap-4"
          >
            <div
              class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"
            >
              <i class="fa fa-exclamation-circle text-red-600"></i>
            </div>
            <div>
              <h4 class="font-bold text-red-800 mb-2">搜索失败</h4>
              <p class="text-sm text-red-700/80">{{ searchError }}</p>
            </div>
          </div>

          <div
            v-if="
              store.initialDocuments &&
              store.initialDocuments.length > 0 &&
              !searchError &&
              !isSearching
            "
            class="mb-6 bg-green-50/70 border border-green-100 rounded-2xl p-4 flex items-center justify-between animate-fade-in shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
              >
                <i class="fa fa-check"></i>
              </div>
              <span class="text-green-800 font-medium"
                >已选择
                <span class="font-bold">{{
                  store.initialDocuments.length
                }}</span>
                个文档</span
              >
            </div>
            <button
              @click="store.initialDocuments = []"
              class="text-xs text-green-600 hover:text-green-800 underline"
            >
              清空选择
            </button>
          </div>

          <div
            v-if="searchResults.length > 0 && !searchError && !isSearching"
            class="mb-8"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-secondary-800">搜索结果</h3>
              <span
                class="text-sm text-secondary-500 bg-gray-100/80 px-3 py-1 rounded-full"
              >
                找到 {{ searchResults.length }} 条结果
              </span>
            </div>
            <div
              class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
            >
              <div
                v-for="(doc, index) in searchResults"
                :key="doc.id"
                class="bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                :class="
                  isDocumentSelected(doc.id)
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
                      :checked="isDocumentSelected(doc.id)"
                      @change="toggleSelection(doc)"
                    />
                  </label>
                </div>

                <div class="flex items-start gap-4">
                  <div
                    class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    :class="
                      isDocumentSelected(doc.id)
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                    "
                  >
                    <span class="text-sm font-bold">{{ index + 1 }}</span>
                  </div>
                  <div class="flex-1 min-w-0 pr-8">
                    <h4
                      class="font-bold text-base mb-2 truncate transition-colors"
                      :class="
                        isDocumentSelected(doc.id)
                          ? 'text-primary-700'
                          : 'text-secondary-900 group-hover:text-primary-600'
                      "
                    >
                      {{ doc.title }}
                    </h4>
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span
                        v-if="doc.category"
                        class="px-2 py-0.5 rounded text-xs font-medium"
                        :class="
                          isDocumentSelected(doc.id)
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                        "
                      >
                        {{ doc.category }}
                      </span>
                      <span
                        v-if="doc.authors"
                        class="text-xs text-secondary-500 flex items-center"
                      >
                        <i class="fa fa-user-circle-o mr-1 text-gray-400"></i>
                        {{ doc.authors }}
                      </span>
                    </div>
                    <div
                      class="flex items-center justify-between text-xs text-secondary-500 border-t border-gray-100 pt-3 mt-1"
                    >
                      <span class="flex items-center"
                        ><i class="fa fa-clock-o mr-1 text-gray-400"></i>
                        {{ doc.year }}</span
                      >
                      <div class="flex items-center gap-1" v-if="doc.score">
                        <div
                          class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"
                        >
                          <div
                            class="h-full bg-green-500 rounded-full"
                            :style="{ width: doc.score + '%' }"
                          ></div>
                        </div>
                        <span class="font-semibold text-green-600 ml-1"
                          >{{ doc.score }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!searchError && !isSearching && searchResults.length <= 0"
            class="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4"
          >
            <div
              class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0"
            >
              <i class="fa fa-info text-blue-600"></i>
            </div>
            <div>
              <h4 class="font-bold text-blue-800 mb-2">知识库文档检索</h4>
              <p class="text-sm text-blue-700/80 leading-relaxed">
                系统将根据您输入的关键词从知识库中检索相关文档，并提供初轮搜索结果和关联推荐，帮助您快速找到所需内容。
              </p>
            </div>
          </div>
        </div>

        <!-- 本地文档上传选项 -->
        <div v-if="dataSourceType === 'ocr'" class="animate-fade-in">
          <div
            class="border-3 border-dashed border-gray-200 rounded-2xl p-12 text-center mb-8 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-300 group"
          >
            <div
              class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-100 transition-colors"
            >
              <i
                class="fa fa-cloud-upload text-4xl text-secondary-400 group-hover:text-primary-500 transition-colors"
              ></i>
            </div>
            <h3 class="text-xl font-bold text-secondary-800 mb-2">
              点击或拖拽文件上传
            </h3>
            <p class="text-secondary-500 mb-8">
              支持 PDF, JPG, JPEG, PNG (最大 20MB)
            </p>
            <label class="btn-primary cursor-pointer inline-flex items-center">
              <i class="fa fa-folder-open mr-2"></i> 选择文件
              <input
                type="file"
                class="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileUpload"
              />
            </label>
          </div>

          <!-- 已上传文件列表 -->
          <div
            v-if="store.uploadedFiles && store.uploadedFiles.length"
            class="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-100"
          >
            <h4
              class="text-sm font-bold text-secondary-700 mb-4 flex items-center justify-between"
            >
              已上传的文件
              <span class="text-xs font-normal text-secondary-500"
                >{{ store.uploadedFiles.length }} 个文件</span
              >
            </h4>
            <ul class="space-y-3">
              <li
                v-for="file in store.uploadedFiles"
                :key="file.name"
                class="flex items-center justify-between bg-white border border-gray-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"
                  >
                    <i class="fa fa-file-text-o text-primary-500"></i>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-secondary-900 mb-1">
                      {{ file.name }}
                    </div>
                    <div class="text-xs text-secondary-500 font-mono">
                      {{ formatBytes(file.size) }}
                    </div>
                  </div>
                </div>
                <button
                  @click="removeFile(file.name)"
                  class="w-8 h-8 rounded-full hover:bg-red-50 text-secondary-400 hover:text-red-500 transition-colors flex items-center justify-center focus:outline-none"
                  title="移除文件"
                >
                  <i class="fa fa-trash-o"></i>
                </button>
              </li>
            </ul>
          </div>

          <div
            class="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4"
          >
            <div
              class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0"
            >
              <i class="fa fa-info text-blue-600"></i>
            </div>
            <div>
              <h4 class="font-bold text-blue-800 mb-2">OCR文档识别</h4>
              <p class="text-sm text-blue-700/80 leading-relaxed">
                系统支持中、英、俄三语混合文档的OCR识别，自动提取图片中的文字信息，转化为可编辑的文本内容，用于后续摘要生成。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 摘要主题设置 -->
    <div class="card p-8 mb-8 shadow-lg shadow-gray-200/50 border-0">
      <h3 class="text-xl font-bold text-secondary-800 mb-4 flex items-center">
        <i class="fa fa-lightbulb-o text-primary-500 mr-2"></i>
        摘要主题设置
        <span class="text-sm font-normal text-secondary-500 ml-2">(可选)</span>
      </h3>
      <p class="text-secondary-500 mb-4">
        您可以指定生成的摘要主题或关注点，系统将更有针对性地提取信息。
      </p>
      <div class="relative">
        <input
          type="text"
          v-model="summaryTopic"
          placeholder="例如：请重点关注本文档提到的'可持续发展'相关内容"
          class="input-field pl-4"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div
      class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <router-link to="/" class="btn-secondary px-8">
        <i class="fa fa-arrow-left mr-2"></i> 返回首页
      </router-link>
      <button
        @click="nextStep"
        class="btn-primary px-10 shadow-lg shadow-primary-500/20"
        :disabled="!canProceed"
      >
        下一步 <i class="fa fa-arrow-right ml-2"></i>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import { searchKnowledge, getKnowledgeFile } from "../services/api";
import VuePdfEmbed from "vue-pdf-embed";

const router = useRouter();
const store = useAppStore();

// 摘要主题
const summaryTopic = computed({
  get: () => store.summaryTopic,
  set: (val) => {
    store.summaryTopic = val;
  },
});

// 数据源类型
const dataSourceType = ref(store.dataSourceType);

// 搜索关键词
const searchKeywords = ref(store.searchKeywords);

// 搜索结果
const searchResults = ref([]);

// 预览相关状态
const showPreviewModal = ref(false);
const previewPdfUrl = ref(null);
const previewPdfTitle = ref("");
const isPreviewLoading = ref(false);
const currentPreviewDoc = ref(null);

// 处理预览
const handlePreview = async (doc) => {
  currentPreviewDoc.value = doc;
  previewPdfTitle.value = doc.title;
  showPreviewModal.value = true;
  isPreviewLoading.value = true;
  if (previewPdfUrl.value) {
    URL.revokeObjectURL(previewPdfUrl.value);
    previewPdfUrl.value = null;
  }

  try {
    // 假设 API 返回 Blob
    const blob = await getKnowledgeFile(doc.id);
    previewPdfUrl.value = URL.createObjectURL(blob);
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
    selectDocument(currentPreviewDoc.value);
    closePreview();
  }
};

// 搜索加载状态
const isSearching = ref(false);

// 搜索错误信息
const searchError = ref("");

// 选择数据源
const selectDataSource = (type) => {
  dataSourceType.value = type;
  store.dataSourceType = type;
};

// 搜索文档
const searchDocuments = async () => {
  if (!searchKeywords.value.trim()) {
    searchError.value = "请输入关键词";
    return;
  }

  isSearching.value = true;
  searchError.value = "";

  try {
    const results = await searchKnowledge(searchKeywords.value, 10, 0);
    searchResults.value = results || [];
    if (searchResults.value.length === 0) {
      searchError.value = "未找到匹配的结果，请尝试其他关键词";
    }
  } catch (error) {
    console.error("搜索失败:", error);
    searchError.value = error.message || "搜索失败，请稍后重试";
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// 处理文件上传
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    console.log("上传的文件：", files);
    store.uploadFiles(files);
  }
};

// 选择搜索结果文档
const selectDocument = (doc) => {
  // 将选中的文档添加到初始文档列表
  if (!store.initialDocuments) {
    store.initialDocuments = [];
  }

  const isAlreadySelected = store.initialDocuments.some((d) => d.id === doc.id);

  if (!isAlreadySelected) {
    console.log("Adding document:", doc.id);
    store.initialDocuments.push({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      authors: doc.authors,
      year: doc.year,
      score: doc.score,
    });
  } else {
    // Optional: If already selected, maybe just log it or remove it?
    // For toggle behavior logic, see toggleSelection below
    console.log("Document already selected:", doc.id);
  }
};

// 切换文档选择状态 (用于 Checkbox)
const toggleSelection = (doc) => {
  if (!store.initialDocuments) {
    store.initialDocuments = [];
  }
  const index = store.initialDocuments.findIndex((d) => d.id === doc.id);
  if (index > -1) {
    store.initialDocuments.splice(index, 1);
  } else {
    selectDocument(doc);
  }
};

// 判断文档是否已选
const isDocumentSelected = (docId) => {
  return (
    store.initialDocuments && store.initialDocuments.some((d) => d.id === docId)
  );
};

// 移除已上传文件
const removeFile = (fileName) => {
  store.removeUploadedFile(fileName);
};

// 格式化字节大小
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// 检查是否可以继续
const canProceed = computed(() => {
  if (dataSourceType.value === "knowledgeBase") {
    // Check if initialDocuments array has items (requires valid store state)
    // If user inputs keyword, assume they can proceed to search (button does navigation)
    // But 'Next' button Logic here says:
    // If knowledgeBase, we need selected documents? Wait, the logic is:
    // IF knowledgeBase -> user searches -> gets results -> selects docs.
    // So here at step 1 'DataSource', canProceed might depend on if they typed something or if they have selected docs?
    // The original code was: return store.initialDocuments.length > 0;
    // But store.initialDocuments is populated AFTER search?
    // Actually, looking at original code:
    // const searchDocuments = ... router.push("/knowledge-base");
    // const nextStep = ... if (dataSourceType.value === "knowledgeBase") ... router.push("/template-select"); (skips docs processing?)
    // The logic seems:
    // 1. User types keyword + clicks SEARCH -> goes to KnowledgeBase page (where they select docs).
    // 2. OR User clicks NEXT -> goes to TemplateSelect (Skipping validation? Or maybe assumes docs selected?)
    // The "Next" button is disabled if `!canProceed`.
    // `canProceed` checks `store.initialDocuments.length`.
    // So user MUST search first.
    // I will keep the original logic.
    return store.initialDocuments.length > 0;
  } else if (dataSourceType.value === "ocr") {
    return store.uploadedFiles.length > 0;
  }
  return false;
});

// 下一步
const nextStep = () => {
  if (canProceed.value) {
    if (dataSourceType.value === "knowledgeBase") {
      // 直接跳过文档处理，进入模板选择页面
      router.push("/knowledge-base");
      store.nextStep();
      store.nextStep(); // 连续跳两步
    } else {
      router.push("/ocr-upload");
      store.nextStep();
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

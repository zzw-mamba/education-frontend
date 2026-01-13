<template>
  <div class="max-w-4xl mx-auto">
    <!-- 步骤指示器 -->
    <div class="mb-12">
      <div class="flex justify-between items-center">
        <div class="progress-step active">
          <div class="progress-step-number">1</div>
          <span class="progress-step-text ml-2">选择数据源</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">2</div>
          <span class="progress-step-text ml-2">文档处理</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">3</div>
          <span class="progress-step-text ml-2">选择模板</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">4</div>
          <span class="progress-step-text ml-2">生成摘要</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
          <div class="progress-step-number">5</div>
          <span class="progress-step-text ml-2">查看结果</span>
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
                searchKeywords = '医疗应用';
                searchDocuments();
              "
            >
              医疗应用
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

          <div
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";

const router = useRouter();
const store = useAppStore();

// 数据源类型
const dataSourceType = ref(store.dataSourceType);

// 搜索关键词
const searchKeywords = ref(store.searchKeywords);

// 选择数据源
const selectDataSource = (type) => {
  dataSourceType.value = type;
  store.dataSourceType = type;
};

// 搜索文档
const searchDocuments = () => {
  if (searchKeywords.value.trim()) {
    // 将关键词同步到 store，便于其他页面使用
    store.searchKeywords = searchKeywords.value;
    // 触发检索（异步模拟）
    store.searchDocuments(searchKeywords.value);
    // 跳转到知识库结果页以展示检索结果，给用户可见反馈
    router.push("/knowledge-base");
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
      router.push("/template-select");
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

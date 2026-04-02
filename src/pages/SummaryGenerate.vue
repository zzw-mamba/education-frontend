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

        <!-- Step 4: Active -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white z-10 transition-transform group-hover:scale-105"
          >
            4
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-sm font-bold text-primary-700"
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
    <h1 class="text-3xl font-bold mb-6">生成摘要</h1>

    <!-- 生成进度 -->
    <div class="card text-center py-12">
      <div v-if="isGenerating" class="mb-8">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-6"
        ></div>
        <h2 class="text-2xl font-semibold mb-4">正在生成摘要</h2>
        <p class="text-secondary-600 max-w-2xl mx-auto">
          系统正在处理您选择的{{ sourceCount }}个{{
            dataSourceType === "knowledgeBase" ? "知识库文档" : "OCR识别文档"
          }}，并根据{{ selectedTemplateName }}模板生成摘要。
        </p>

        <!-- 进度条 -->
        <div class="mt-8 max-w-2xl mx-auto">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary-600 h-2.5 rounded-full"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <p class="text-sm text-secondary-500 mt-2">{{ progress }}%</p>
        </div>
      </div>

      <div v-else class="mb-8">
        <!-- 错误状态 -->
        <div v-if="generateError" class="mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6"
          >
            <i class="fa fa-times text-red-500 text-2xl"></i>
          </div>
          <h2 class="text-2xl font-semibold mb-4 text-red-600">生成失败</h2>
          <p class="text-secondary-600 max-w-2xl mx-auto mb-4">
            {{ generateError }}
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button @click="regenerateSummary" class="btn-primary">
              <i class="fa fa-refresh mr-2"></i> 重试
            </button>
          </div>
        </div>
        <!-- 成功状态 -->
        <div v-else>
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6"
          >
            <i class="fa fa-check text-green-500 text-2xl"></i>
          </div>
          <h2 class="text-2xl font-semibold mb-4">摘要生成完成</h2>
          <p class="text-secondary-600 max-w-2xl mx-auto mb-8">
            系统已成功生成摘要，您可以点击下方按钮查看结果，或进行进一步优化。
          </p>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button @click="viewResult" class="btn-primary">
              <i class="fa fa-eye mr-2"></i> 查看结果
            </button>
            <button @click="goToHistory" class="btn-secondary">
              <i class="fa fa-history mr-2"></i> 生成历史
            </button>
            <button @click="regenerateSummary" class="btn-secondary">
              <i class="fa fa-refresh mr-2"></i> 重新生成
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import { generateSummaryByTemplate } from "../services/api";

const router = useRouter();
const store = useAppStore();

// 生成状态
const isGenerating = ref(true);

// 生成进度
const progress = ref(0);

// 错误信息
const generateError = ref(null);

// 数据源类型
const dataSourceType = ref(store.dataSourceType);

// 来源数量
const sourceCount = computed(() => {
  return dataSourceType.value === "knowledgeBase"
    ? store.selectedDocuments.length
    : store.ocrResults.length;
});

// 选中的模板名称
const selectedTemplateName = ref(
  store.selectedTemplate ? store.selectedTemplate.name : "自定义"
);

// 真实生成摘要
const doGenerate = async () => {
  isGenerating.value = true;
  progress.value = 0;
  generateError.value = null;

  // 缓慢增长到 90% 等待 API 返回
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value = Math.min(
        90,
        progress.value + Math.floor(Math.random() * 5) + 2
      );
    }
  }, 600);

  try {
    const templateId = store.selectedTemplate?.id;
    const paperIds = store.selectedDocuments
      .map((doc) => doc.id)
      .filter(Boolean);

    if (dataSourceType.value === "knowledgeBase" && paperIds.length === 0) {
      throw new Error("请先在知识库中选择论文，再生成摘要");
    }

    const response = await generateSummaryByTemplate(templateId, {
      query_text: store.summaryTopic,
      paper_ids: paperIds,
      top_k: store.summaryTopK || 8,
      focus_direction:
        store.summaryFocusDirection || "行业发展趋势与技术演进路径",
      style: store.summaryStyle || "客观严谨的学术/商业报告风格",
      word_limit: String(store.summaryWordLimit || "500-800字"),
      graph_top_entities: store.summaryGraphTopEntities || 8,
      snippets_per_entity: store.summarySnippetsPerEntity || 2,
      neighbor_limit: store.summaryNeighborLimit || 4,
      max_graph_papers: store.summaryMaxGraphPapers || 3,
    });

    clearInterval(progressInterval);
    progress.value = 100;

    const data = response?.data;
    const files =
      data?.files && typeof data.files === "object"
        ? data.files
        : response?.files && typeof response.files === "object"
        ? response.files
        : {};
    store.generatedSummary = {
      id: Date.now(),
      title: data?.template_name || store.selectedTemplate?.name || "生成摘要",
      content: data?.summary || "",
      date: new Date().toISOString(),
      templateId: data?.template_id || templateId,
      retrievedChunks: data?.retrieved_chunks || 0,
      graphContextBlocks: data?.graph_context_blocks || 0,
      sourceCount: data?.retrieved_chunks || 0,
      citations: data?.citations || {},
      files,
    };
    store.summaryHistory = [
      ...(store.summaryHistory || []),
      store.generatedSummary,
    ];

    setTimeout(() => {
      isGenerating.value = false;
    }, 500);
  } catch (err) {
    clearInterval(progressInterval);
    generateError.value =
      err?.response?.data?.detail || err.message || "摘要生成失败";
    isGenerating.value = false;
    progress.value = 0;
  }
};

// 查看结果
const viewResult = () => {
  router.push("/result-view");
  store.nextStep();
};

// 重新生成
const regenerateSummary = () => {
  doGenerate();
};

// 跳转到历史记录页
const goToHistory = () => {
  router.push("/generation-history");
};

// 页面挂载时开始生成
onMounted(() => {
  doGenerate();
});
</script>

<style scoped>
/* 可以在这里添加摘要生成页面特定的样式 */
</style>

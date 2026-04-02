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

        <!-- Step 3: Active -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white z-10 transition-transform group-hover:scale-105"
          >
            3
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-sm font-bold text-primary-700"
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
    <h1 class="text-3xl font-bold mb-6">选择摘要模板</h1>
    <p class="text-secondary-600 mb-8">
      请选择适合的摘要模板，或输入自定义提示词来定制摘要的格式和内容。
    </p>

    <!-- 模板纵向列表（每行一个） -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-secondary-800">可用模板</h2>
        <p class="text-sm text-secondary-500">逐行选择并展开查看详情</p>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          class="card w-full relative bg-white rounded-xl shadow-card p-4 border-black-2 cursor-pointer"
          :class="
            selectedTemplateId === template.id
              ? 'border-2 border-primary-500'
              : 'border-transparent hover:border-gray-200'
          "
        >
          <div
            class="flex items-start justify-between md:items-center mb-2 md:mb-0"
          >
            <div
              class="flex-1 pr-4"
              @click="selectTemplate(template)"
              style="cursor: pointer"
            >
              <h3 class="text-lg font-semibold text-secondary-900">
                {{ template.name }}
              </h3>
              <p class="text-sm text-secondary-600">
                {{ template.description }}
              </p>
            </div>

            <div class="flex items-center gap-3 ml-4">
              <div
                class="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                :class="
                  selectedTemplateId === template.id
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                "
              >
                <i
                  class="fa fa-check text-white text-xs"
                  v-if="selectedTemplateId === template.id"
                ></i>
              </div>

              <button
                @click.stop="toggleExpand(template.id)"
                :aria-expanded="expandedId === template.id"
                class="text-secondary-500 hover:text-secondary-700 p-2"
                :title="expandedId === template.id ? '收起详情' : '展开详情'"
              >
                <i
                  :class="[
                    'fa',
                    expandedId === template.id
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down',
                  ]"
                ></i>
              </button>
            </div>
          </div>

          <div
            class="bg-gradient-to-r from-white to-gray-50 rounded-lg p-3 my-3 shadow-card"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-secondary-500">模板预览</h4>
              <span class="text-xs text-secondary-400">预览</span>
            </div>
            <div
              class="rounded-md bg-white p-3 border border-gray-100 shadow-inner"
            >
              <p class="text-sm text-secondary-700 italic">
                {{ template.preview }}
              </p>
            </div>
          </div>

          <transition name="slide-fade">
            <div
              v-show="expandedId === template.id"
              class="mt-2 text-sm text-secondary-700"
            >
              <p class="mb-2"><strong>详细说明：</strong></p>
              <p class="mb-3">
                {{
                  template.details ||
                  template.longDescription ||
                  template.description
                }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 上传模板报告并生成模板 -->
    <div class="card mb-8">
      <h3 class="text-xl font-semibold text-secondary-900 mb-4">
        上传模板报告 (可选)
      </h3>
      <p class="text-secondary-600 mb-4">
        上传一份模板报告（.txt/.md/.docx/.pdf/.json），系统将尝试解析并生成可用的摘要模板。
      </p>

      <div class="flex items-center gap-4 mb-4">
        <label class="btn-secondary cursor-pointer">
          <i class="fa fa-upload mr-2"></i> 选择报告文件
          <input
            type="file"
            class="hidden"
            accept=".txt,.md,.docx,.pdf,.json"
            @change="handleReportFile"
          />
        </label>
        <div v-if="reportFile">
          <div class="text-sm text-secondary-800">{{ reportFile.name }}</div>
          <div class="text-xs text-secondary-500">
            {{ formatFileSize(reportFile.size) }}
          </div>
        </div>
        <div v-else class="text-sm text-secondary-500">未选择文件</div>
      </div>

      <div v-if="reportPreview" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <div
            class="text-sm font-semibold text-secondary-700 flex items-center"
          >
            <i class="fa fa-file-code-o mr-2 text-primary-600"></i>
            模板结构预览
          </div>
          <span
            class="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded border border-primary-100 font-medium"
          >
            AI 生成结果
          </span>
        </div>
        <div
          class="bg-[#f8fafc] border border-slate-200 p-4 rounded-lg text-sm text-slate-700 max-h-[600px] overflow-y-auto shadow-inner font-mono leading-relaxed whitespace-pre-wrap selection:bg-primary-100 selection:text-primary-900"
        >
          {{ reportPreview }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="btn-primary"
          :disabled="!reportFile || isParsing"
          @click="generateTemplateFromReport"
        >
          <i class="fa fa-magic mr-2"></i> 生成模板并使用
        </button>
        <button
          class="btn-secondary"
          @click="clearReport"
          :disabled="!reportFile"
        >
          清除
        </button>
        <div v-if="isParsing" class="text-sm text-secondary-500">
          正在解析...
        </div>
      </div>
    </div>

    <!-- 生成参数配置 -->
    <div class="card mb-8">
      <h3 class="text-xl font-semibold text-secondary-900 mb-4">
        生成参数配置
      </h3>
      <div class="space-y-4">
        <!-- 检索问题 -->
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-1">
            检索问题 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="queryText"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="请输入检索问题，例如：深度学习在图像识别中的应用"
          />
          <p class="text-xs text-secondary-400 mt-1">
            将用于在知识图谱中检索相关文献片段
          </p>
        </div>
        <!-- 关注方向 -->
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-1">
            关注方向 <span class="text-secondary-400 text-xs">(可选)</span>
          </label>
          <input
            v-model="focusDirection"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="例如：方法对比、实验结果、应用场景"
          />
        </div>
        <!-- 摘要风格 + 字数限制 -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              摘要风格 <span class="text-secondary-400 text-xs">(可选)</span>
            </label>
            <input
              v-model="summaryStyle"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="例如：客观严谨的学术/商业报告风格"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              字数限制 <span class="text-secondary-400 text-xs">(可选)</span>
            </label>
            <input
              v-model="wordLimit"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="例如：500-800字"
            />
          </div>
        </div>

        <!-- 检索与图谱参数 -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              向量召回数量 top_k
            </label>
            <input
              v-model.number="topK"
              type="number"
              min="1"
              max="30"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              核心实体数 graph_top_entities
            </label>
            <input
              v-model.number="graphTopEntities"
              type="number"
              min="1"
              max="20"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              每实体片段数 snippets_per_entity
            </label>
            <input
              v-model.number="snippetsPerEntity"
              type="number"
              min="1"
              max="5"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              邻居数量 neighbor_limit
            </label>
            <input
              v-model.number="neighborLimit"
              type="number"
              min="0"
              max="20"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">
              图谱论文上限 max_graph_papers
            </label>
            <input
              v-model.number="maxGraphPapers"
              type="number"
              min="1"
              max="10"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div> -->
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between">
      <button @click="prevStep" class="btn-secondary">
        <i class="fa fa-arrow-left mr-2"></i> 上一步
      </button>
      <button
        @click="nextStep"
        class="btn-primary"
        :disabled="!selectedTemplateId || !queryText.trim()"
      >
        生成摘要 <i class="fa fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import { getMyTemplates } from "../services/api";

const router = useRouter();
const store = useAppStore();

// 模板列表（响应 store 的变化）
const templates = computed(() => store.templates);

// 选中的模板ID
const selectedTemplateId = ref(
  store.selectedTemplate ? store.selectedTemplate.id : null
);

// 生成参数
const queryText = ref(store.summaryTopic || "");
const topK = ref(store.summaryTopK || 8);
const focusDirection = ref(
  store.summaryFocusDirection || "行业发展趋势与技术演进路径"
);
const summaryStyle = ref(store.summaryStyle || "客观严谨的学术/商业报告风格");
const wordLimit = ref(store.summaryWordLimit || "500-800字");
const graphTopEntities = ref(store.summaryGraphTopEntities || 8);
const snippetsPerEntity = ref(store.summarySnippetsPerEntity || 2);
const neighborLimit = ref(store.summaryNeighborLimit || 4);
const maxGraphPapers = ref(store.summaryMaxGraphPapers || 3);

// 用于展开详情的模板ID
const expandedId = ref(null);

// 自定义提示词
const customPrompt = ref(store.customPrompt);

// 模板报告上传与解析（用于从报告生成模板）
const reportFile = ref(null);
const reportRawContent = ref(""); // 文件原始内容（仅供解析用）
const reportPreview = ref("");
const isParsing = ref(false);

const normalizeTags = (labels) => {
  if (!labels) return [];
  if (Array.isArray(labels)) {
    return labels.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof labels === "string") {
    const text = labels.trim();
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => String(tag).trim()).filter(Boolean);
      }
    } catch (_) {
      // ignore parse error and fallback to comma split
    }
    return text
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const fetchTemplates = async () => {
  try {
    const response = await getMyTemplates();
    const list = Array.isArray(response?.data) ? response.data : [];

    const mappedTemplates = list.map((template) => ({
      id: template.id,
      userId: template.user_id,
      name: template.name || "未命名模板",
      description: template.description || "",
      preview: template.example || template.prompt || "",
      prompt: template.prompt || "",
      example: template.example || template.prompt || "",
      category: template.category,
      tags: normalizeTags(template.labels),
      iconPath: template.icon_path || "",
      updatedAt: template.updated_at || template.created_at || null,
    }));

    store.templates = mappedTemplates;
  } catch (error) {
    console.error("获取模板失败:", error);
  }
};

const handleReportFile = (event) => {
  const f = event.target.files && event.target.files[0];
  if (!f) return;
  reportFile.value = f;
  reportPreview.value = ""; // 清空预览，等待生成后显示解析结果
  reportRawContent.value = "";
  const isText =
    /text|json|markdown|plain/.test(f.type) || /\.(txt|md|json)$/i.test(f.name);
  if (isText) {
    const reader = new FileReader();
    reader.onload = () => {
      reportRawContent.value = String(reader.result || "");
      // 不立即展示 preview，等用户点击生成后再展示解析结果
    };
    reader.onerror = () => {
      reportRawContent.value = "";
    };
    reader.readAsText(f);
  } else {
    // 非文本文件也保留 file 对象，解析将由生成逻辑处理（store 会做占位）
    reportRawContent.value = "";
  }
};

const clearReport = () => {
  reportFile.value = null;
  reportPreview.value = "";
};

const generateTemplateFromReport = async () => {
  if (!reportFile.value) return;
  try {
    isParsing.value = true;
    const newTemplate = await store.uploadTemplateReport(reportFile.value);
    // 使用新模板并显示解析后的预览信息
    selectedTemplateId.value = newTemplate.id;
    customPrompt.value = newTemplate.prompt || "";
    store.updateCustomPrompt(customPrompt.value);
    // 将解析生成的 preview 放到 preview 区显示
    reportPreview.value =
      newTemplate.preview ||
      (reportRawContent.value ? reportRawContent.value : "(无可用预览)");

    // 把已上传的源内容清除（可选）
    // reportFile.value = null
  } catch (err) {
    console.error("生成模板失败", err);
  } finally {
    isParsing.value = false;
  }
};

// 选择模板（点击卡片左侧区域）
const selectTemplate = (template) => {
  selectedTemplateId.value = template.id;
  store.selectTemplate(template);
  customPrompt.value = template.prompt || "";
  store.updateCustomPrompt(customPrompt.value);
};

// 切换展开/收起
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// 更新自定义提示词
const updateCustomPrompt = () => {
  console.log("Updating custom prompt:", customPrompt.value);
  store.updateCustomPrompt(customPrompt.value);
};

// 上一步
const prevStep = () => {
  updateCustomPrompt();
  if (store.dataSourceType === "knowledgeBase") {
    router.push("/knowledge-base");
  } else {
    router.push("/ocr-upload");
  }
  store.prevStep();
};

// 下一步
const nextStep = () => {
  if (selectedTemplateId.value && queryText.value.trim()) {
    updateCustomPrompt();
    store.summaryTopic = queryText.value.trim();
    store.summaryTopK = Math.min(30, Math.max(1, Number(topK.value) || 8));
    store.summaryFocusDirection =
      focusDirection.value || "行业发展趋势与技术演进路径";
    store.summaryStyle = summaryStyle.value || "客观严谨的学术/商业报告风格";
    store.summaryWordLimit = wordLimit.value || "500-800字";
    store.summaryGraphTopEntities = Math.min(
      20,
      Math.max(1, Number(graphTopEntities.value) || 8)
    );
    store.summarySnippetsPerEntity = Math.min(
      5,
      Math.max(1, Number(snippetsPerEntity.value) || 2)
    );
    store.summaryNeighborLimit = Math.min(
      20,
      Math.max(0, Number(neighborLimit.value) || 4)
    );
    store.summaryMaxGraphPapers = Math.min(
      10,
      Math.max(1, Number(maxGraphPapers.value) || 3)
    );
    router.push("/summary-generate");
    store.nextStep();
  }
};

// 格式化字节大小（用于文件信息显示）
const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
};

// 页面挂载时，默认选择第一个模板（如果未选择）
onMounted(async () => {
  await fetchTemplates();

  if (store.selectedTemplate && store.selectedTemplate.id) {
    const matched = templates.value.find(
      (template) => template.id === store.selectedTemplate.id
    );
    if (matched) {
      selectedTemplateId.value = matched.id;
      store.selectTemplate(matched);
      customPrompt.value = matched.prompt || "";
      store.updateCustomPrompt(customPrompt.value);
    }
  } else if (templates.value && templates.value.length > 0) {
    const first = templates.value[0];
    selectedTemplateId.value = first.id;
    store.selectTemplate(first);
    customPrompt.value = first.prompt || "";
    store.updateCustomPrompt(customPrompt.value);
  }
});
</script>

<style scoped>
/* 动画：展开/收起 */
.slide-fade-enter-active {
  transition: all 0.18s ease;
}
.slide-fade-leave-active {
  transition: all 0.15s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
  height: 0;
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.card {
  box-sizing: border-box;
}
</style>

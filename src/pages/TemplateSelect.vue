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
                {{ displayTemplateDescription(template) }}
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
              <h4 class="text-sm font-medium text-secondary-500">预览</h4>
            </div>
            <div
              class="rounded-md bg-white p-3 border border-gray-100 shadow-inner"
            >
              <p class="text-sm text-secondary-700 italic whitespace-pre-line leading-relaxed">
                {{ formatPromptPreview(template.prompt) }}
              </p>
            </div>
          </div>

          <transition name="slide-fade">
            <div
              v-show="expandedId === template.id"
              class="mt-2 text-sm text-secondary-700"
            >
              <div class="space-y-2 mt-2">
                <div
                  v-for="(section, idx) in buildTemplateSections(template)"
                  :key="`${template.id}-section-${idx}`"
                  class="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div
                    class="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-secondary-600"
                  >
                    {{ section.title }}
                  </div>
                  <div
                    class="px-3 py-2 text-sm text-secondary-700 whitespace-pre-line leading-relaxed"
                  >
                    {{ section.content }}
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 创建模板：手工 / AI -->
    <div class="card mb-8">
      <h3 class="text-xl font-semibold text-secondary-900 mb-4">
        创建模板（可选）
      </h3>
      <div class="mb-4 grid grid-cols-2 gap-2 max-w-xs">
        <button
          type="button"
          class="rounded-xl border px-3 py-2 text-sm transition"
          :class="
            createMode === 'manual'
              ? 'border-primary-300 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-secondary-700 hover:border-primary-200'
          "
          @click="createMode = 'manual'"
        >
          手工创建
        </button>
        <button
          type="button"
          class="rounded-xl border px-3 py-2 text-sm transition"
          :class="
            createMode === 'ai'
              ? 'border-primary-300 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-secondary-700 hover:border-primary-200'
          "
          @click="createMode = 'ai'"
        >
          AI 生成
        </button>
      </div>

      <p v-if="createMode === 'ai'" class="text-secondary-600 mb-4">
        上传一份模板报告（.txt/.md/.docx/.pdf/.json），系统将尝试解析并生成可用的摘要模板。
      </p>
      <p v-else class="text-secondary-600 mb-4">
        手工填写模板信息并立即保存，适合已有明确提示词的场景。
      </p>

      <div v-if="createMode === 'manual'" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="text-sm font-medium text-secondary-800">模板名称</label>
            <input
              v-model="manualForm.name"
              type="text"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="例如：会议纪要模板"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-secondary-800">分类</label>
            <select
              v-model="manualForm.category"
              class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option
                v-for="opt in TEMPLATE_CATEGORY_OPTIONS"
                :key="opt.value"
                :value="opt.label"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="text-sm font-medium text-secondary-800">描述</label>
          <textarea
            v-model="manualForm.description"
            rows="3"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="简要说明模板适用场景"
          ></textarea>
        </div>
        <div>
          <label class="text-sm font-medium text-secondary-800">标签</label>
          <input
            v-model="manualForm.tagsInput"
            type="text"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="以逗号分隔，例如：会议,纪要,中文"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-secondary-800">预览</label>
          <textarea
            v-model="manualForm.prompt"
            rows="8"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="输入用于生成摘要的模版"
          ></textarea>
        </div>
        <!-- <div>
          <label class="text-sm font-medium text-secondary-800">预览（可选）</label>
          <textarea
            v-model="manualForm.preview"
            rows="4"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="可填写示例输出，不填时默认截取提示词前400字"
          ></textarea>
        </div> -->

        <div class="flex items-center gap-3">
          <button class="btn-primary" :disabled="isParsing" @click="createManualTemplate">
            <i class="fa fa-plus mr-2"></i> 创建并使用
          </button>
          <div v-if="manualError" class="text-sm text-red-600">{{ manualError }}</div>
        </div>
      </div>

      <div v-if="createMode === 'ai'">

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
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between">
      <button @click="prevStep" class="btn-secondary">
        <i class="fa fa-arrow-left mr-2"></i> 上一步
      </button>
      <button
        @click="nextStep"
        class="btn-primary"
        :disabled="!selectedTemplateId"
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
import {
  TEMPLATE_CATEGORY_OPTIONS,
  getTemplateCategoryLabel,
} from "../constants/templateCategories";

const router = useRouter();
const store = useAppStore();

// 模板列表（响应 store 的变化）
const templates = computed(() => store.templates);

// 选中的模板ID
const selectedTemplateId = ref(
  store.selectedTemplate ? store.selectedTemplate.id : null
);

// 用于展开详情的模板ID
const expandedId = ref(null);

// 自定义提示词
const customPrompt = ref(store.customPrompt);

// 模板报告上传与解析（用于从报告生成模板）
const reportFile = ref(null);
const reportRawContent = ref(""); // 文件原始内容（仅供解析用）
const reportPreview = ref("");
const isParsing = ref(false);
const createMode = ref("ai");
const manualError = ref("");
const manualForm = ref({
  name: "",
  description: "",
  category: "通用",
  tagsInput: "",
  prompt: "",
  preview: "",
});

const parseTags = (value) => {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;
  const text = value.trim();
  if (!text) return "";
  if (!(text.startsWith("{") || text.startsWith("["))) return value;
  try {
    return JSON.parse(text);
  } catch {
    return value;
  }
};

const pickTemplateText = (value) => {
  const normalized = parseMaybeJson(value);

  if (typeof normalized === "string") {
    return normalized;
  }

  if (Array.isArray(normalized)) {
    return normalized
      .map((item) => pickTemplateText(item))
      .filter(Boolean)
      .join("\n");
  }

  if (isPlainObject(normalized)) {
    return (
      normalized.description ||
      normalized.prompt ||
      normalized.preview ||
      normalized.details ||
      normalized.longDescription ||
      normalized.name ||
      ""
    );
  }

  return normalized != null ? String(normalized) : "";
};

const formatPromptPreview = (value, maxLines = 6) => {
  const text = pickTemplateText(value);
  if (!text) return "暂无预览内容";

  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  if (lines.length <= maxLines) {
    return lines.join("\n");
  }

  return `${lines.slice(0, maxLines).join("\n")}\n...`;
};

const displayTemplateDescription = (template) =>
  pickTemplateText(template?.description) ||
  pickTemplateText(template?.preview) ||
  "暂无描述";

const displayTemplatePreview = (template) =>
  pickTemplateText(template?.preview) ||
  pickTemplateText(template?.example) ||
  pickTemplateText(template?.prompt) ||
  "暂无预览内容";

const displayTemplateDetails = (template) =>
  pickTemplateText(template?.details) ||
  pickTemplateText(template?.longDescription) ||
  displayTemplateDescription(template);

const formatCategoryLabel = (category) => {
  const label = getTemplateCategoryLabel(category);
  return label === "未分类" ? "" : label;
};

const formatTemplateObjectText = (obj) => {
  if (!isPlainObject(obj)) return "";

  const lines = [];
  const name = pickTemplateText(obj.name);
  const category = formatCategoryLabel(obj.category);
  const description = pickTemplateText(obj.description);
  const prompt = pickTemplateText(obj.prompt);

  if (name) lines.push(`模板名称：${name}`);
  if (category) {
    lines.push(`模板分类：${category}`);
  }
  if (description) lines.push(`适用说明：${description}`);
  if (prompt) lines.push(`示例内容：\n${prompt}`);

  return lines.join("\n\n");
};

const displayTemplateExample = (template) => {
  const source = template?.example ?? template?.preview ?? template?.prompt;
  const normalized = parseMaybeJson(source);

  if (typeof normalized === "string") {
    return normalized;
  }

  if (isPlainObject(normalized)) {
    return (
      formatTemplateObjectText(normalized) ||
      pickTemplateText(normalized) ||
      "暂无示例输出"
    );
  }

  if (Array.isArray(normalized)) {
    const text = normalized
      .map((item) =>
        isPlainObject(item)
          ? formatTemplateObjectText(item) || pickTemplateText(item)
          : pickTemplateText(item)
      )
      .filter(Boolean)
      .join("\n\n----------------\n\n");
    return text || "暂无示例输出";
  }

  return pickTemplateText(normalized) || "暂无示例输出";
};

const buildTemplateSections = (template) => {
  const source = template?.example ?? template?.preview ?? template?.prompt;
  const normalized = parseMaybeJson(source);

  if (isPlainObject(normalized)) {
    const sections = [];
    const name = pickTemplateText(normalized.name);
    const category = formatCategoryLabel(normalized.category);
    const description = pickTemplateText(normalized.description);
    const prompt = pickTemplateText(normalized.prompt);
    console.log("12333333333333333333333", template);
    

    if (
      category
    ) {
      sections.push({ title: "模板分类", content: template.categoryLabel });
    }
    if (prompt) sections.push({ title: "模板正文", content: prompt });

    return sections.length
      ? sections
      : [{ title: "示例输出", content: "暂无示例输出" }];
  }

  if (Array.isArray(normalized)) {
    const sections = normalized
      .map((item, idx) => {
        if (isPlainObject(item)) {
          return {
            title: `示例 ${idx + 1}`,
            content: formatTemplateObjectText(item) || pickTemplateText(item),
          };
        }
        const text = pickTemplateText(item);
        return text ? { title: `示例 ${idx + 1}`, content: text } : null;
      })
      .filter(Boolean);

    return sections.length
      ? sections
      : [{ title: "示例输出", content: "暂无示例输出" }];
  }

  const text = displayTemplateExample(template);
  return [{ title: "示例输出", content: text }];
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

const createManualTemplate = async () => {
  manualError.value = "";
  const prompt = String(manualForm.value.prompt || "").trim();
  if (!prompt) {
    manualError.value = "请先填写提示词";
    return;
  }

  try {
    isParsing.value = true;
    const created = await store.addTemplate({
      name: manualForm.value.name,
      description: manualForm.value.description,
      category: manualForm.value.category,
      tags: parseTags(manualForm.value.tagsInput),
      prompt,
      preview: manualForm.value.preview || prompt.slice(0, 400),
    });

    if (created?.id) {
      selectedTemplateId.value = created.id;
      customPrompt.value = created.prompt || prompt;
      store.selectTemplate(created);
    }

    manualForm.value = {
      name: "",
      description: "",
      category: "通用",
      tagsInput: "",
      prompt: "",
      preview: "",
    };
  } catch (err) {
    manualError.value =
      err?.response?.data?.detail || err?.message || "手工创建模板失败";
  } finally {
    isParsing.value = false;
  }
};

// 选择模板（点击卡片左侧区域）
const selectTemplate = (template) => {
  selectedTemplateId.value = template.id;
  store.selectTemplate(template);
};

// 切换展开/收起
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// 更新自定义提示词
const updateCustomPrompt = () => {
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
  if (selectedTemplateId.value) {
    updateCustomPrompt();
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
onMounted(() => {
  if (store.selectedTemplate && store.selectedTemplate.id) {
    selectedTemplateId.value = store.selectedTemplate.id;
  } else if (templates.value && templates.value.length > 0) {
    const first = templates.value[0];
    selectedTemplateId.value = first.id;
    store.selectTemplate(first);
    customPrompt.value = first.prompt || "";
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

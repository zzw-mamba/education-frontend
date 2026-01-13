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
        <div class="progress-step active">
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
              <div class="text-xs text-secondary-500">示例输出：</div>
              <pre
                class="bg-gray-100 rounded p-3 text-xs mt-2 overflow-x-auto"
                >{{ template.example || template.preview }}</pre
              >
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

      <div v-if="reportPreview" class="mb-4">
        <div class="text-sm font-medium text-secondary-700 mb-1">解析预览</div>
        <div
          class="bg-gray-50 p-3 rounded text-sm text-secondary-700 max-h-40 overflow-auto"
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
      (reportRawContent.value
        ? reportRawContent.value.slice(0, 2000)
        : "(无可用预览)");
    // 不在上面的模板列表中显示由报告生成的临时模板，仅在下方显示解析预览
    try {
      store.templates = store.templates.filter((t) => t.id !== newTemplate.id);
    } catch (e) {
      // ignore if mutation fails
    }
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

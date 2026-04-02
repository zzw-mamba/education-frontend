<template>
  <div class="space-y-6">
    <div
      class="rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 via-white to-blue-50 p-6 shadow-card"
    >
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p class="text-sm font-medium text-primary-700">模板库</p>
          <h1 class="text-2xl font-bold text-secondary-900">模板库管理</h1>
          <p class="text-secondary-600 mt-1 text-sm">
            统一查看、编辑、复制和删除摘要模板，保持团队的提示词资产井然有序。
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button class="btn-secondary" @click="goToSelect">
            <i class="fa fa-arrow-left mr-2"></i> 返回模板选择
          </button>
          <button class="btn-primary" @click="openCreate">
            <i class="fa fa-plus mr-2"></i> 新建模板
          </button>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          class="rounded-xl border border-white/70 bg-white/60 p-4 shadow-inner"
        >
          <p class="text-xs text-secondary-500">模板数量</p>
          <p class="mt-1 text-2xl font-semibold text-secondary-900">
            {{ stats.count }}
          </p>
          <p class="text-xs text-secondary-500">
            {{ stats.categories }} 个分类
          </p>
        </div>
        <div
          class="rounded-xl border border-white/70 bg-white/60 p-4 shadow-inner"
        >
          <p class="text-xs text-secondary-500">标签数</p>
          <p class="mt-1 text-2xl font-semibold text-secondary-900">
            {{ stats.tags }}
          </p>
          <p class="text-xs text-secondary-500">覆盖模板标签</p>
        </div>
        <div
          class="rounded-xl border border-white/70 bg-white/60 p-4 shadow-inner"
        >
          <p class="text-xs text-secondary-500">最近更新</p>
          <p class="mt-1 text-lg font-semibold text-secondary-900">
            {{ stats.lastUpdatedText }}
          </p>
          <p class="text-xs text-secondary-500">按更新时间倒序展示</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 md:flex-row md:items-center">
      <div class="relative flex-1">
        <i
          class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
        ></i>
        <input
          v-model="keyword"
          type="text"
          class="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-secondary-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          placeholder="搜索名称、描述、标签或提示词"
        />
      </div>
      <select
        v-model="categoryFilter"
        class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 shadow-sm focus:border-primary-400 focus:outline-none"
      >
        <option value="">全部分类</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select
        v-model="sortKey"
        class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 shadow-sm focus:border-primary-400 focus:outline-none"
      >
        <option value="recent">按更新时间</option>
        <option value="name">按名称</option>
        <option value="category">按分类</option>
      </select>
    </div>

    <div
      v-if="filteredTemplates.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center"
    >
      <i class="fa fa-inbox text-3xl text-secondary-400"></i>
      <p class="mt-3 text-secondary-700">暂无模板，点击右上角新建模板</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span
                class="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
              >
                {{ displayCategory(template) }}
              </span>
              <span class="text-xs text-secondary-400">{{
                formatDate(template.updatedAt)
              }}</span>
            </div>
            <h3 class="mt-2 text-lg font-semibold text-secondary-900">
              {{ template.name }}
            </h3>
            <p class="mt-1 line-clamp-2 text-sm text-secondary-600">
              {{ template.description || "暂无描述" }}
            </p>
          </div>
          <button
            class="rounded-full border border-gray-200 bg-white p-2 text-secondary-500 hover:border-primary-200 hover:text-primary-600"
            @click="duplicate(template)"
            :title="'复制模板'"
          >
            <i class="fa fa-copy"></i>
          </button>
        </div>

        <div
          class="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-secondary-700 shadow-inner"
        >
          <p class="text-xs font-medium text-secondary-500">预览</p>
          <p class="mt-1 line-clamp-3 whitespace-pre-line">
            {{ template.prompt || "暂无预览" }}
          </p>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="tag in template.tags || []"
            :key="tag"
            class="rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs text-secondary-700"
          >
            #{{ tag }}
          </span>
        </div>

        <div
          class="mt-4 grid grid-cols-2 gap-2 text-sm font-medium text-secondary-700"
        >
          <button
            class="flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white py-2 transition hover:border-primary-200 hover:text-primary-700"
            @click="copyPrompt(template.prompt)"
          >
            <i class="fa fa-clipboard"></i>
            复制提示词
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-xl border border-primary-200 bg-primary-50 py-2 text-primary-700 transition hover:bg-primary-100"
            @click="useTemplate(template)"
          >
            <i class="fa fa-play"></i>
            在流程中使用
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white py-2 transition hover:border-primary-200 hover:text-primary-700"
            @click="openEdit(template)"
          >
            <i class="fa fa-pencil"></i>
            编辑
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-xl border border-red-100 bg-red-50 py-2 text-red-600 transition hover:border-red-200 hover:bg-red-100"
            @click="remove(template)"
          >
            <i class="fa fa-trash"></i>
            删除
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-6 md:items-center"
      >
        <div
          class="w-full max-w-3xl max-h-[75vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-wide text-secondary-500">
                {{ isEditing ? "编辑模板" : "新建模板" }}
              </p>
              <h2 class="text-xl font-semibold text-secondary-900">
                {{ isEditing ? form.name || "未命名模板" : "填写模板信息" }}
              </h2>
            </div>
            <button
              class="rounded-full border border-gray-200 p-2 text-secondary-500 hover:border-primary-200 hover:text-primary-600"
              @click="closeForm"
            >
              <i class="fa fa-close"></i>
            </button>
          </div>

          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="space-y-4">
              <div v-if="!isEditing" class="space-y-2">
                <label class="text-sm font-medium text-secondary-800">创建方式</label>
                <div class="grid grid-cols-2 gap-2">
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
              </div>
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >名称</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  :disabled="isAiGeneratingLocked"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="例如：产品发布会摘要"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >分类</label
                >
                <select
                  v-model="form.category"
                  :disabled="isAiGeneratingLocked"
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
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >标签</label
                >
                <input
                  v-model="form.tagsInput"
                  type="text"
                  :disabled="isAiGeneratingLocked"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="以逗号分隔，例如：营销,新品,中文"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >描述</label
                >
                <textarea
                  v-model="form.description"
                  rows="3"
                  :disabled="isAiGeneratingLocked"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="简要说明模板的使用场景和输出要求"
                ></textarea>
              </div>
            </div>

            <div class="space-y-4">
              <div v-if="!isEditing && createMode === 'ai'" class="space-y-2">
                <label class="text-sm font-medium text-secondary-800">
                  上传模板样例
                </label>
                <label
                  class="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-700 hover:border-primary-300 hover:bg-primary-100"
                >
                  <i class="fa fa-upload"></i>
                  <span>{{
                    reportFile
                      ? reportFile.name
                      : "选择 .txt / .md / .json / 其他文件"
                  }}</span>
                  <input
                    type="file"
                    class="hidden"
                    accept=".txt,.md,.json,.docx,.pdf,.html,.csv"
                    @change="handleReportChange"
                  />
                </label>
                <p class="text-xs text-secondary-500">上传后将调用 AI 解析并生成模板。</p>
                <div
                  v-if="reportError"
                  class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  {{ reportError }}
                </div>
              </div>
              <div v-if="isEditing || (!isEditing && createMode === 'manual')">
                <label class="text-sm font-medium text-secondary-800"
                  >预览</label
                >
                <textarea
                  v-model="form.prompt"
                  rows="19"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="编写用于生成摘要的完整模板"
                ></textarea>
              </div>
              <!-- <div v-if="!isEditing && createMode === 'manual'">
                <label class="text-sm font-medium text-secondary-800"
                  >预览（可选）</label
                >
                <textarea
                  v-model="form.preview"
                  rows="8"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="可填写示例输出或说明，不填时默认截取提示词前400字"
                ></textarea>
              </div> -->
              <div v-if="!isEditing && createMode === 'ai'">
                <label class="text-sm font-medium text-secondary-800"
                  >预览</label
                >
                <textarea
                  v-model="form.preview"
                  rows="19"
                  :disabled="isAiGeneratingLocked"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  :placeholder="isGeneratingTemplate ? 'AI 正在生成模板，请稍候...' : '上传样例后展示解析预览（可编辑）'"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button class="btn-secondary" @click="closeForm" :disabled="isGeneratingTemplate">取消</button>
            <button
              class="btn-primary"
              @click="submitForm"
              :disabled="isGeneratingTemplate || (!isEditing && createMode === 'ai' && !generatedTemplateId)"
            >
              {{
                isGeneratingTemplate
                  ? "AI生成中..."
                  : (isEditing ? "保存修改" : (createMode === 'ai' ? "完成" : "创建模板"))
              }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import {
  TEMPLATE_CATEGORY_OPTIONS,
  getTemplateCategoryLabel,
} from "../constants/templateCategories";

const store = useAppStore();
const router = useRouter();

const keyword = ref("");
const categoryFilter = ref("");
const sortKey = ref("recent");
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const applicableDescription = ref("");
const reportFile = ref(null);
const reportRawContent = ref("");
const reportError = ref("");
const createMode = ref("manual");
const isGeneratingTemplate = ref(false);
const generatedTemplateId = ref(null);
const form = reactive({
  name: "",
  description: "",
  category: "通用",
  tagsInput: "",
  preview: "",
  prompt: "",
});

const templates = computed(() => store.templates || []);
const isAiGeneratingLocked = computed(
  () => !isEditing.value && createMode.value === "ai" && isGeneratingTemplate.value
);

const categories = computed(() => {
  const set = new Set(
    (templates.value || []).map((t) => getTemplateCategoryLabel(t.category))
  );
  return Array.from(set);
});

const stats = computed(() => {
  const count = templates.value.length;
  const tagSet = new Set();
  templates.value.forEach((t) => {
    (t.tags || []).forEach((tag) => tagSet.add(tag));
  });
  const last = [...templates.value]
    .filter(Boolean)
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0];
  return {
    count,
    categories: categories.value.length,
    tags: tagSet.size,
    lastUpdatedText: last ? formatDate(last.updatedAt) : "暂无",
  };
});

const filteredTemplates = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  let list = [...templates.value];

  if (categoryFilter.value) {
    list = list.filter(
      (t) => getTemplateCategoryLabel(t.category) === categoryFilter.value
    );
  }

  if (kw) {
    list = list.filter((t) => {
      const haystack = [
        t.name,
        t.description,
        t.prompt,
        (t.tags || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(kw);
    });
  }

  if (sortKey.value === "recent") {
    list.sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );
  } else if (sortKey.value === "name") {
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortKey.value === "category") {
    list.sort((a, b) =>
      getTemplateCategoryLabel(a.category).localeCompare(
        getTemplateCategoryLabel(b.category)
      )
    );
  }

  return list;
});

const goToSelect = () => {
  router.push("/template-select");
};

const resetForm = () => {
  form.name = "";
  form.description = "";
  form.category = "通用";
  form.tagsInput = "";
  form.preview = "";
  form.prompt = "";
  applicableDescription.value = "";
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
  createMode.value = "manual";
  isGeneratingTemplate.value = false;
  generatedTemplateId.value = null;
};

const openCreate = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  showForm.value = true;
};

const openEdit = (template) => {
  isEditing.value = true;
  editingId.value = template.id;
  const parsedPreview = parsePromptPayload(template.preview);
  const parsedPreviewDescription = parsedPreview?.description || "";

  form.name = template.name || "";
  form.description = template.description || "";
  form.category = getTemplateCategoryLabel(template.category);
  form.tagsInput = (template.tags || []).join(",");
  form.preview = template.preview || "";
  form.prompt = template.prompt || "";
  applicableDescription.value = parsedPreviewDescription;
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

const parsePromptPayload = (value) => {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) return value;

  const text = String(value).trim();
  if (!text || !text.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
};

const extractedPromptView = computed(() => {
  const parsed = parsePromptPayload(form.preview);

  if (parsed) {
    return {
      description: parsed.description || "",
      prompt: form.prompt || "",
    };
  }

  return {
    description: applicableDescription.value || "",
    prompt: form.prompt || "",
  };
});

const descriptionModel = computed({
  get() {
    return applicableDescription.value || extractedPromptView.value.description || "";
  },
  set(value) {
    const next = value || "";
    applicableDescription.value = next;

    const parsed = parsePromptPayload(form.preview);
    if (parsed) {
      form.preview = JSON.stringify(
        {
          ...parsed,
          description: next,
        },
        null,
        2
      );
    }
  },
});

const parseTags = (value) => {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const handleReportChange = (event) => {
  const f = event.target.files && event.target.files[0];
  reportError.value = "";
  reportRawContent.value = "";
  reportFile.value = f || null;
  generatedTemplateId.value = null;
  if (!f) return;

  if (!isEditing.value && createMode.value === "ai") {
    void generateTemplateFromUpload(f);
  }
};

const generateTemplateFromUpload = async (file) => {
  reportError.value = "";
  isGeneratingTemplate.value = true;
  generatedTemplateId.value = null;
  form.preview = "";
  form.prompt = "";

  try {
    const generated = await store.uploadTemplateReport(file);
    if (!generated) {
      throw new Error("AI 未返回模板结果");
    }

    generatedTemplateId.value = generated.id || null;
    form.name = generated.name || form.name;
    form.description = generated.description || form.description;
    form.category = getTemplateCategoryLabel(generated.category ?? form.category);
    form.tagsInput = (generated.tags || []).join(",");
    form.prompt = generated.prompt || "";
    form.preview = generated.preview || generated.prompt || "";
  } catch (err) {
    reportError.value =
      err?.response?.data?.detail || err.message || "AI 生成模板失败";
  } finally {
    isGeneratingTemplate.value = false;
  }
};

const submitForm = async () => {
  if (isGeneratingTemplate.value) return;
  reportError.value = "";

  const parsedPreview = parsePromptPayload(form.preview);
  const finalPreview = parsedPreview
    ? JSON.stringify(
        {
          ...parsedPreview,
          description: applicableDescription.value || "",
        },
        null,
        2
      )
    : form.preview;

  const basePayload = {
    name: form.name,
    description: form.description,
    category: form.category,
    tags: parseTags(form.tagsInput),
    preview: finalPreview,
    prompt: form.prompt,
    updatedAt: new Date().toISOString(),
  };

  if (isEditing.value && editingId.value) {
    try {
      await store.updateTemplate(editingId.value, basePayload);
      showForm.value = false;
    } catch (err) {
      reportError.value =
        err?.response?.data?.detail || err.message || "模板更新失败";
    }
    return;
  }

  if (createMode.value === "manual") {
    const manualPrompt = String(form.prompt || "").trim();
    if (!manualPrompt) {
      reportError.value = "请填写提示词";
      return;
    }

    const payload = {
      ...basePayload,
      prompt: manualPrompt,
      preview: form.preview || manualPrompt.slice(0, 400),
    };

    try {
      await store.addTemplate(payload);
      showForm.value = false;
    } catch (err) {
      reportError.value =
        err?.response?.data?.detail || err.message || "模板创建失败";
    }
    return;
  }

  if (!reportFile.value) {
    reportError.value = "请先上传模板样例文件";
    return;
  }

  if (!generatedTemplateId.value) {
    reportError.value = "请先上传样例并等待 AI 生成完成";
    return;
  }

  try {
    await store.updateTemplate(generatedTemplateId.value, {
      ...basePayload,
      preview: finalPreview || form.prompt || "",
      prompt: form.preview || form.prompt || "",
    });
  } catch (err) {
    reportError.value =
      err?.response?.data?.detail || err.message || "模板更新失败";
    return;
  }

  const latest = (store.templates || []).find(
    (t) => Number(t.id) === Number(generatedTemplateId.value)
  );
  if (latest) {
    store.selectTemplate(latest);
  }
  showForm.value = false;
};

const remove = async (template) => {
  const ok = window.confirm(`确定删除模板 “${template.name}” 吗？`);
  if (ok) {
    try {
      await store.deleteTemplate(template.id);
    } catch (err) {
      reportError.value =
        err?.response?.data?.detail || err.message || "模板删除失败";
    }
  }
};

const duplicate = async (template) => {
  try {
    await store.duplicateTemplate(template.id);
  } catch (err) {
    reportError.value =
      err?.response?.data?.detail || err.message || "模板复制失败";
  }
};

const useTemplate = (template) => {
  store.selectTemplate(template);
  router.push("/template-select");
};

const copyPrompt = async (prompt) => {
  if (!prompt) return;
  try {
    await navigator.clipboard.writeText(prompt);
  } catch (e) {
    // ignore
  }
};

const formatDate = (value) => {
  if (!value) return "刚刚";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "刚刚";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const displayCategory = (template) => getTemplateCategoryLabel(template?.category);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

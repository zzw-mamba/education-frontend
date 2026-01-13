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
                {{ template.category || "未分类" }}
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
          <p class="text-xs font-medium text-secondary-500">模板预览</p>
          <p class="mt-1 line-clamp-3 whitespace-pre-line">
            {{ template.preview || template.prompt || "暂无预览" }}
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
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4"
      >
        <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
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
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >名称</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="例如：产品发布会摘要"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >分类</label
                >
                <input
                  v-model="form.category"
                  type="text"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="例如：商业 / 技术 / 学术"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >标签</label
                >
                <input
                  v-model="form.tagsInput"
                  type="text"
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
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="简要说明模板的使用场景和输出要求"
                ></textarea>
              </div>
              <div v-if="!isEditing" class="space-y-2">
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
                <p class="text-xs text-secondary-500">
                  文本文件将自动解析生成提示词；非文本文件会创建占位模板，后续可在模板库继续完善。
                </p>
                <div
                  v-if="reportError"
                  class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  {{ reportError }}
                </div>
                <div
                  v-if="reportRawContent"
                  class="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-secondary-700"
                >
                  <p class="mb-1 font-medium text-secondary-600">
                    解析预览（前400字）
                  </p>
                  <pre class="max-h-40 overflow-auto whitespace-pre-wrap">{{
                    reportRawContent.slice(0, 400)
                  }}</pre>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div v-if="isEditing">
                <label class="text-sm font-medium text-secondary-800"
                  >提示词 (Prompt)</label
                >
                <textarea
                  v-model="form.prompt"
                  rows="6"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="编写用于生成摘要的完整提示词"
                ></textarea>
              </div>
              <div>
                <label class="text-sm font-medium text-secondary-800"
                  >预览</label
                >
                <div
                  class="mt-1 min-h-[120px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 shadow-inner"
                >
                  <p
                    v-if="form.preview"
                    class="whitespace-pre-wrap leading-relaxed text-secondary-800"
                  >
                    {{ form.preview }}
                  </p>
                  <p v-else class="text-secondary-400">
                    上传样例后展示解析预览（最多400字）。后端接入后可在此显示模板结构预览。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button class="btn-secondary" @click="closeForm">取消</button>
            <button class="btn-primary" @click="submitForm">
              {{ isEditing ? "保存修改" : "创建模板" }}
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

const store = useAppStore();
const router = useRouter();

const keyword = ref("");
const categoryFilter = ref("");
const sortKey = ref("recent");
const showForm = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const reportFile = ref(null);
const reportRawContent = ref("");
const reportError = ref("");
const form = reactive({
  name: "",
  description: "",
  category: "通用",
  tagsInput: "",
  preview: "",
  prompt: "",
});

const templates = computed(() => store.templates || []);

const categories = computed(() => {
  const set = new Set(
    (templates.value || []).map((t) => t.category || "未分类")
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
      (t) => (t.category || "未分类") === categoryFilter.value
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
    list.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
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
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
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
  form.name = template.name || "";
  form.description = template.description || "";
  form.category = template.category || "通用";
  form.tagsInput = (template.tags || []).join(",");
  form.preview = template.preview || template.prompt || "";
  form.prompt = template.prompt || "";
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

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
  if (!f) return;

  const isText =
    /text|json|markdown|plain/.test(f.type) || /\.(txt|md|json)$/i.test(f.name);

  if (isText) {
    const reader = new FileReader();
    reader.onload = () => {
      reportRawContent.value = String(reader.result || "");
      form.preview = form.preview || reportRawContent.value.slice(0, 400);
    };
    reader.onerror = () => {
      reportError.value = "读取文件失败，请重试";
      reportRawContent.value = "";
    };
    reader.readAsText(f);
  } else {
    // 非文本文件，仍允许上传，但无法直接生成预览
    form.preview =
      form.preview || "（无法自动解析二进制文件，请后续补充提示词）";
  }
};

const submitForm = () => {
  const basePayload = {
    name: form.name,
    description: form.description,
    category: form.category,
    tags: parseTags(form.tagsInput),
    preview: form.preview,
    prompt: form.prompt,
    updatedAt: new Date().toISOString(),
  };

  if (isEditing.value && editingId.value) {
    store.updateTemplate(editingId.value, basePayload);
    showForm.value = false;
    return;
  }

  // 新建模板：必须上传样例文件，由样例生成提示词
  if (!reportFile.value) {
    reportError.value = "请先上传模板样例文件";
    return;
  }

  const hasText = Boolean(reportRawContent.value.trim());
  const derivedPrompt = hasText
    ? reportRawContent.value
    : `请参考文件 ${reportFile.value.name} 的内容生成摘要。`;
  const derivedPreview = hasText
    ? reportRawContent.value.slice(0, 400)
    : form.preview || "（无法自动生成预览，后续可补充）";

  const payload = {
    ...basePayload,
    prompt: derivedPrompt,
    preview: derivedPreview,
  };

  store.addTemplate(payload);
  showForm.value = false;
};

const remove = (template) => {
  const ok = window.confirm(`确定删除模板 “${template.name}” 吗？`);
  if (ok) {
    store.deleteTemplate(template.id);
  }
};

const duplicate = (template) => {
  store.duplicateTemplate(template.id);
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

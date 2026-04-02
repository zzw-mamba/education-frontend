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
      v-if="fetchTemplatesError"
      class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ fetchTemplatesError }}
    </div>

    <div
      v-if="isFetchingTemplates"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center"
    >
      <i class="fa fa-spinner fa-spin text-3xl text-secondary-400"></i>
      <p class="mt-3 text-secondary-700">正在加载模板...</p>
    </div>

    <div
      v-else-if="filteredTemplates.length === 0"
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
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-blue-50 shadow-sm"
                >
                  <img
                    v-if="template.iconPath"
                    :src="resolveIconPath(template.iconPath)"
                    alt="模板图标"
                    class="h-5 w-5 object-contain"
                  />
                  <i
                    v-else
                    class="fa fa-file-text-o text-sm text-primary-600"
                  ></i>
                </div>

                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="
                    template.userId === 0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
                  "
                >
                  {{ template.userId === 0 ? "系统模板" : "我的模板" }}
                </span>

                <span
                  class="max-w-[88px] truncate rounded-full bg-secondary-50 px-2 py-1 text-xs text-secondary-600"
                >
                  {{
                    formatCategory(template.categoryCode ?? template.category)
                  }}
                </span>
              </div>

              <span
                class="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-secondary-500"
              >
                <i class="fa fa-clock-o mr-1"></i
                >{{ formatDate(template.updatedAt) }}
              </span>
            </div>
            <h3 class="mt-2 text-lg font-semibold text-secondary-900">
              {{ template.name }}
            </h3>
            <p
              class="mt-1 truncate text-sm text-secondary-600"
              :title="template.description || '暂无描述'"
            >
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
          class="group/preview relative mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-secondary-700 shadow-inner"
        >
          <p class="text-xs font-medium text-secondary-500">模板预览</p>
          <p class="preview-text mt-1 line-clamp-3 whitespace-pre-line">
            {{
              formatPreviewText(
                template.preview || template.prompt || "暂无预览"
              )
            }}
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
          <span
            v-if="!(template.tags || []).length"
            class="text-xs text-secondary-500"
          >
            暂无标签
          </span>
        </div>

        <div
          class="mt-4 grid grid-cols-2 gap-2 text-sm font-medium text-secondary-700"
        >
          <button
            class="flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white py-2 transition hover:border-primary-200 hover:text-primary-700"
            @click="openDetail(template)"
          >
            <i class="fa fa-eye"></i>
            查看详情
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-xl border border-primary-200 bg-primary-50 py-2 text-primary-700 transition hover:bg-primary-100"
            @click="useTemplate(template)"
          >
            <i class="fa fa-play"></i>
            在流程中使用
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-xl border py-2 transition"
            :class="
              template.userId === 0
                ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                : 'border-gray-200 bg-white hover:border-primary-200 hover:text-primary-700'
            "
            :disabled="template.userId === 0"
            @click="template.userId !== 0 && openEdit(template)"
          >
            <i class="fa fa-pencil"></i>
            编辑
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-xl border py-2 transition"
            :class="
              template.userId === 0
                ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                : 'border-red-100 bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100'
            "
            :disabled="template.userId === 0"
            @click="template.userId !== 0 && remove(template)"
          >
            <i class="fa fa-trash"></i>
            删除
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showDetail"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-4"
      >
        <div
          class="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 p-6 pb-4"
          >
            <div>
              <p class="text-xs uppercase tracking-wide text-secondary-500">
                模板详情
              </p>
              <h2 class="text-xl font-semibold text-secondary-900">
                {{ detailTemplate?.name || "未命名模板" }}
              </h2>
            </div>
            <button
              class="rounded-full border border-gray-200 p-2 text-secondary-500 hover:border-primary-200 hover:text-primary-600"
              @click="closeDetail"
            >
              <i class="fa fa-close"></i>
            </button>
          </div>

          <div
            class="max-h-[65vh] space-y-4 overflow-y-auto p-6 pt-4 text-sm text-secondary-700"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  detailTemplate?.userId === 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-sky-100 text-sky-800 border border-sky-200'
                "
              >
                {{ detailTemplate?.userId === 0 ? "系统模板" : "我的模板" }}
              </span>
              <span
                class="rounded-full bg-secondary-50 px-2 py-1 text-xs text-secondary-600"
              >
                {{
                  formatCategory(
                    detailTemplate?.categoryCode ?? detailTemplate?.category
                  )
                }}
              </span>
            </div>

            <div>
              <p
                class="text-xs font-semibold uppercase tracking-wide text-secondary-500"
              >
                描述
              </p>
              <p class="mt-1 whitespace-pre-line">
                {{ detailTemplate?.description || "暂无描述" }}
              </p>
            </div>

            <div>
              <p
                class="text-xs font-semibold uppercase tracking-wide text-secondary-500"
              >
                样例
              </p>
              <pre
                class="mt-1 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-secondary-700"
                >{{
                  detailTemplate?.preview ||
                  detailTemplate?.example ||
                  "暂无样例"
                }}</pre
              >
            </div>

            <div>
              <p
                class="text-xs font-semibold uppercase tracking-wide text-secondary-500"
              >
                标签
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in detailTemplate?.tags || []"
                  :key="tag"
                  class="rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs text-secondary-700"
                >
                  #{{ tag }}
                </span>
                <span
                  v-if="!(detailTemplate?.tags || []).length"
                  class="text-xs text-secondary-500"
                >
                  暂无标签
                </span>
              </div>
            </div>

            <div>
              <p
                class="text-xs font-semibold uppercase tracking-wide text-secondary-500"
              >
                提示词
              </p>
              <pre
                class="mt-1 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-secondary-700"
                >{{ detailTemplate?.prompt || "暂无提示词" }}</pre
              >
            </div>
          </div>

          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100 p-6 pt-4"
          >
            <button class="btn-secondary" @click="closeDetail">关闭</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-4"
      >
        <div
          class="w-full max-w-3xl max-h-[95vh] flex flex-col rounded-2xl bg-white shadow-2xl"
        >
          <!-- 固定头部 -->
          <div
            class="flex items-center justify-between p-6 pb-4 border-b border-gray-100"
          >
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

          <!-- 可滚动内容区域 -->
          <div class="overflow-y-auto flex-1 p-6 pt-4">
            <div class="grid gap-4 md:grid-cols-2">
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
                  <select
                    v-model="form.category"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option
                      v-for="option in categoryOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="text-sm font-medium text-secondary-800"
                    >标签（labels）</label
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
                <div>
                  <label class="text-sm font-medium text-secondary-800"
                    >图标（icon_path）</label
                  >
                  <div
                    class="mt-1 grid max-h-32 grid-cols-5 gap-2 overflow-auto rounded-xl border border-gray-200 bg-white p-2"
                  >
                    <button
                      v-for="icon in iconOptions"
                      :key="icon.fileName"
                      type="button"
                      class="flex h-10 w-10 items-center justify-center rounded-lg border transition"
                      :class="
                        form.iconPath === icon.path
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-200'
                      "
                      @click="form.iconPath = icon.path"
                      :title="icon.fileName"
                    >
                      <img
                        :src="icon.url"
                        :alt="icon.fileName"
                        class="h-6 w-6 object-contain"
                      />
                    </button>
                  </div>
                  <p class="mt-1 text-xs text-secondary-500">
                    {{ form.iconPath }}
                  </p>
                </div>
                <div v-if="!isEditing && !isDuplicating" class="space-y-2">
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
                    v-if="isParsingReport"
                    class="rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-700 flex items-center gap-2"
                  >
                    <i class="fa fa-spinner fa-spin"></i>
                    正在解析模板样例，请稍候...
                  </div>
                  <div
                    v-if="reportError"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                  >
                    {{ reportError }}
                  </div>
                  <div
                    v-if="parsedTemplateData && !isParsingReport"
                    class="rounded-lg border border-green-100 bg-green-50 p-3 text-xs text-green-700"
                  >
                    <p class="mb-1 font-medium text-green-600">
                      <i class="fa fa-check-circle mr-1"></i>解析成功
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-secondary-800"
                    >提示词（prompt）</label
                  >
                  <textarea
                    v-model="form.prompt"
                    rows="6"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="编写用于生成摘要的完整提示词"
                  ></textarea>
                </div>
                <div v-if="reportRawContent" class="space-y-2">
                  <label
                    class="text-xs font-semibold uppercase tracking-wide text-secondary-500"
                    >样例内容（前400字）</label
                  >
                  <div
                    class="min-h-[100px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 shadow-inner"
                  >
                    <pre
                      class="max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-secondary-700"
                      >{{ reportRawContent.slice(0, 400) }}</pre
                    >
                  </div>
                </div>
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold uppercase tracking-wide text-secondary-500"
                    >样例（example）</label
                  >
                  <div
                    class="min-h-[120px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-secondary-800 shadow-inner"
                  >
                    <textarea
                      v-model="form.preview"
                      rows="5"
                      class="w-full resize-none bg-transparent text-sm leading-relaxed text-secondary-800 outline-none"
                      placeholder="填写样例内容"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 固定底部 -->
          <div
            class="p-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3"
          >
            <button
              class="btn-secondary"
              @click="closeForm"
              :disabled="isSubmitting"
            >
              取消
            </button>
            <button
              class="btn-primary"
              @click="submitForm"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting ? "提交中..." : isEditing ? "保存修改" : "创建模板"
              }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import { addTemplate, buildTemplate, getMyTemplates } from "../services/api";

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
const isParsingReport = ref(false);
const parsedTemplateData = ref(null);
const isSubmitting = ref(false);
const isFetchingTemplates = ref(false);
const fetchTemplatesError = ref("");
const isDuplicating = ref(false);
const showDetail = ref(false);
const detailTemplate = ref(null);
const form = reactive({
  name: "",
  description: "",
  category: 0,
  tagsInput: "",
  preview: "",
  prompt: "",
  iconPath: "",
});

const templates = computed(() => store.templates || []);

const iconModules = import.meta.glob("../assets/icons/*.svg", {
  eager: true,
  import: "default",
});

const iconAssetMap = Object.fromEntries(
  Object.entries(iconModules).map(([key, value]) => {
    const filename = key.split("/").pop();
    return [filename, value];
  })
);

const categoryOptions = [
  { value: 0, label: "通用" },
  { value: 1, label: "商业" },
  { value: 2, label: "技术" },
  { value: 3, label: "学术" },
];

const iconOptions = computed(() =>
  Object.keys(iconAssetMap)
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => ({
      fileName,
      url: iconAssetMap[fileName],
      path: `/assets/icons/${fileName}`,
    }))
);

const normalizeCategoryCode = (value) => {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
};

const formatCategory = (value) => {
  if (
    typeof value === "string" &&
    value.trim() &&
    Number.isNaN(Number(value))
  ) {
    return value.trim();
  }
  const item = categoryOptions.find(
    (option) => option.value === normalizeCategoryCode(value)
  );
  return item ? item.label : "未分类";
};

const resolveIconPath = (rawPath) => {
  if (!rawPath) return "";
  const normalized = String(rawPath).trim();
  if (!normalized) return "";

  if (/^(https?:|data:)/i.test(normalized)) {
    return normalized;
  }

  const filename = normalized.split("/").pop();
  if (filename && iconAssetMap[filename]) {
    return iconAssetMap[filename];
  }

  return normalized;
};

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

const fetchTemplateLibrary = async () => {
  isFetchingTemplates.value = true;
  fetchTemplatesError.value = "";

  try {
    const response = await getMyTemplates();
    const list = Array.isArray(response?.data) ? response.data : [];

    console.log(
      "[TemplateLibrary] icon_path(raw):",
      list.map((template) => ({
        id: template.id,
        name: template.name,
        icon_path: template.icon_path,
      }))
    );

    store.templates = list.map((template) => ({
      id: template.id,
      userId: template.user_id,
      name: template.name || "未命名模板",
      description: template.description || "",
      preview: template.example || template.prompt || "",
      prompt: template.prompt || "",
      categoryCode: normalizeCategoryCode(template.category),
      category: formatCategory(template.category),
      tags: normalizeTags(template.labels),
      iconPath: template.icon_path || "",
      createdAt: template.created_at || null,
      updatedAt: template.updated_at || template.created_at || null,
    }));

    console.log(
      "[TemplateLibrary] iconPath(mapped):",
      store.templates.map((template) => ({
        id: template.id,
        name: template.name,
        iconPath: template.iconPath,
      }))
    );
  } catch (error) {
    fetchTemplatesError.value =
      error.response?.data?.detail || "获取模板失败，请稍后重试";
  } finally {
    isFetchingTemplates.value = false;
  }
};

const categories = computed(() => {
  const set = new Set(
    (templates.value || []).map((t) =>
      formatCategory(t.categoryCode ?? t.category)
    )
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
      (t) =>
        formatCategory(t.categoryCode ?? t.category) === categoryFilter.value
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
      formatCategory(a.categoryCode ?? a.category).localeCompare(
        formatCategory(b.categoryCode ?? b.category)
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
  form.category = 0;
  form.tagsInput = "";
  form.preview = "";
  form.prompt = "";
  form.iconPath = "";
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
  isParsingReport.value = false;
  parsedTemplateData.value = null;
  isSubmitting.value = false;
  isDuplicating.value = false;
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
  form.category = normalizeCategoryCode(
    template.categoryCode ?? template.category
  );
  form.tagsInput = (template.tags || []).join(",");
  form.preview = template.preview || template.prompt || "";
  form.prompt = template.prompt || "";
  form.iconPath = template.iconPath || "";
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
  isParsingReport.value = false;
  parsedTemplateData.value = null;
  isDuplicating.value = false;
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

const handleReportChange = async (event) => {
  const f = event.target.files && event.target.files[0];
  reportError.value = "";
  reportRawContent.value = "";
  parsedTemplateData.value = null;
  reportFile.value = f || null;
  if (!f) return;

  const isText =
    /text|json|markdown|plain/.test(f.type) || /\.(txt|md|json)$/i.test(f.name);

  if (isText) {
    const reader = new FileReader();
    reader.onload = async () => {
      reportRawContent.value = String(reader.result || "");

      // 调用解析接口
      isParsingReport.value = true;
      try {
        const response = await buildTemplate(reportRawContent.value);
        const res = response.content;
        parsedTemplateData.value = res;

        // 将解析结果填充到表单
        if (res.name) form.name = res.name;
        if (res.description) form.description = res.description;
        if (res.category !== undefined) {
          // category 可能是数字，转换为字符串
          const categoryMap = {
            0: "通用",
            1: "商业",
            2: "技术",
            3: "学术",
          };
          form.category =
            categoryMap[res.category] || res.category.toString() || "通用";
        }
        if (res.prompt) {
          form.prompt = res.prompt;
          form.preview = res.prompt.slice(0, 400);
        }
      } catch (error) {
        console.error("解析模板失败:", error);
        reportError.value =
          error.response?.data?.detail || "解析模板失败，请重试";
        // 失败时使用原始内容
        form.preview = reportRawContent.value.slice(0, 400);
      } finally {
        isParsingReport.value = false;
      }
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

const submitForm = async () => {
  const basePayload = {
    name: form.name,
    description: form.description,
    category: normalizeCategoryCode(form.category),
    tags: parseTags(form.tagsInput),
    preview: form.preview,
    prompt: form.prompt,
    updatedAt: new Date().toISOString(),
  };

  if (isEditing.value && editingId.value) {
    store.updateTemplate(editingId.value, {
      ...basePayload,
      categoryCode: normalizeCategoryCode(form.category),
      category: formatCategory(form.category),
    });
    showForm.value = false;
    return;
  }

  const hasUploadedReport = Boolean(reportFile.value);
  const hasText = Boolean(reportRawContent.value.trim());

  const payload = hasUploadedReport
    ? {
        ...basePayload,
        prompt: hasText
          ? reportRawContent.value
          : `请参考文件 ${reportFile.value.name} 的内容生成摘要。`,
        preview: hasText
          ? reportRawContent.value.slice(0, 400)
          : form.preview || "（无法自动生成预览，后续可补充）",
      }
    : {
        ...basePayload,
        prompt: form.prompt || form.preview || "",
        preview: form.preview || form.prompt || "（暂无预览）",
      };

  // 后端模板入库
  isSubmitting.value = true;
  reportError.value = "";
  try {
    await addTemplate({
      name: payload.name,
      prompt: payload.prompt,
      category: normalizeCategoryCode(payload.category),
      description: payload.description,
      example: payload.preview,
      labels: parseTags(form.tagsInput).join(","),
      icon_path: form.iconPath || "",
    });
    store.addTemplate({
      ...payload,
      categoryCode: normalizeCategoryCode(form.category),
      category: formatCategory(form.category),
      iconPath: form.iconPath || "",
    });
    showForm.value = false;
  } catch (error) {
    reportError.value =
      error.response?.data?.detail || "模板保存失败，请稍后重试";
  } finally {
    isSubmitting.value = false;
  }
};

const remove = (template) => {
  const ok = window.confirm(`确定删除模板 “${template.name}” 吗？`);
  if (ok) {
    store.deleteTemplate(template.id);
  }
};

const duplicate = (template) => {
  isEditing.value = false;
  editingId.value = null;
  isDuplicating.value = true;
  form.name = `${template.name || "未命名模板"} 副本`;
  form.description = template.description || "";
  form.category = normalizeCategoryCode(
    template.categoryCode ?? template.category
  );
  form.tagsInput = (template.tags || []).join(",");
  form.preview = template.preview || template.prompt || "";
  form.prompt = template.prompt || "";
  form.iconPath = template.iconPath || "";
  reportFile.value = null;
  reportRawContent.value = "";
  reportError.value = "";
  isParsingReport.value = false;
  parsedTemplateData.value = null;
  showForm.value = true;
};

const openDetail = (template) => {
  detailTemplate.value = template;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  detailTemplate.value = null;
};

const useTemplate = (template) => {
  store.selectTemplate(template);
  router.push("/data-source");
};

const formatPreviewText = (value) => {
  const text = String(value || "");
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n")
    .replace(/[，,]\s*(输出[：:])/g, "\n$1")
    .replace(/\s*(输入[：:])/g, "\n$1")
    .replace(/^\n+/, "");
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

onMounted(() => {
  fetchTemplateLibrary();
});
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

.group\/preview:hover .preview-text {
  display: block;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
  overflow: visible;
}
</style>

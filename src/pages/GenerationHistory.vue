<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <section class="card p-6 md:p-8">
      <div
        class="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">生成历史</h1>
          <p class="text-secondary-500 mt-2">展示摘要生成日志。</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
          <label class="block">
            <span class="text-xs text-secondary-500">关键词</span>
            <input
              v-model.trim="keyword"
              type="text"
              placeholder="搜索 日志ID / 模板名 / 知识库ID"
              class="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </label>
          <label class="block">
            <span class="text-xs text-secondary-500">每页条数</span>
            <select
              v-model.number="pageSize"
              class="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    </section>

    <section class="card p-0 overflow-hidden">
      <div v-if="isLoading" class="py-16 text-center text-secondary-500">
        <i class="fa fa-circle-o-notch fa-spin mr-2"></i>
        正在加载生成历史...
      </div>

      <div v-else-if="pagedLogs.length === 0" class="py-16 text-center">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400 mb-4"
        >
          <i class="fa fa-history text-xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-secondary-700">暂无生成历史</h2>
        <p class="text-secondary-500 mt-2">
          当前筛选条件下没有可展示的日志记录。
        </p>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  class="text-left py-3 px-4 font-semibold text-secondary-700"
                >
                  日志ID
                </th>
                <th
                  class="text-left py-3 px-4 font-semibold text-secondary-700"
                >
                  模板名称
                </th>
                <th
                  class="text-left py-3 px-4 font-semibold text-secondary-700"
                >
                  知识库条目
                </th>
                <th
                  class="text-left py-3 px-4 font-semibold text-secondary-700"
                >
                  生成时间
                </th>
                <th
                  class="text-left py-3 px-4 font-semibold text-secondary-700"
                >
                  导出文件
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in pagedLogs"
                :key="row.log_id"
                class="border-b border-gray-100 hover:bg-primary-50/40 transition-colors"
              >
                <td class="py-3 px-4 text-secondary-800">{{ row.log_id }}</td>
                <td class="py-3 px-4 text-secondary-800">
                  {{ row.template_name || "-" }}
                </td>
                <td class="py-3 px-4 text-secondary-600">
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="kid in normalizeKnowledgeIds(row.knowledge_ids)"
                      :key="`${row.log_id}-${kid}`"
                      type="button"
                      class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs hover:bg-blue-100"
                      @click="previewKnowledge(kid)"
                    >
                      {{ kid }}
                    </button>
                    <span
                      v-if="
                        normalizeKnowledgeIds(row.knowledge_ids).length === 0
                      "
                      class="text-secondary-400"
                    >
                      -
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4 text-secondary-600">
                  {{ formatDate(row.created_at) }}
                </td>
                <td class="py-3 px-4">
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      class="px-2 py-1 rounded border border-gray-200 text-xs text-secondary-700 hover:bg-gray-50 disabled:opacity-40"
                      :disabled="!hasResultPath(row.result_path)"
                      @click="downloadResultFile(row, 'md')"
                    >
                      MD
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 rounded border border-gray-200 text-xs text-secondary-700 hover:bg-gray-50 disabled:opacity-40"
                      :disabled="!hasResultPath(row.result_path)"
                      @click="downloadResultFile(row, 'pdf')"
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 rounded border border-gray-200 text-xs text-secondary-700 hover:bg-gray-50 disabled:opacity-40"
                      :disabled="!hasResultPath(row.result_path)"
                      @click="downloadResultFile(row, 'docx')"
                    >
                      DOC
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 bg-gray-50"
        >
          <p class="text-xs text-secondary-500">
            共 {{ totalCount }} 条，当前第 {{ currentPage }} /
            {{ totalPages }} 页
          </p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="btn-secondary !py-1.5 !px-3"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              上一页
            </button>
            <button
              type="button"
              class="btn-primary !py-1.5 !px-3"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="previewVisible"
      class="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4"
      @click.self="closePreview"
    >
      <div
        class="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div
          class="px-4 py-3 border-b border-gray-200 flex items-center justify-between"
        >
          <h3 class="text-base font-semibold text-secondary-800">
            原文预览（知识库ID：{{ previewKnowledgeId || "-" }}）
          </h3>
          <button
            type="button"
            class="text-secondary-500 hover:text-secondary-800"
            @click="closePreview"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="h-[72vh] bg-gray-50">
          <div
            v-if="previewLoading"
            class="h-full flex items-center justify-center text-secondary-500"
          >
            <i class="fa fa-circle-o-notch fa-spin mr-2"></i>正在加载原文...
          </div>
          <div
            v-else-if="previewError"
            class="h-full flex items-center justify-center text-red-600 px-6 text-center"
          >
            {{ previewError }}
          </div>
          <iframe
            v-else-if="previewFileUrl"
            :src="previewFileUrl"
            class="w-full h-full"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAppStore } from "../store";
import api, { getKnowledgeFile } from "../services/api";

const store = useAppStore();

const isLoading = ref(false);
const logs = ref([]);
const keyword = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const previewVisible = ref(false);
const previewLoading = ref(false);
const previewError = ref("");
const previewFileUrl = ref("");
const previewKnowledgeId = ref(null);

const normalizeKnowledgeIds = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

const mapLocalHistory = () => {
  const selectedKnowledgeIds = (store.selectedDocuments || [])
    .map((doc) => doc.id)
    .filter(Boolean);
  return (store.summaryHistory || []).map((item, index) => ({
    log_id: item.id || `${Date.now()}-${index}`,
    created_at: item.date || new Date().toISOString(),
    template_id: item.templateId || store.selectedTemplate?.id || "-",
    template_name: store.selectedTemplate?.name || null,
    knowledge_ids: selectedKnowledgeIds,
    result_path: item.files?.markdown_path || item.files?.md_path || "",
  }));
};

const normalizePath = (value) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const withSlash = trimmed.replace(/\\/g, "/");
  return withSlash.startsWith("/") ? withSlash : `/${withSlash}`;
};

const hasResultPath = (resultPath) => {
  return Boolean(normalizePath(resultPath));
};

const buildExportPath = (resultPath, ext) => {
  const normalized = normalizePath(resultPath);
  if (!normalized) return "";

  if (normalized.endsWith(`.${ext}`)) return normalized;

  const withoutExt = normalized.replace(/\.[^/.]+$/, "");
  return `${withoutExt}.${ext}`;
};

const triggerBlobDownload = (blob, fileName) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};

const downloadResultFile = async (row, ext) => {
  const targetPath = buildExportPath(row.result_path, ext);
  if (!targetPath) return;

  try {
    const blob = await api.get(targetPath, { responseType: "blob" });
    const fileName = `${row.log_id || "summary"}.${ext}`;
    triggerBlobDownload(blob, fileName);
  } catch (error) {
    console.error("下载导出文件失败", error);
  }
};

const closePreview = () => {
  previewVisible.value = false;
  previewLoading.value = false;
  previewError.value = "";
  previewKnowledgeId.value = null;
  if (previewFileUrl.value) {
    URL.revokeObjectURL(previewFileUrl.value);
  }
  previewFileUrl.value = "";
};

const previewKnowledge = async (knowledgeId) => {
  closePreview();
  previewVisible.value = true;
  previewLoading.value = true;
  previewKnowledgeId.value = knowledgeId;

  try {
    const blob = await getKnowledgeFile(knowledgeId);
    previewFileUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error("预览原文失败", error);
    previewError.value = "原文预览失败，请稍后重试。";
  } finally {
    previewLoading.value = false;
  }
};

const fetchLogs = async () => {
  isLoading.value = true;
  try {
    const response = await api.get("/log/my", {
      params: {
        page: currentPage.value,
        page_size: pageSize.value,
      },
    });

    const rows = Array.isArray(response?.data) ? response.data : [];
    logs.value = rows;
    totalCount.value = Number(response?.pagination?.total || 0);

    if (currentPage.value > 1 && rows.length === 0) {
      currentPage.value = Math.max(1, currentPage.value - 1);
    }
  } catch (error) {
    // 后端接口不可用时，回退到本地摘要历史，保证界面可展示
    logs.value = mapLocalHistory();
    totalCount.value = logs.value.length;
  } finally {
    isLoading.value = false;
  }
};

const filteredLogs = computed(() => {
  const key = keyword.value.toLowerCase();
  const list = [...logs.value].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (!key) return list;

  return list.filter((item) => {
    const kIds = normalizeKnowledgeIds(item.knowledge_ids)
      .join(",")
      .toLowerCase();
    return (
      String(item.log_id || "")
        .toLowerCase()
        .includes(key) ||
      String(item.template_name || "")
        .toLowerCase()
        .includes(key) ||
      kIds.includes(key)
    );
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / pageSize.value))
);

const pagedLogs = computed(() => filteredLogs.value);

watch(keyword, () => {
  currentPage.value = 1;
});

watch([currentPage, pageSize], () => {
  fetchLogs();
});

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
:deep(button:disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>

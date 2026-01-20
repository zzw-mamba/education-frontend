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

        <!-- Step 2: Active -->
        <div class="flex flex-col items-center relative group cursor-default">
          <div
            class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 ring-4 ring-white z-10 transition-transform group-hover:scale-105"
          >
            2
          </div>
          <div
            class="absolute -bottom-8 w-32 text-center text-sm font-bold text-primary-700"
          >
            文档处理
          </div>
        </div>

        <!-- Line: Gray -->
        <div class="flex-1 h-0.5 bg-gray-200 mx-2 rounded"></div>

        <!-- Step 3: Inactive -->
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
    <h1 class="text-3xl font-bold mb-6">OCR文档识别</h1>
    <p class="text-secondary-600 mb-8">
      上传本地文档进行OCR识别，支持中、英、俄三语混合识别，自动提取图片中的文字信息。
    </p>

    <!-- 提示：文件来自“选择数据源”步骤 -->
    <div class="border rounded-lg p-6 bg-yellow-50 border-yellow-200 mb-6">
      <div class="flex items-start gap-4">
        <i class="fa fa-info-circle text-yellow-600 text-2xl mt-1"></i>
        <div>
          <p class="font-medium text-yellow-800">
            请在“选择数据源”步骤上传本地文档
          </p>
          <p class="text-sm text-yellow-700">
            当前页面将使用已上传的文件进行 OCR 识别，无需在此重复上传。
          </p>
        </div>
      </div>
    </div>

    <!-- 上传文件列表（来自选择数据源） -->
    <div
      v-if="store.uploadedFiles && store.uploadedFiles.length > 0"
      class="mb-8"
    >
      <h3 class="text-xl font-semibold mb-4">
        已上传文件 ({{ store.uploadedFiles.length }})
      </h3>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
              >
                文件名
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
              >
                大小
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
              >
                状态
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="file in store.uploadedFiles"
              :key="file.name + file.size"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i
                    class="fa fa-file-pdf-o text-red-500 mr-3 text-xl"
                    v-if="file.name.endsWith('.pdf')"
                  ></i>
                  <i
                    class="fa fa-file-image-o text-green-500 mr-3 text-xl"
                    v-else-if="
                      file.name.endsWith('.jpg') ||
                      file.name.endsWith('.jpeg') ||
                      file.name.endsWith('.png')
                    "
                  ></i>
                  <div>
                    <div class="text-sm font-medium text-secondary-900">
                      {{ file.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600"
              >
                {{ formatFileSize(file.size) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="store.isLoading" class="badge badge-warning">
                  <i class="fa fa-spinner fa-spin mr-1"></i> 处理中
                </span>
                <span
                  v-else-if="
                    store.ocrResults &&
                    store.ocrResults.find((r) => r.fileName === file.name)
                  "
                  class="badge badge-success"
                >
                  <i class="fa fa-check mr-1"></i> 已完成
                </span>
                <span v-else class="badge badge-secondary">待识别</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="removeFile(file)"
                  class="text-red-600 hover:text-red-900"
                >
                  <i class="fa fa-trash-o mr-1"></i> 删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- OCR识别结果 -->
    <div v-if="store.ocrResults && store.ocrResults.length > 0" class="mb-8">
      <h3 class="text-xl font-semibold mb-4">OCR识别结果</h3>
      <div class="space-y-6">
        <div v-for="result in store.ocrResults" :key="result.id" class="card">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-semibold text-secondary-900">
                {{ result.fileName }}
              </h4>
              <div class="mt-1 flex flex-wrap gap-2 text-xs text-secondary-500">
                <span
                  v-if="result.pages"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100"
                >
                  <i class="fa fa-file-text-o"></i>
                  {{ result.pages }} 页
                </span>
                <span
                  v-if="result.fileSize"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 text-secondary-600 border border-slate-200"
                >
                  <i class="fa fa-database"></i>
                  {{ formatFileSize(result.fileSize) }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="openPreviewDialog(result)"
                class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors"
                title="放大预览"
              >
                <i class="fa fa-search-plus mr-1"></i> 放大预览
              </button>
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-100"
              >
                <i class="fa fa-check mr-1"></i> 已处理
              </span>
            </div>
          </div>
          <div
            class="border border-gray-200 bg-white rounded-xl mb-4 max-h-72 overflow-y-auto shadow-sm"
          >
            <v-md-preview
              v-if="result.isMarkdown"
              :text="result.markdown || result.content"
              class="text-sm"
            ></v-md-preview>
            <p
              v-else
              class="text-secondary-700 text-sm whitespace-pre-wrap p-4"
            >
              {{ result.content }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between">
      <router-link to="/data-source" class="btn-secondary">
        <i class="fa fa-arrow-left mr-2"></i> 上一步
      </router-link>
      <button
        @click="nextStep"
        class="btn-primary"
        :disabled="
          !(store.ocrResults && store.ocrResults.length > 0) || store.isLoading
        "
      >
        下一步 <i class="fa fa-arrow-right ml-2"></i>
      </button>
    </div>

    <!-- 放大预览弹窗 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="previewDialogTitle"
      width="80%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div
        class="max-h-[70vh] overflow-y-auto border border-gray-200 rounded-lg bg-white"
      >
        <v-md-preview
          v-if="currentPreview && currentPreview.isMarkdown"
          :text="currentPreview.markdown || currentPreview.content"
        ></v-md-preview>
        <p
          v-else-if="currentPreview"
          class="text-secondary-700 whitespace-pre-wrap p-6"
        >
          {{ currentPreview.content }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";
import { onMounted } from "vue";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import hljs from "highlight.js";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/npm";

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
VMdPreview.use(createKatexPlugin());

const router = useRouter();
const store = useAppStore();

// 预览弹窗相关状态
const previewDialogVisible = ref(false);
const currentPreview = ref(null);
const previewDialogTitle = ref("");

// 打开预览弹窗
const openPreviewDialog = (result) => {
  currentPreview.value = result;
  previewDialogTitle.value = `预览: ${result.fileName}`;
  previewDialogVisible.value = true;
};

// 不在此步骤上传文件，使用上一步选择的数据源中的文件

// 移除文件（委托给 store）
const removeFile = (file) => {
  store.removeUploadedFile(file.name);
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
};

// 当进入页面且有上传文件但尚未生成 ocrResults 时，触发识别
onMounted(() => {
  if (store.uploadedFiles && store.uploadedFiles.length > 0) {
    // 如果尚未识别或识别结果与上传文件数量不匹配，则触发识别
    const resultsCount = store.ocrResults ? store.ocrResults.length : 0;
    if (resultsCount === 0 || resultsCount < store.uploadedFiles.length) {
      store.processOcr();
    }
  }
});

// 下一步
const nextStep = () => {
  if (store.ocrResults && store.ocrResults.length > 0) {
    router.push("/template-select");
    store.nextStep();
  }
};
</script>

<style scoped>
/* v-md-editor 预览容器的样式调整 */
:deep(.v-md-editor-preview) {
  padding: 16px;
}
</style>

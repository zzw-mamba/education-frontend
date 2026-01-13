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
        <div class="progress-step active">
          <div class="progress-step-number">2</div>
          <span class="ml-2 text-sm text-secondary-600">文档处理</span>
        </div>
        <div class="progress-step-line"></div>
        <div class="progress-step">
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
          <div class="flex justify-between items-start mb-4">
            <h4 class="font-semibold text-secondary-900">
              {{ result.fileName }}
            </h4>
            <div class="flex space-x-2">
              <span class="badge badge-primary">{{ result.pages }} 页</span>
              <span class="badge badge-success"
                >置信度: {{ result.confidence }}%</span
              >
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
            <p class="text-secondary-700 text-sm whitespace-pre-wrap">
              {{ result.content }}
            </p>
          </div>
          <div class="flex justify-end">
            <button class="btn-secondary text-sm">
              <i class="fa fa-eye mr-1"></i> 查看完整结果
            </button>
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";

const router = useRouter();
const store = useAppStore();

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
import { onMounted } from "vue";
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
/* 可以在这里添加OCR上传页面特定的样式 */
</style>

<template>
  <el-dialog
    v-model="isVisible"
    :width="440"
    :show-close="false"
    :before-close="handleClose"
    align-center
    class="auth-dialog"
    destroy-on-close
  >
    <div class="space-y-6">
      <!-- 头部 -->
      <div class="text-center">
        <!-- 装饰背景 -->
        <div
          class="absolute inset-0 flex justify-center items-start opacity-20 pointer-events-none"
        >
          <div
            class="w-32 h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full blur-[80px]"
          ></div>
        </div>

        <!-- 图标 -->
        <div
          class="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg mb-4 text-white shadow-lg shadow-primary-500/30"
        >
          <i class="fa fa-lock text-2xl"></i>
        </div>

        <h3
          class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-secondary-700 mb-2"
        >
          需要登录
        </h3>
        <p class="text-sm text-secondary-500">登录以使用完整功能</p>
      </div>

      <!-- 功能说明 -->
      <div
        class="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200/50"
      >
        <p class="text-sm text-secondary-600">
          <i class="fa fa-star text-primary-600 mr-2"></i>
          <span class="font-medium">登录后可以：</span>
        </p>
        <ul class="mt-2 space-y-1 text-xs text-secondary-600 ml-5">
          <li>• 访问知识库文档</li>
          <li>• 上传并识别文件</li>
          <li>• 生成专业摘要</li>
        </ul>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="flex gap-3 justify-end">
        <el-button @click="handleCancel" class="cancel-btn"> 取消 </el-button>
        <el-button type="primary" @click="handleConfirm" class="confirm-btn">
          <i class="fa fa-sign-in mr-2"></i>立即登录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isVisible = ref(false);
const pendingRoute = ref(null);
const router = useRouter();

const emit = defineEmits(["confirm", "cancel"]);

const handleConfirm = () => {
  isVisible.value = false;
  if (pendingRoute.value) {
    router.push({
      path: "/login",
      query: { redirect: pendingRoute.value },
    });
  } else {
    router.push("/login");
  }
  emit("confirm");
};

const handleCancel = () => {
  isVisible.value = false;
  emit("cancel");
};

const handleClose = (done) => {
  done();
  emit("cancel");
};

const show = (route) => {
  pendingRoute.value = route;
  isVisible.value = true;
};

defineExpose({
  show,
  isVisible,
});
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15) !important;
  border: 1px solid rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(10px);
}

:deep(.el-dialog__header) {
  border-bottom: none;
  padding: 0;
}

:deep(.el-dialog__body) {
  padding: 40px 32px;
  position: relative;
  overflow: hidden;
}

:deep(.el-dialog__footer) {
  padding: 0 32px 32px;
  border-top: none;
}

.cancel-btn {
  background-color: transparent;
  color: #667eea;
  border: 1.5px solid #667eea;
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: #f8f9ff;
  color: #5568d3;
  border-color: #5568d3;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f99 100%);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

:deep(.el-button) {
  border-radius: 8px;
  min-width: 100px;
  font-size: 14px;
}
</style>

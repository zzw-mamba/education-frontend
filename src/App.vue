<template>
  <div
    class="min-h-screen flex flex-col font-sans text-secondary-900 bg-gradient-to-br from-slate-50 via-gray-100 to-gray-200 relative overflow-hidden"
  >
    <!-- 全局背景装饰 -->
    <div class="fixed inset-0 -z-10 pointer-events-none">
      <div
        class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-100/30 blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[120px]"
      ></div>
      <div
        class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"
      ></div>
    </div>

    <!-- 顶部导航栏 -->
    <header
      class="fixed top-0 w-full z-50 glass shadow-sm transition-all duration-300 backdrop-blur-md bg-white/70"
    >
      <div class="container-custom py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-3 group">
          <div
            class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300"
          >
            <i class="fa fa-file-text-o text-xl"></i>
          </div>
          <h1
            class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-secondary-700"
          >
            文档摘要工具
          </h1>
        </router-link>

        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="text-base font-semibold text-secondary-600 hover:text-primary-600 transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-gradient-to-r after:from-primary-500 after:to-primary-600 after:transition-all after:duration-300 hover:after:w-full tracking-wide"
            active-class="text-primary-600 after:w-full"
          >
            首页
          </router-link>
          <router-link
            to="/data-source"
            class="text-base font-semibold text-secondary-600 hover:text-primary-600 transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-gradient-to-r after:from-primary-500 after:to-primary-600 after:transition-all after:duration-300 hover:after:w-full tracking-wide"
            active-class="text-primary-600 after:w-full"
          >
            开始使用
          </router-link>
          <router-link
            to="/template-library"
            class="text-base font-semibold text-secondary-600 hover:text-primary-600 transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-gradient-to-r after:from-primary-500 after:to-primary-600 after:transition-all after:duration-300 hover:after:w-full tracking-wide"
            active-class="text-primary-600 after:w-full"
          >
            模板库
          </router-link>
          <a
            href="#"
            class="text-base font-semibold text-secondary-600 hover:text-primary-600 transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-gradient-to-r after:from-primary-500 after:to-primary-600 after:transition-all after:duration-300 hover:after:w-full tracking-wide"
            >帮助文档</a
          >
        </nav>

        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center space-x-3">
            <router-link
              v-if="!store.isAuthenticated"
              to="/login"
              class="px-4 py-2 text-base font-semibold text-secondary-700 hover:text-primary-600 transition-all duration-300"
            >
              登录
            </router-link>
            <router-link
              v-if="!store.isAuthenticated"
              to="/register"
              class="px-4 py-2 text-base font-semibold text-white bg-primary-600 rounded-lg shadow-md shadow-primary-500/30 hover:bg-primary-700 transition-all duration-300"
            >
              注册
            </router-link>
            <router-link
              v-if="store.isAuthenticated"
              to="/profile"
              class="px-4 py-2 text-base font-semibold text-secondary-700 border-2 border-gray-300 rounded-lg hover:text-primary-600 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <i class="fa fa-user-circle"></i>
              <span>个人中心</span>
            </router-link>
            <button
              v-if="store.isAuthenticated"
              type="button"
              class="logout-danger-btn px-4 py-2 text-base font-semibold text-red-600 border-2 border-red-300 rounded-lg hover:text-red-700 hover:border-red-400 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2 focus:outline-none"
              @click="openLogoutConfirm"
            >
              <i class="fa fa-sign-out"></i>
              <span>退出登录</span>
            </button>
          </div>
          <button
            class="md:hidden text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <i class="fa fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 pt-24 pb-12 px-4 sm:px-6 relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部信息 -->
    <footer class="bg-white border-t border-gray-100 py-12 mt-auto">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-2 mb-4 md:mb-0">
            <i class="fa fa-file-text-o text-primary-600 text-xl"></i>
            <span class="font-bold text-secondary-800">文档摘要工具</span>
            <span class="text-secondary-400 text-sm ml-2">| 版本 1.0.0</span>
          </div>
          <div class="flex space-x-8">
            <a
              href="#"
              class="text-sm text-secondary-500 hover:text-primary-600 transition-colors flex items-center"
            >
              <i class="fa fa-question-circle mr-2"></i> 帮助中心
            </a>
            <a
              href="#"
              class="text-sm text-secondary-500 hover:text-primary-600 transition-colors flex items-center"
            >
              <i class="fa fa-envelope-o mr-2"></i> 联系我们
            </a>
            <a
              href="#"
              class="text-sm text-secondary-500 hover:text-primary-600 transition-colors flex items-center"
            >
              <i class="fa fa-github mr-2"></i> GitHub
            </a>
          </div>
        </div>
        <div class="mt-8 text-center md:text-left text-xs text-secondary-400">
          <p>© 2025 Intelligent Document Summarizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <!-- 认证对话框 -->
    <auth-dialog ref="authDialogRef" />

    <!-- 退出确认弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLogoutConfirm"
          class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/35 px-4"
          @click.self="closeLogoutConfirm"
        >
          <div class="w-full max-w-md rounded-2xl border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur-md">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <i class="fa fa-sign-out"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-secondary-900">确认退出登录？</h3>
                <p class="mt-1 text-sm text-secondary-600">
                  退出后将清除当前登录状态，你可以稍后重新登录继续使用。
                </p>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                class="logout-cancel-btn px-4 py-2 text-sm font-semibold text-secondary-700 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors focus:outline-none"
                @click="closeLogoutConfirm"
              >
                取消
              </button>
              <button
                type="button"
                class="logout-danger-btn px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg border-2 border-red-300 shadow-md shadow-red-500/20 hover:bg-red-700 hover:border-red-400 transition-colors focus:outline-none"
                @click="confirmLogout"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { useAppStore } from "./store";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import AuthDialog from "./components/AuthDialog.vue";

const store = useAppStore();
const router = useRouter();
const authDialogRef = ref(null);
const showLogoutConfirm = ref(false);

const openLogoutConfirm = () => {
  showLogoutConfirm.value = true;
};

const closeLogoutConfirm = () => {
  showLogoutConfirm.value = false;
};

const handleGlobalKeydown = (event) => {
  if (event.key === "Escape" && showLogoutConfirm.value) {
    closeLogoutConfirm();
  }
};

const confirmLogout = () => {
  showLogoutConfirm.value = false;
  store.logout();
  router.push("/");
};

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});

// 暴露给路由守卫使用
globalThis.$authDialog = authDialogRef;
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.logout-danger-btn:focus,
.logout-danger-btn:focus-visible,
.logout-danger-btn:active {
  outline: none !important;
  box-shadow: none !important;
}

.logout-cancel-btn:focus,
.logout-cancel-btn:focus-visible,
.logout-cancel-btn:active {
  outline: none !important;
  box-shadow: none !important;
}
</style>

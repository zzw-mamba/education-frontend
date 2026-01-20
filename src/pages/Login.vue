<template>
  <div class="container-custom py-16">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
      <div
        class="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 text-white p-10 shadow-2xl"
      >
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]"
        ></div>
        <div
          class="absolute -top-12 -left-10 w-60 h-60 bg-white/15 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-16 right-0 w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl"
        ></div>
        <div class="relative space-y-6">
          <div
            class="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-sm font-semibold"
          >
            <span
              class="w-2 h-2 rounded-full bg-emerald-300 mr-2 animate-pulse"
            ></span>
            安全可靠的身份验证
          </div>
          <h1 class="text-3xl lg:text-4xl font-bold leading-tight">
            登录您的账户
          </h1>
          <p class="text-blue-50 text-lg leading-relaxed">
            统一的账户体系帮助你在知识库、模板库与摘要生成之间无缝切换，保持数据与偏好一致。
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div
              class="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur shadow-lg"
            >
              <div class="text-2xl font-semibold">99.9%</div>
              <div class="text-sm text-blue-100">服务可用性保障</div>
            </div>
            <div
              class="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur shadow-lg"
            >
              <div class="text-2xl font-semibold">多因素</div>
              <div class="text-sm text-blue-100">登录安全校验</div>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <span
              class="h-10 w-10 flex items-center justify-center rounded-full bg-white/15 border border-white/20 text-white"
            >
              <i class="fa fa-lock"></i>
            </span>
            <span class="text-sm text-blue-100"
              >数据在传输与存储环节均经过加密保护</span
            >
          </div>
        </div>
      </div>

      <div class="lg:col-span-3">
        <div
          class="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-2xl shadow-primary-500/10 p-8 lg:p-10 space-y-8"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">欢迎回来</h2>
              <p class="text-secondary-500 mt-1">请输入您的账户信息以继续</p>
            </div>
            <router-link
              to="/register"
              class="text-primary-600 text-sm font-semibold hover:underline"
            >
              还没有账户？去注册
            </router-link>
          </div>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >用户名 / 邮箱</label
              >
              <div class="relative">
                <span class="absolute left-4 top-3 text-secondary-400">
                  <i class="fa fa-user"></i>
                </span>
                <input
                  v-model="loginForm.username"
                  type="text"
                  required
                  placeholder="用户名或邮箱"
                  class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white/80"
                />
              </div>
            </div>

            <div class="space-y-2">
              <div
                class="flex items-center justify-between text-sm font-semibold text-secondary-700"
              >
                <label>密码</label>
                <a href="#" class="text-primary-600 hover:underline"
                  >忘记密码？</a
                >
              </div>
              <div class="relative">
                <span class="absolute left-4 top-3 text-secondary-400">
                  <i class="fa fa-lock"></i>
                </span>
                <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  minlength="6"
                  placeholder="至少 6 位字符"
                  class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white/80"
                />
              </div>
            </div>

            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center space-x-2 text-secondary-600">
                <input
                  v-model="loginForm.remember"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>记住登录状态</span>
              </label>
              <div class="flex items-center space-x-2 text-secondary-500">
                <span class="w-2 h-2 rounded-full bg-green-400"></span>
                <span>已启用设备安全校验</span>
              </div>
            </div>

            <div v-if="errorMessage" class="text-sm text-red-500">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="store.isLoading"
              class="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="store.isLoading" class="flex items-center gap-2">
                <i class="fa fa-spinner fa-spin"></i> 正在登录...
              </span>
              <span v-else class="flex items-center gap-2">
                立即登录
                <i class="fa fa-arrow-right text-sm"></i>
              </span>
            </button>
          </form>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="flex-1 h-px bg-gray-200"></span>
              <span
                class="text-xs uppercase text-secondary-400 tracking-[0.2em]"
                >或</span
              >
              <span class="flex-1 h-px bg-gray-200"></span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                class="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:border-primary-200 hover:text-primary-600 transition-colors bg-white/80"
              >
                <i class="fa fa-github"></i>
                <span class="font-semibold text-sm">GitHub</span>
              </button>
              <button
                class="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:border-primary-200 hover:text-primary-600 transition-colors bg-white/80"
              >
                <i class="fa fa-wechat"></i>
                <span class="font-semibold text-sm">微信扫码</span>
              </button>
              <button
                class="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:border-primary-200 hover:text-primary-600 transition-colors bg-white/80"
              >
                <i class="fa fa-envelope-o"></i>
                <span class="font-semibold text-sm">邮件验证码</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";

const router = useRouter();
const store = useAppStore();
const errorMessage = ref("");

const loginForm = reactive({
  username: "",
  password: "",
  remember: true,
});

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    const response = await store.login({
      username: loginForm.username,
      password: loginForm.password,
    });
    // 登录成功后，根据查询参数决定是否跳转回原页面
    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/profile");
    }
    // 可选：记住登录用户名
    if (loginForm.remember) {
      localStorage.setItem("remember_username", loginForm.username);
    }
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.detail || err.message || "登录失败";
  }
};
</script>

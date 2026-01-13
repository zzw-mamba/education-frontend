<template>
  <div class="container-custom py-16">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
      <div
        class="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-2xl shadow-primary-500/10 p-8 xl:p-10 space-y-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-secondary-900">创建新账户</h2>
            <p class="text-secondary-500 mt-1">
              加入后即可同步模板、偏好与历史记录
            </p>
          </div>
          <router-link
            to="/login"
            class="text-primary-600 text-sm font-semibold hover:underline"
          >
            已有账户？去登录
          </router-link>
        </div>

        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-secondary-700"
              >用户名</label
            >
            <input
              v-model="registerForm.username"
              type="text"
              required
              placeholder="用于登录与唯一标识"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white/80"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-secondary-700">邮箱</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              placeholder="name@example.com"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white/80"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >密码</label
              >
              <input
                v-model="registerForm.password"
                type="password"
                required
                minlength="8"
                placeholder="至少 8 位，含大小写与数字"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white/80"
              />
              <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  :class="passwordStrength.barClass"
                  class="h-full transition-all"
                  :style="{ width: passwordStrength.percent + '%' }"
                ></div>
              </div>
              <div class="text-xs text-secondary-500">
                {{ passwordStrength.label }}
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >确认密码</label
              >
              <input
                v-model="registerForm.confirm"
                type="password"
                required
                minlength="8"
                placeholder="再次输入密码"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white/80"
              />
              <p v-if="showMismatch" class="text-xs text-red-500">
                两次密码输入不一致
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3 text-sm text-secondary-600">
            <input
              v-model="registerForm.agree"
              type="checkbox"
              class="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span
              >我已阅读并同意
              <a href="#" class="text-primary-600 font-semibold hover:underline"
                >用户协议</a
              >
              与
              <a href="#" class="text-primary-600 font-semibold hover:underline"
                >隐私政策</a
              ></span
            >
          </div>

          <button
            type="submit"
            :disabled="!registerForm.agree || store.isLoading"
            class="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="store.isLoading" class="flex items-center gap-2">
              <i class="fa fa-spinner fa-spin"></i> 提交中...
            </span>
            <span v-else class="flex items-center gap-2">
              创建账户
              <i class="fa fa-check text-sm"></i>
            </span>
          </button>

          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </form>
      </div>

      <div class="space-y-6">
        <div
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-900 via-primary-900 to-primary-700 text-white p-8 shadow-2xl"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.1),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_25%)]"
          ></div>
          <div class="relative space-y-4">
            <div class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-lg"
              >
                <i class="fa fa-shield"></i>
              </span>
              <div>
                <p class="text-sm text-blue-100">安全与隐私</p>
                <h3 class="text-xl font-bold">企业级合规</h3>
              </div>
            </div>
            <ul class="space-y-3 text-blue-50 text-sm">
              <li class="flex items-start gap-2">
                <i class="fa fa-check mt-1 text-emerald-300"></i>
                <span>基于角色的访问控制与审计日志，确保敏感信息可追踪</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="fa fa-check mt-1 text-emerald-300"></i>
                <span>支持 SSO / OAuth2，对接企业统一身份平台</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="fa fa-check mt-1 text-emerald-300"></i>
                <span>传输与存储全程加密，多副本容灾保障业务连续性</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            class="p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-100 shadow-lg"
          >
            <div class="text-xl font-bold text-secondary-900">模板同步</div>
            <p class="text-sm text-secondary-500 mt-2">
              跨设备同步自定义摘要模板与提示词，快速复用最佳实践。
            </p>
          </div>
          <div
            class="p-5 rounded-2xl bg-white/70 backdrop-blur border border-gray-100 shadow-lg"
          >
            <div class="text-xl font-bold text-secondary-900">偏好继承</div>
            <p class="text-sm text-secondary-500 mt-2">
              登录后继承字体、版式与输出格式偏好，减少重复配置。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../store";

const router = useRouter();
const store = useAppStore();
const errorMessage = ref("");

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirm: "",
  agree: false,
});

const passwordStrength = computed(() => {
  const value = registerForm.password;
  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^\da-zA-Z]/.test(value);
  const score =
    [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length +
    (value.length >= 12 ? 1 : 0);

  if (!value)
    return { label: "密码强度未检测", percent: 0, barClass: "bg-gray-200" };
  if (score >= 4)
    return {
      label: "强：符合复杂度要求",
      percent: 100,
      barClass: "bg-emerald-500",
    };
  if (score >= 3)
    return {
      label: "中：建议加入符号或大写字母",
      percent: 70,
      barClass: "bg-amber-500",
    };
  return { label: "弱：请提升密码复杂度", percent: 40, barClass: "bg-red-500" };
});

const showMismatch = computed(
  () => registerForm.confirm && registerForm.confirm !== registerForm.password
);

const handleRegister = async () => {
  if (showMismatch.value) return;
  errorMessage.value = "";
  try {
    await store.registerUser({
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
    });
    router.push("/login");
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.detail || err.message || "注册失败";
  }
};
</script>

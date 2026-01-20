<template>
  <div class="container-custom py-16 space-y-10">
    <div
      v-if="errorMessage"
      class="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm"
    >
      {{ errorMessage }}
    </div>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="lg:w-1/3 space-y-6">
        <div
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 text-white p-8 shadow-2xl"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.12),transparent_30%)]"
          ></div>
          <div class="relative space-y-4">
            <div
              class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold"
            >
              {{ initials }}
            </div>
            <div>
              <h2 class="text-2xl font-bold">{{ profile.username }}</h2>
            </div>
            <div class="space-y-2 text-sm text-blue-50">
              <div class="flex items-center gap-2">
                <i class="fa fa-envelope"></i><span>{{ profile.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa fa-phone"></i
                ><span>{{ profile.phone || "未绑定手机号" }}</span>
              </div>
            </div>
            <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
              状态：已验证邮箱
            </div>
          </div>
        </div>

        <div
          class="p-6 rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-xl space-y-4"
        >
          <h3 class="text-lg font-bold text-secondary-900">通知偏好</h3>
          <div class="space-y-3 text-sm text-secondary-700">
            <label
              class="flex items-center justify-between py-3 px-4 rounded-2xl border border-gray-100 hover:border-primary-200 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"
                >
                  <i class="fa fa-envelope"></i>
                </span>
                <div>
                  <div class="font-semibold">邮件通知</div>
                  <div class="text-secondary-500 text-xs">
                    摘要生成完成、导出结果时提醒
                  </div>
                </div>
              </div>
              <input
                v-model="profile.notifyEmail"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label
              class="flex items-center justify-between py-3 px-4 rounded-2xl border border-gray-100 hover:border-primary-200 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"
                >
                  <i class="fa fa-mobile"></i>
                </span>
                <div>
                  <div class="font-semibold">短信提醒</div>
                  <div class="text-secondary-500 text-xs">
                    仅用于关键安全提示
                  </div>
                </div>
              </div>
              <input
                v-model="profile.notifySms"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label
              class="flex items-center justify-between py-3 px-4 rounded-2xl border border-gray-100 hover:border-primary-200 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"
                >
                  <i class="fa fa-bell"></i>
                </span>
                <div>
                  <div class="font-semibold">站内推送</div>
                  <div class="text-secondary-500 text-xs">
                    任务进度、协作动态
                  </div>
                </div>
              </div>
              <input
                v-model="profile.notifyInApp"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="lg:flex-1 space-y-6">
        <div
          class="p-8 rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-xl space-y-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-secondary-900">基本信息</h3>
              <p class="text-secondary-500 text-sm">
                这些信息将用于生成摘要的签名与导出文档属性
              </p>
            </div>
            <span
              class="px-3 py-1.5 text-xs rounded-full bg-primary-50 text-primary-600 border border-primary-100"
              >已自动保存</span
            >
          </div>
          <form class="space-y-4" @submit.prevent="handleSaveProfile">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-secondary-700"
                  >姓名</label
                >
                <input
                  v-model="profile.name"
                  type="text"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-secondary-700"
                  >邮箱</label
                >
                <input
                  v-model="profile.email"
                  type="email"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-secondary-700"
                  >手机号</label
                >
                <input
                  v-model="profile.phone"
                  type="tel"
                  placeholder="可用于二次验证"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-secondary-700"
                  >所在地</label
                >
                <input
                  v-model="profile.location"
                  type="text"
                  placeholder="城市/时区"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >个人简介</label
              >
              <textarea
                v-model="profile.bio"
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white resize-none"
                placeholder="一句话介绍自己，便于协作者了解你的角色与专长"
              ></textarea>
            </div>
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                class="px-4 py-2 rounded-xl border border-gray-200 text-secondary-700 hover:border-primary-200 hover:text-primary-600 transition-colors"
              >
                重置
              </button>
              <button
                type="submit"
                class="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold shadow-md shadow-primary-500/20 hover:bg-primary-700 transition-colors"
              >
                保存信息
              </button>
            </div>
          </form>
        </div>

        <div
          class="p-8 rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-xl space-y-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-secondary-900">安全设置</h3>
              <p class="text-secondary-500 text-sm">
                定期更新密码，提升账户安全等级
              </p>
            </div>
            <span
              class="px-3 py-1.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100"
              >安全评分：高</span
            >
          </div>
          <form
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
            @submit.prevent="handleUpdatePassword"
          >
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >当前密码</label
              >
              <input
                v-model="security.current"
                type="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >新密码</label
              >
              <input
                v-model="security.next"
                type="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-secondary-700"
                >确认新密码</label
              >
              <input
                v-model="security.confirm"
                type="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-white"
              />
            </div>
            <div class="md:col-span-3 flex items-center justify-between pt-1">
              <div class="text-xs text-secondary-500">
                建议包含大小写、数字与符号，长度不少于 12 位。
              </div>
              <button
                type="submit"
                class="px-4 py-2.5 rounded-xl bg-secondary-900 text-white font-semibold hover:bg-secondary-800 transition-colors"
              >
                更新密码
              </button>
            </div>
          </form>

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-sm text-secondary-700"
          >
            <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50">
              最近登录设备：杭州 · Windows
            </div>
            <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50">
              两步验证：已开启
            </div>
            <div class="p-4 rounded-2xl border border-gray-100 bg-gray-50">
              活跃会话：3 个
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useAppStore } from "../store";

const store = useAppStore();
const errorMessage = ref("");

const profile = reactive({
  name: store.user?.name ?? "",
  email: store.user?.email ?? "",
  phone: store.user?.phone ?? "",
  location: store.user?.location ?? "",
  bio: store.user?.bio ?? "",
  notifyEmail: store.user?.notifyEmail ?? true,
  notifySms: store.user?.notifySms ?? false,
  notifyInApp: store.user?.notifyInApp ?? true,
});

const security = reactive({
  current: "",
  next: "",
  confirm: "",
});

const initials = computed(() =>
  profile.username ? profile.username : "用户"
);

const mergeProfile = (data) => {
  if (!data) return;
  Object.assign(profile, {
    name: data.name || profile.name,
    email: data.email || profile.email,
    phone: data.phone || profile.phone,
    location: data.location || profile.location,
    bio: data.bio || profile.bio,
    notifyEmail: data.notifyEmail ?? profile.notifyEmail,
    notifySms: data.notifySms ?? profile.notifySms,
    notifyInApp: data.notifyInApp ?? profile.notifyInApp,
  });
};

onMounted(async () => {
  errorMessage.value = "";
  try {
    const data = await store.fetchProfile();
    mergeProfile(data);
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.detail || err.message || "获取个人信息失败";
  }
});

const handleSaveProfile = async () => {
  errorMessage.value = "";
  try {
    const data = await store.updateProfile({ ...profile });
    mergeProfile(data);
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.detail || err.message || "更新个人信息失败";
  }
};

const handleUpdatePassword = async () => {
  if (!security.next || security.next !== security.confirm) return;
  errorMessage.value = "";
  try {
    await store.changePassword({
      current_password: security.current,
      new_password: security.next,
    });
    security.current = "";
    security.next = "";
    security.confirm = "";
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.detail || err.message || "更新密码失败";
  }
};
</script>

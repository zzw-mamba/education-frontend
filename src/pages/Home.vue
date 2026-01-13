<template>
  <div class="container-custom">
    <!-- 英雄区域 -->
    <section
      class="relative text-center py-20 md:py-32 overflow-hidden rounded-[3rem] my-8 shadow-2xl border border-white/20"
    >
      <!-- Background decoration -->
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-500"
      ></div>

      <!-- Grid Pattern -->
      <div
        class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px]"
      ></div>

      <!-- Glowing Orbs -->
      <div
        class="absolute -top-40 -left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob"
      ></div>
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-sky-300 rounded-full mix-blend-overlay filter blur-[128px] opacity-40 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob animation-delay-4000 -translate-x-1/2"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <div
          class="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-8 shadow-lg animate-fade-in-up"
        >
          <span
            class="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          ></span>
          智能 · 高效 · 专业
        </div>
        <h1
          class="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-md"
        >
          智能文档<span
            class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-white"
            >摘要生成</span
          >工具
        </h1>
        <p
          class="text-xl md:text-2xl text-blue-50 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          利用先进的 AI
          技术快速提取文档核心信息，自动生成高质量专业摘要，让信息获取更高效。
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-5">
          <router-link
            to="/data-source"
            class="inline-flex items-center justify-center bg-white text-blue-600 font-bold rounded-xl text-lg px-8 py-4 shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-1 transition-all group border-none"
          >
            立即开始
            <i
              class="fa fa-arrow-right ml-2 text-sm group-hover:translate-x-1 transition-transform"
            ></i>
          </router-link>
          <a
            href="#"
            class="inline-flex items-center justify-center text-white text-lg px-8 py-4 rounded-xl shadow-lg border-2 border-white/30 bg-white/5 hover:bg-white hover:text-blue-600 hover:border-white backdrop-blur-sm transition-all hover:-translate-y-1"
          >
            了解更多 <i class="fa fa-play-circle-o ml-2 text-sm"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- 特点介绍 -->
    <section class="py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">强大功能，简单操作</h2>
        <p class="text-lg text-secondary-500">
          一站式解决您的文档阅读与处理需求
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 特点1 -->
        <div
          class="card group hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10"
        >
          <div
            class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6"
          >
            <i
              class="fa fa-database text-primary-600 text-3xl group-hover:text-white transition-colors"
            ></i>
          </div>
          <h3
            class="text-xl font-bold mb-3 text-center group-hover:text-primary-700 transition-colors"
          >
            多源数据支持
          </h3>
          <p class="text-secondary-600 text-center leading-relaxed">
            支持无缝对接企业知识库文档检索，同时也支持直接上传本地文档进行高精度
            OCR 识别，轻松处理各种来源资料。
          </p>
        </div>

        <!-- 特点2 -->
        <div
          class="card group hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10"
        >
          <div
            class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6"
          >
            <i
              class="fa fa-magic text-primary-600 text-3xl group-hover:text-white transition-colors"
            ></i>
          </div>
          <h3
            class="text-xl font-bold mb-3 text-center group-hover:text-primary-700 transition-colors"
          >
            智能摘要生成
          </h3>
          <p class="text-secondary-600 text-center leading-relaxed">
            基于先进的大语言模型与自然语言处理技术，精准理解上下文，自动提取并重组文档核心信息，生成流畅专业的摘要。
          </p>
        </div>

        <!-- 特点3 -->
        <div
          class="card group hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10"
        >
          <div
            class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6"
          >
            <i
              class="fa fa-file-text text-primary-600 text-3xl group-hover:text-white transition-colors"
            ></i>
          </div>
          <h3
            class="text-xl font-bold mb-3 text-center group-hover:text-primary-700 transition-colors"
          >
            多种导出格式
          </h3>
          <p class="text-secondary-600 text-center leading-relaxed">
            生成结果支持在线实时预览与编辑，提供 PDF 和 Word
            等多种常见办公文档格式下载，满足汇报、存档等不同场景需求。
          </p>
        </div>
      </div>
    </section>

    <!-- 工作流程 -->
    <section class="py-20 mb-12">
      <div
        class="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 md:p-16 border border-white/50 shadow-xl shadow-gray-200/40 relative overflow-hidden"
      >
        <!-- Background Pattern -->
        <div
          class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"
        ></div>
        <div
          class="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-accent-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"
        ></div>

        <h2 class="text-3xl font-bold text-center mb-16 relative z-10">
          简单四步，快速生成
        </h2>
        <div class="relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- 步骤1 -->
            <div class="relative group">
              <div
                class="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 group-last:hidden"
              ></div>
              <div class="flex flex-col items-center relative z-10">
                <div
                  class="w-16 h-16 bg-white border-4 border-white shadow-lg rounded-full flex items-center justify-center text-secondary-400 font-bold text-2xl mb-6 group-hover:border-primary-500 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-110"
                >
                  1
                </div>
                <h3 class="text-lg font-bold mb-2 text-center">选择数据源</h3>
                <p class="text-secondary-500 text-center text-sm">
                  从知识库检索或上传本地文档
                </p>
              </div>
            </div>

            <!-- 步骤2 -->
            <div class="relative group">
              <div
                class="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 group-last:hidden"
              ></div>
              <div class="flex flex-col items-center relative z-10">
                <div
                  class="w-16 h-16 bg-white border-4 border-white shadow-lg rounded-full flex items-center justify-center text-secondary-400 font-bold text-2xl mb-6 group-hover:border-primary-500 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-110"
                >
                  2
                </div>
                <h3 class="text-lg font-bold mb-2 text-center">选择模板</h3>
                <p class="text-secondary-500 text-center text-sm">
                  选择适合的摘要模板或自定义提示词
                </p>
              </div>
            </div>

            <!-- 步骤3 -->
            <div class="relative group">
              <div
                class="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 group-last:hidden"
              ></div>
              <div class="flex flex-col items-center relative z-10">
                <div
                  class="w-16 h-16 bg-white border-4 border-white shadow-lg rounded-full flex items-center justify-center text-secondary-400 font-bold text-2xl mb-6 group-hover:border-primary-500 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-110"
                >
                  3
                </div>
                <h3 class="text-lg font-bold mb-2 text-center">生成摘要</h3>
                <p class="text-secondary-500 text-center text-sm">
                  一键生成专业摘要，支持多次优化
                </p>
              </div>
            </div>

            <!-- 步骤4 -->
            <div class="relative group">
              <div
                class="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 group-last:hidden"
              ></div>
              <div class="flex flex-col items-center relative z-10">
                <div
                  class="w-16 h-16 bg-white border-4 border-white shadow-lg rounded-full flex items-center justify-center text-secondary-400 font-bold text-2xl mb-6 group-hover:border-green-500 group-hover:text-green-600 transition-all duration-300 group-hover:scale-110"
                >
                  4
                </div>
                <h3 class="text-lg font-bold mb-2 text-center">查看结果</h3>
                <p class="text-secondary-500 text-center text-sm">
                  查看、下载或导出摘要结果
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 开始使用 -->
    <section class="py-16 text-center">
      <div
        class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/3"
        ></div>

        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">
            准备好提升您的工作效率了吗？
          </h2>
          <p class="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            立即开始使用我们的智能文档摘要工具，让繁琐的文档处理变得简单高效。
          </p>
          <router-link
            to="/data-source"
            class="inline-flex items-center justify-center font-bold rounded-xl px-8 py-4 bg-white text-primary-700 hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            立即开始使用 <i class="fa fa-rocket ml-2"></i>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 首页逻辑
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>

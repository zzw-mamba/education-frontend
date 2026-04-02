<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <section
      class="card p-6 md:p-8 bg-gradient-to-br from-cyan-50 via-white to-blue-50 border border-cyan-100"
    >
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <p
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700"
          >
            使用手册
          </p>
          <h1 class="text-3xl md:text-4xl font-bold text-secondary-900 mt-3">
            帮助文档
          </h1>
          <p class="text-secondary-600 mt-3 leading-relaxed">
            这份文档帮助你快速完成从数据准备到摘要导出的全流程操作。
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3 w-full md:w-auto">
          <a
            href="#quick-start"
            class="px-4 py-3 rounded-xl bg-white border border-cyan-100 text-secondary-700 hover:bg-cyan-50 transition-colors text-center"
            >快速开始</a
          >
          <a
            href="#faq"
            class="px-4 py-3 rounded-xl bg-white border border-cyan-100 text-secondary-700 hover:bg-cyan-50 transition-colors text-center"
            >常见问题</a
          >
          <a
            href="#tips"
            class="px-4 py-3 rounded-xl bg-white border border-cyan-100 text-secondary-700 hover:bg-cyan-50 transition-colors text-center"
            >使用建议</a
          >
          <a
            href="#support"
            class="px-4 py-3 rounded-xl bg-white border border-cyan-100 text-secondary-700 hover:bg-cyan-50 transition-colors text-center"
            >故障排查</a
          >
        </div>
      </div>
    </section>

    <section id="quick-start" class="card p-6 md:p-8">
      <h2 class="text-2xl font-bold text-secondary-900">快速开始</h2>
      <p class="text-secondary-500 mt-2">
        按以下步骤可在 3-5 分钟内完成一次摘要生成。
      </p>
      <ol class="mt-6 grid gap-4">
        <li class="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <p class="font-semibold text-secondary-800">1. 选择数据来源</p>
          <p class="text-secondary-600 mt-1">
            进入“开始使用”，选择知识库检索或 OCR 上传作为输入源。
          </p>
        </li>
        <li class="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <p class="font-semibold text-secondary-800">2. 处理文档内容</p>
          <p class="text-secondary-600 mt-1">
            确认文档列表后进行解析，系统会提取可用于摘要生成的语义内容。
          </p>
        </li>
        <li class="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <p class="font-semibold text-secondary-800">3. 选择模板并配置参数</p>
          <p class="text-secondary-600 mt-1">
            选择模板，设置摘要主题、风格、字数和关注方向。
          </p>
        </li>
        <li class="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <p class="font-semibold text-secondary-800">4. 生成并查看结果</p>
          <p class="text-secondary-600 mt-1">
            点击生成摘要，完成后在结果页查看内容，并可进入“生成历史”追踪记录。
          </p>
        </li>
      </ol>
    </section>

    <section id="tips" class="card p-6 md:p-8">
      <h2 class="text-2xl font-bold text-secondary-900">使用建议</h2>
      <div class="mt-6 grid md:grid-cols-2 gap-4">
        <article class="p-4 rounded-xl bg-amber-50 border border-amber-100">
          <h3 class="font-semibold text-amber-800">主题描述越明确越好</h3>
          <p class="text-amber-700 mt-1 text-sm">
            例如“新能源车电池回收政策对供应链影响”，比“写个总结”更容易得到高质量结果。
          </p>
        </article>
        <article class="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <h3 class="font-semibold text-emerald-800">控制检索数量</h3>
          <p class="text-emerald-700 mt-1 text-sm">
            推荐先把 top_k 控制在 6-12，再根据结果完整性进行微调。
          </p>
        </article>
        <article class="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <h3 class="font-semibold text-blue-800">模板优先，提示词补充</h3>
          <p class="text-blue-700 mt-1 text-sm">
            优先选匹配场景的模板，再补充业务关键词，可明显减少后续修改量。
          </p>
        </article>
        <article class="p-4 rounded-xl bg-fuchsia-50 border border-fuchsia-100">
          <h3 class="font-semibold text-fuchsia-800">利用生成历史复盘</h3>
          <p class="text-fuchsia-700 mt-1 text-sm">
            对比不同 template_id 与参数组合，快速找到你团队最稳定的生成方案。
          </p>
        </article>
      </div>
    </section>

    <section id="faq" class="card p-6 md:p-8">
      <h2 class="text-2xl font-bold text-secondary-900">常见问题</h2>
      <div
        class="mt-6 divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden"
      >
        <details class="group p-4 bg-white" open>
          <summary
            class="cursor-pointer list-none font-semibold text-secondary-800 flex items-center justify-between"
          >
            为什么生成速度有时会变慢？
            <i
              class="fa fa-angle-down text-secondary-400 group-open:rotate-180 transition-transform"
            ></i>
          </summary>
          <p class="text-secondary-600 mt-2 text-sm leading-relaxed">
            通常与文档数量、检索范围和网络状态有关。可以先降低 top_k
            或减少输入文档数量进行验证。
          </p>
        </details>
        <details class="group p-4 bg-white">
          <summary
            class="cursor-pointer list-none font-semibold text-secondary-800 flex items-center justify-between"
          >
            OCR 识别后文本质量不高怎么办？
            <i
              class="fa fa-angle-down text-secondary-400 group-open:rotate-180 transition-transform"
            ></i>
          </summary>
          <p class="text-secondary-600 mt-2 text-sm leading-relaxed">
            建议上传更清晰的源文件，避免扫描倾斜和阴影遮挡；必要时先进行文档清洗再导入。
          </p>
        </details>
        <details class="group p-4 bg-white">
          <summary
            class="cursor-pointer list-none font-semibold text-secondary-800 flex items-center justify-between"
          >
            生成历史里看到的字段代表什么？
            <i
              class="fa fa-angle-down text-secondary-400 group-open:rotate-180 transition-transform"
            ></i>
          </summary>
          <p class="text-secondary-600 mt-2 text-sm leading-relaxed">
            id 为记录主键，user_id 为用户标识，ip_address 为请求来源，created_at
            为生成时间，template_id 为模板标识，knowledge_ids 为关联知识条目。
          </p>
        </details>
      </div>
    </section>

    <section id="support" class="card p-6 md:p-8">
      <h2 class="text-2xl font-bold text-secondary-900">故障排查</h2>
      <ul class="mt-6 grid gap-3 text-sm">
        <li class="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700">
          接口报错 401: 请确认登录状态是否过期，重新登录后重试。
        </li>
        <li
          class="p-3 rounded-lg bg-orange-50 border border-orange-100 text-orange-700"
        >
          生成失败: 请检查模板是否已正确选择，以及输入文档是否为空。
        </li>
        <li class="p-3 rounded-lg bg-sky-50 border border-sky-100 text-sky-700">
          历史为空: 先完成一次摘要生成，或确认后端历史接口是否可用。
        </li>
      </ul>

      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <router-link to="/data-source" class="btn-primary text-center">
          <i class="fa fa-play mr-2"></i>开始使用
        </router-link>
        <router-link to="/generation-history" class="btn-secondary text-center">
          <i class="fa fa-history mr-2"></i>查看生成历史
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>

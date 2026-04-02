import { defineStore } from 'pinia'
import api, { buildTemplate, parseMaterials, searchKnowledge, getRecommendationsMultiple, getMyTemplates, addTemplateApi, updateTemplateApi, deleteTemplateApi, duplicateTemplateApi, createSummaryJobApi, getSummaryJobStatusApi, upsertTempOcrGraph, cleanupTempOcrScope, cleanupExpiredTempOcr } from '../services/api'
import * as authApi from '../services/auth'
import { getTemplateCategoryCode, getTemplateCategoryLabel } from '../constants/templateCategories'

const normalizeTagsInput = value => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean).map(t => String(t).trim()).filter(Boolean)
  return String(value).split(',').map(t => t.trim()).filter(Boolean)
}

const normalizeTemplateFromApi = template => {
  const tags = Array.isArray(template?.tags)
    ? normalizeTagsInput(template.tags)
    : normalizeTagsInput(template?.labels)

  return {
    ...template,
    categoryLabel: getTemplateCategoryLabel(template?.category),
    tags,
    preview: template?.preview ?? template?.example ?? '',
    updatedAt: template?.updatedAt ?? template?.updated_at ?? null,
    createdAt: template?.createdAt ?? template?.created_at ?? null
  }
}

export const useAppStore = defineStore('app', {
  getters: {
    isAuthenticated: state => Boolean(state.authToken),
    user: state => state.currentUser
  },
  state: () => ({
    // 应用状态
    currentStep: 1,
    totalSteps: 6,
    isLoading: false,
    errorMessage: null,
    successMessage: null,

    // 认证状态
    isAuthenticated: false,
    authToken: localStorage.getItem('token') || '',
    currentUser: null,

    // 数据源状态
    dataSourceType: 'knowledgeBase', // 'knowledgeBase' or 'ocr'

    // 知识库状态
    searchKeywords: '',
    initialDocuments: [],
    selectedDocuments: [],
    recommendedDocuments: [],
    parsedMaterialsPath: null,

    // OCR状态
    uploadedFiles: [],
    ocrResults: [],
    ocrSessionScope: null,

    // 模板状态
    templates: [],
    selectedTemplate: null,
    customPrompt: '',
    summaryTopic: '', // 用户指定的摘要主题

    // 摘要状态
    generatedSummary: null,
    summaryHistory: []
  }),
  actions: {
    async initAuth() {
      const saved = localStorage.getItem('token')
      if (saved) {
        this.authToken = saved
        try {
          await this.fetchProfile()
          await this.fetchTemplates()
        } catch (err) {
          if (err?.response?.status === 401) {
            this.logout()
          }
        }
      }
    },
    async login({ username, password }) {
      this.isLoading = true
      this.errorMessage = null
      try {
        const data = await authApi.loginUser({ username, password })

        // 检查响应状态
        if (data.status !== 200) {
          throw new Error(data.message || '登录失败')
        }

        // 检查 token 是否存在
        if (!data.access_token) {
          throw new Error('服务器未返回有效的访问令牌')
        }

        // 保存 access_token 到 localStorage
        localStorage.setItem('token', data.access_token)
        this.authToken = data.access_token

        // 保存用户信息
        if (data.user) {
          this.currentUser = data.user
        }

        this.successMessage = '登录成功'
        this.isAuthenticated = true

        await this.fetchTemplates()

        return data
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '登录失败'
        this.isAuthenticated = false
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async registerUser(payload) {
      this.isLoading = true
      this.errorMessage = null
      try {
        const data = await authApi.registerUser(payload)
        this.successMessage = '注册成功'
        return data
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '注册失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async fetchProfile() {
      if (!this.authToken) return null
      this.isLoading = true
      this.errorMessage = null
      try {
        const data = await authApi.fetchProfile()
        this.currentUser = data
        console.log('Fetched user profile:', data)
        return data
      } catch (err) {
        if (err?.response?.status === 401) {
          this.logout()
        }
        this.errorMessage = err?.response?.data?.detail || err.message || '获取用户信息失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async updateProfile(payload) {
      this.isLoading = true
      this.errorMessage = null
      try {
        if (!this.currentUser?.id) {
          throw new Error('未获取到用户ID，请重新登录后再试')
        }

        const nextUsername = String(payload?.username ?? payload?.name ?? this.currentUser.username ?? '').trim()
        const nextEmail = payload?.email ?? this.currentUser.email ?? null

        const requestPayload = {
          username: nextUsername,
          email: nextEmail
        }

        const data = await authApi.updateProfile(requestPayload)
        this.currentUser = {
          ...this.currentUser,
          ...data
        }
        this.successMessage = '个人信息已更新'
        return this.currentUser
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '更新个人信息失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async changePassword(payload) {
      this.isLoading = true
      this.errorMessage = null
      try {
        if (!this.currentUser?.id) {
          throw new Error('未获取到用户ID，请重新登录后再试')
        }

        const oldPassword = payload?.old_password || payload?.current_password
        const newPassword = payload?.new_password

        const requestPayload = {
          user_id: this.currentUser.id,
          old_password: oldPassword,
          new_password: newPassword
        }

        const data = await authApi.changePassword(requestPayload)
        this.successMessage = '密码已更新'
        return data
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '更新密码失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      this.authToken = ''
      this.currentUser = null
    },

    // 步骤控制
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    goToStep(step) {
      if (step >= 1 && step <= this.totalSteps) {
        this.currentStep = step
      }
    },

    // 知识库操作
    async searchDocuments(keywords) {
      this.searchKeywords = keywords
      this.isLoading = true
      try {
        const results = await searchKnowledge(keywords)
        this.initialDocuments = results || []
      } catch (error) {
        console.error('搜索知识库失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    selectDocument(document) {
      if (!this.selectedDocuments.some(doc => doc.id === document.id)) {
        this.selectedDocuments.push(document)
      }
    },
    deselectDocument(documentId) {
      this.selectedDocuments = this.selectedDocuments.filter(doc => doc.id !== documentId)
    },
    async getRecommendations() {
      if (this.selectedDocuments.length > 0) {
        this.isLoading = true
        try {
          const kbIds = this.selectedDocuments.map(doc => doc.id)
          const results = await getRecommendationsMultiple(kbIds)
          this.recommendedDocuments = results || []
        } catch (error) {
          console.error('获取推荐失败:', error)
          this.recommendedDocuments = []
        } finally {
          this.isLoading = false
        }
      } else {
        this.recommendedDocuments = []
      }
    },

    // 批量解析文档
    async parseSelectedDocuments() {
      if (this.selectedDocuments.length === 0) return
      this.isLoading = true
      try {
        const kbIds = this.selectedDocuments.map(doc => doc.id)
        const response = await parseMaterials(kbIds)
        this.parsedMaterialsPath = response.file_path
        this.successMessage = '文档解析完成'
        return response
      } catch (error) {
        console.error('Failed to parse documents:', error)
        this.errorMessage = `文档解析失败: ${error.message || '未知错误'}`
        // 如果解析失败，是否抛出错误阻止跳转？通常是的。
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // OCR操作
    uploadFiles(files) {
      this.uploadedFiles = [...this.uploadedFiles, ...files]
    },
    removeUploadedFile(fileName) {
      // 根据文件名移除上传的文件
      this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== fileName)
      // 同步更新 ocrResults（移除对应文件的识别结果）
      this.ocrResults = this.ocrResults.filter(r => r.fileName !== fileName)
    },
    isImageOrPdf(file) {
      // 判断文件是否为图片或PDF
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff']
      const pdfType = 'application/pdf'
      return imageTypes.includes(file.type) || pdfType === file.type
    },
    async processOcr() {
      this.isLoading = true
      const results = []
      const batchScope = `ocr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      this.ocrSessionScope = batchScope

      try {
        // 处理每个上传的文件
        for (const file of this.uploadedFiles) {
          try {
            if (this.isImageOrPdf(file)) {
              // PDF或图片文件：调用后端OCR接口
              const formData = new FormData()
              formData.append('file', file)

              const response = await api.post('/ocr', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })

              console.log('OCR响应：', response)

              // 将 OCR 结果写入临时图谱作用域，不污染正式知识库
              let paperId = null;
              let sessionScope = batchScope;
              try {
                this.successMessage = `正在将 ${file.name} 写入临时图谱并构建检索索引...`;
                const tempGraphResponse = await upsertTempOcrGraph({
                  title: file.name,
                  content: response,
                  session_scope: batchScope,
                  ttl_hours: 24,
                  chunk_size: 500,
                  chunk_overlap: 50,
                  auto_extract_entities: true
                });
                paperId = tempGraphResponse.temp_paper_id;
                sessionScope = tempGraphResponse.session_scope || batchScope;

                console.log(`[GraphRAG] ${file.name} 临时图谱构建完成。scope=${sessionScope}, paper_id=${paperId}`)
              } catch (dbError) {
                console.error('OCR 临时图谱写入失败:', dbError);
              }

              // 解析后端返回的markdown内容
              results.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                paper_id: paperId,
                session_scope: sessionScope,
                fileName: file.name,
                fileSize: file.size,
                pages: response.pages || 1,
                content: response || '',
                markdown: response || '',
                isMarkdown: true
              })
              console.log(results)
            } else {
              // 非PDF/图片文件：添加错误提示
              results.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                fileName: file.name,
                fileSize: file.size,
                pages: 0,
                content: `不支持的文件类型。请上传PDF或图片文件（JPEG、PNG、GIF、WebP、BMP、TIFF）。`,
                error: true
              })
            }
          } catch (error) {
            // 处理单个文件的错误
            console.error(`文件 ${file.name} 处理失败：`, error)
            results.push({
              id: Date.now() + Math.floor(Math.random() * 1000),
              fileName: file.name,
              fileSize: file.size,
              pages: 0,
              content: `OCR处理失败: ${error.message || '未知错误'}`,
              confidence: 0,
              error: true
            })
          }
        }

        this.ocrResults = results
        this.isLoading = false
        this.successMessage = 'OCR识别完成'
      } catch (error) {
        this.isLoading = false
        this.errorMessage = `OCR处理失败: ${error.message}`
        console.error('OCR处理出错：', error)
      }
    },

    async cleanupTemporaryOcrData() {
      const scope = (this.ocrSessionScope || this.ocrResults.find(r => r.session_scope)?.session_scope || '').trim()
      if (!scope) {
        this.uploadedFiles = []
        this.ocrResults = []
        this.ocrSessionScope = null
        return { cleaned: false, reason: 'no_scope' }
      }

      try {
        await cleanupTempOcrScope(scope)
      } catch (error) {
        console.error('清理临时 OCR 会话失败:', error)
      }

      try {
        await cleanupExpiredTempOcr()
      } catch (error) {
        console.warn('清理过期临时 OCR 数据失败:', error)
      }

      this.uploadedFiles = []
      this.ocrResults = []
      this.ocrSessionScope = null
      if (this.dataSourceType === 'ocr') {
        this.dataSourceType = 'knowledgeBase'
      }

      return { cleaned: true, session_scope: scope }
    },

    // 模板操作
    selectTemplate(template) {
      this.selectedTemplate = template
    },
    updateCustomPrompt(prompt) {
      this.customPrompt = prompt
    },

    // 模板管理
    async fetchTemplates() {
      try {
        const response = await getMyTemplates();
        if (response && response.data) {
          this.templates = response.data.map(normalizeTemplateFromApi);
        } else if (Array.isArray(response)) {
          this.templates = response.map(normalizeTemplateFromApi);
        }
      } catch (err) {
        console.error('获取模板列表失败:', err);
      }
    },
    async addTemplate(payload) {
      try {
        this.isLoading = true;
        const tags = normalizeTagsInput(payload?.tags)

        const templateData = {
          name: (payload.name && payload.name.trim()) || `自定义模板 ${this.templates.length + 1}`,
          description: payload.description || '自定义模板',
          example: payload.preview || payload.prompt || '暂无预览',
          prompt: payload.prompt || '',
          category: getTemplateCategoryCode(payload.category),
          labels: tags
        }

        await addTemplateApi(templateData);
        await this.fetchTemplates(); // 重新拉取以获取正确的ID

        if (this.templates.length > 0) {
          this.selectedTemplate = this.templates[0];
        }
        return this.selectedTemplate;
      } catch (err) {
        console.error('添加模板失败', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async updateTemplate(id, updates) {
      try {
        this.isLoading = true
        const categoryValue = updates?.category
        const category = getTemplateCategoryCode(categoryValue)

        const requestPayload = {
          name: updates?.name,
          description: updates?.description,
          prompt: updates?.prompt,
          example: updates?.preview,
          category,
          labels: normalizeTagsInput(updates?.tags)
        }

        await updateTemplateApi(id, requestPayload)
        await this.fetchTemplates()

        const refreshed = this.templates.find(t => Number(t.id) === Number(id))
        if (this.selectedTemplate && this.selectedTemplate.id === id) {
          this.selectedTemplate = refreshed || null
        }
        this.successMessage = '模板更新成功'
        return refreshed || null
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '更新模板失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async deleteTemplate(id) {
      try {
        this.isLoading = true
        await deleteTemplateApi(id)
        await this.fetchTemplates()
        if (this.selectedTemplate && Number(this.selectedTemplate.id) === Number(id)) {
          this.selectedTemplate = null
        }
        this.successMessage = '模板删除成功'
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '删除模板失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async duplicateTemplate(id) {
      try {
        this.isLoading = true
        const target = this.templates.find(t => Number(t.id) === Number(id))
        const payload = {
          name: target?.name ? `${target.name} 副本` : undefined
        }
        const response = await duplicateTemplateApi(id, payload)
        await this.fetchTemplates()

        const duplicatedId = response?.data?.id
        const duplicatedTemplate = duplicatedId
          ? this.templates.find(t => Number(t.id) === Number(duplicatedId))
          : null
        this.successMessage = '模板复制成功'
        return duplicatedTemplate || null
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '复制模板失败'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    // 上传并解析模板报告（调用后端AI生成）
    async uploadTemplateReport(file) {
      try {
        this.isLoading = true
        const isText = /text|json|markdown|plain/.test(file.type) || /\.(txt|md|json)$/i.test(file.name)
        let template

        if (isText) {
          // 1. 读取文件内容
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error('读取文件失败'))
            reader.readAsText(file) // 读取为文本
          })

          // 2. 调用后端 API 生成模板结构
          // 注意：这里把文件内容作为 description 传给后端
          const response = await buildTemplate(text)
          // 统一兼容 buildTemplate 的几种返回形态：{data} / {content} / 直接对象
          const generatedContent = response?.data ?? response?.content ?? response ?? {}

          let generatedObject = {}
          if (typeof generatedContent === 'string') {
            const raw = generatedContent.trim()
            try {
              generatedObject = JSON.parse(raw)
            } catch {
              const start = raw.indexOf('{')
              const end = raw.lastIndexOf('}')
              if (start !== -1 && end !== -1 && start < end) {
                try {
                  generatedObject = JSON.parse(raw.slice(start, end + 1))
                } catch {
                  generatedObject = { prompt: raw }
                }
              } else {
                generatedObject = { prompt: raw }
              }
            }
          } else if (generatedContent && typeof generatedContent === 'object') {
            generatedObject = generatedContent
          }

          // 与手动创建保持一致：prompt 永远是纯文本，不保存 JSON 串
          const generatedPrompt = String(generatedObject?.prompt || '').trim()
          const templateName = (generatedObject?.name && String(generatedObject.name).trim())
            || (file.name.replace(/\.[^.]+$/, '') + ' (AI生成)')

          const rawCategory = Number(generatedObject?.category)
          const normalizedCategory = Number.isInteger(rawCategory) ? rawCategory : 0
          const generatedDescription = String(
            generatedObject?.description || '基于上传报告由 AI 自动生成的摘要模板'
          ).trim()

          const generatedLabels = Array.isArray(generatedObject?.labels)
            ? generatedObject.labels
            : Array.isArray(generatedObject?.tags)
              ? generatedObject.tags
              : []

          const templateData = {
            name: templateName,
            description: generatedDescription,
            example: String(generatedObject?.example || generatedPrompt || '暂无预览'),
            prompt: generatedPrompt || '',
            category: normalizedCategory,
            labels: generatedLabels
          }

          const addResult = await addTemplateApi(templateData)
          const savedTemplateId = addResult?.data?.template_id
          await this.fetchTemplates()

          if (savedTemplateId) {
            const savedTemplate = this.templates.find(t => Number(t.id) === Number(savedTemplateId))
            if (savedTemplate) {
              this.selectedTemplate = savedTemplate
              template = {
                ...savedTemplate,
                preview: savedTemplate.example || generatedPrompt
              }
            }
          }

          if (!template) {
            throw new Error('模板保存失败，请重试')
          }
        } else {
          // 非文本文件：暂时无法读取内容传给 LLM
          // 仍然保留占位逻辑，或者提示用户不支持
          template = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: file.name.replace(/\.[^.]+$/, ''),
            description: '上传文件（非文本格式，未生成结构）',
            preview: '（无法自动解析二进制文件，请上传 .txt/.md/.json 等文本文件）',
            prompt: `请根据文件 ${file.name} 中的内容生成摘要。`
          }
          this.errorMessage = '注意：非文本文件无法通过 AI 生成模板结构'
        }

        if (!isText) {
          // 非文本场景仍使用本地占位模板
          this.templates = [template, ...this.templates]
          this.selectedTemplate = template
        }
        if (isText) {
          this.successMessage = '模板报告解析并生成成功'
        }
        this.isLoading = false
        return template
      } catch (err) {
        this.isLoading = false
        this.errorMessage = err.message || '生成模板失败'
        console.error(err)
        throw err
      }
    },

    // 摘要操作
    async generateSummary(options = {}) {
      this.isLoading = true
      this.errorMessage = null
      try {
        const onProgress = typeof options?.onProgress === 'function' ? options.onProgress : null
        const rawTemplateId = this.selectedTemplate ? this.selectedTemplate.id : (this.templates.length > 0 ? this.templates[0].id : null)
        const templateId = Number(rawTemplateId)
        if (!templateId) {
          throw new Error("请先选择一个生成模板");
        }
        if (!Number.isInteger(templateId)) {
          throw new Error('模板 ID 无效，请重新选择模板')
        }

        let paperIds = [];
        let sessionScope = null;
        let includeGlobal = false;
        if (this.dataSourceType === 'knowledgeBase' && this.selectedDocuments.length > 0) {
          paperIds = this.selectedDocuments
            .map(d => Number(d.id))
            .filter(id => Number.isInteger(id));
        } else if (this.dataSourceType === 'ocr' && this.ocrResults.length > 0) {
          // OCR 使用临时图谱作用域检索，同时联合全知识库进行补充。
          paperIds = this.ocrResults
            .map(r => Number(r.paper_id))
            .filter(id => Number.isInteger(id));
          sessionScope = this.ocrSessionScope || this.ocrResults.find(r => r.session_scope)?.session_scope || null;
          includeGlobal = true;
        }

        const queryTextRaw = this.customPrompt || this.summaryTopic || '请生成核心内容的摘要报告'
        const queryText = typeof queryTextRaw === 'string' ? queryTextRaw : JSON.stringify(queryTextRaw)

        const requestData = {
          query_text: queryText,
          paper_ids: paperIds.length > 0 ? paperIds : null,
          session_scope: sessionScope,
          include_global: includeGlobal,
          top_k: 8,
          focus_direction: "核心观点与主要结论",
          snippets_per_entity: 2,
          neighbor_limit: 4,
          max_graph_papers: 3
        };

        const createResp = await createSummaryJobApi(templateId, requestData)
        const jobId = createResp?.data?.job_id || createResp?.job_id
        if (!jobId) {
          throw new Error('后端未返回摘要任务ID')
        }

        if (onProgress) {
          onProgress({
            status: createResp?.data?.status || 'queued',
            stage: createResp?.data?.stage || 'queued',
            progress: createResp?.data?.progress ?? 0,
            message: createResp?.data?.message || '任务已创建'
          })
        }

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        let jobData = null
        for (let i = 0; i < 240; i++) {
          const statusResp = await getSummaryJobStatusApi(jobId)
          jobData = statusResp?.data || statusResp

          if (onProgress) {
            onProgress({
              status: jobData?.status,
              stage: jobData?.stage,
              progress: jobData?.progress,
              message: jobData?.message
            })
          }

          if (jobData?.status === 'completed') {
            break
          }

          if (jobData?.status === 'failed') {
            throw new Error(jobData?.error || '摘要生成任务失败')
          }

          await sleep(1200)
        }

        if (!jobData || jobData.status !== 'completed') {
          throw new Error('摘要生成超时，请稍后重试')
        }

        const resultPayload = jobData?.result
        const resData = resultPayload?.data || resultPayload

        if (resData) {
          const summary = {
            id: resData.result_id || Date.now(),
            title: this.selectedTemplate ? this.selectedTemplate.name : '自定义摘要',
            content: resData.summary || resData.summary_markdown,
            date: new Date().toISOString(),
            templateId: templateId,
            prompt: requestData.query_text,
            sourceCount: this.dataSourceType === 'knowledgeBase' ? this.selectedDocuments.length : this.ocrResults.length,
            files: resData.files // 存储后端返回的文件路径信息
          };
          this.generatedSummary = summary;
          this.summaryHistory.push(summary);
          this.successMessage = "摘要生成成功";
          return summary
        } else {
          throw new Error("后端返回数据格式异常");
        }
      } catch (error) {
        this.errorMessage = `生成摘要失败: ${error.message}`;
        console.error('generateSummary failed:', error);
        throw error
      } finally {
        this.isLoading = false;
      }
    },
    async regenerateSummary(prompt) {
      if (prompt) {
        this.customPrompt = prompt;
      }
      await this.generateSummary();
    },

    // 导出操作
    exportToPdf() {
      if (this.generatedSummary && this.generatedSummary.files && this.generatedSummary.files.pdf_path) {
        // 使用后端返回的路径
        const link = document.createElement('a');
        link.href = `${api.defaults.baseURL}/${this.generatedSummary.files.pdf_path}`;
        link.download = `summary_${new Date().toISOString().slice(0, 10)}.pdf`;
        link.target = '_blank';
        link.click();
        this.successMessage = 'PDF开始下载';
      } else {
        this.errorMessage = '未能获取到PDF文件路径';
      }
    },
    exportToWord() {
      if (this.generatedSummary && this.generatedSummary.files && this.generatedSummary.files.word_path) {
        // 使用后端返回的路径
        const link = document.createElement('a');
        link.href = `${api.defaults.baseURL}/${this.generatedSummary.files.word_path}`;
        link.download = `summary_${new Date().toISOString().slice(0, 10)}.docx`;
        link.target = '_blank';
        link.click();
        this.successMessage = 'Word开始下载';
      } else {
        this.errorMessage = '未能获取到Word文件路径';
      }
    },

    // 清除消息
    clearMessages() {
      this.errorMessage = null
      this.successMessage = null
    }
  }
})

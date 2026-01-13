import { defineStore } from 'pinia'
import api from '../services/api'
import * as authApi from '../services/auth'

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
    authToken: localStorage.getItem('token') || '',
    currentUser: null,

    // 数据源状态
    dataSourceType: 'knowledgeBase', // 'knowledgeBase' or 'ocr'

    // 知识库状态
    searchKeywords: '',
    initialDocuments: [],
    selectedDocuments: [],
    recommendedDocuments: [],

    // OCR状态
    uploadedFiles: [],
    ocrResults: [],

    // 模板状态
    templates: [
      {
        id: 1,
        name: '标准摘要',
        description: '适用于大多数文档的标准摘要格式',
        preview: '这是一个标准摘要模板的预览...',
        prompt: '请总结以下文档的核心内容，包括主要观点、关键数据和结论。保持语言简洁明了，结构清晰。',
        category: '通用',
        tags: ['通用', '简洁'],
        updatedAt: '2025-01-04T09:00:00Z'
      },
      {
        id: 2,
        name: '技术报告',
        description: '适用于技术文档和研究报告的专业摘要格式',
        preview: '这是一个技术报告模板的预览...',
        prompt: '请以技术报告格式总结以下文档，包括技术背景、方法、结果和应用前景。使用专业术语，保持客观中立。',
        category: '技术',
        tags: ['技术', '研究'],
        updatedAt: '2025-01-06T10:30:00Z'
      },
      {
        id: 3,
        name: ' executive summary',
        description: '适用于商业文档和管理报告的高管摘要格式',
        preview: '这是一个executive summary模板的预览...',
        prompt: '请以executive summary格式总结以下文档，突出商业价值、战略意义和决策建议。语言简洁有力，适合高管阅读。',
        category: '商业',
        tags: ['商业', '高管'],
        updatedAt: '2025-01-08T14:15:00Z'
      },
      {
        id: 4,
        name: '研究摘要',
        description: '适用于学术研究和论文的摘要格式',
        preview: '这是一个研究摘要模板的预览...',
        prompt: '请以学术研究摘要格式总结以下文档，包括研究背景、目的、方法、结果和结论。使用学术语言，引用关键数据。',
        category: '学术',
        tags: ['学术', '论文'],
        updatedAt: '2025-01-09T08:45:00Z'
      },
      {
        id: 5,
        name: '问题解决方案',
        description: '适用于问题分析和解决方案文档的摘要格式',
        preview: '这是一个问题解决方案模板的预览...',
        prompt: '请以问题解决方案格式总结以下文档，包括问题描述、分析、解决方案和实施建议。结构清晰，重点突出。',
        category: '方案',
        tags: ['方案', '分析'],
        updatedAt: '2025-01-10T12:00:00Z'
      }
    ],
    selectedTemplate: null,
    customPrompt: '',

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
        const token = data.access_token || data.token || data.jwt
        if (token) {
          localStorage.setItem('token', token)
          this.authToken = token
        }
        this.currentUser = data.user || null
        this.successMessage = '登录成功'
        return data
      } catch (err) {
        this.errorMessage = err?.response?.data?.detail || err.message || '登录失败'
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
        const data = await authApi.updateProfile(payload)
        this.currentUser = data
        this.successMessage = '个人信息已更新'
        return data
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
        const data = await authApi.changePassword(payload)
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
    searchDocuments(keywords) {
      this.searchKeywords = keywords
      // 模拟API请求
      this.isLoading = true
      setTimeout(() => {
        this.initialDocuments = [
          {
            id: 1,
            title: '人工智能在医疗领域的应用',
            summary: '本文探讨了人工智能技术在医疗诊断、药物研发和患者护理等方面的应用...',
            source: '医疗科技期刊',
            date: '2023-05-15',
            matchScore: 95
          },
          {
            id: 2,
            title: '机器学习算法比较研究',
            summary: '本研究对当前主流的机器学习算法进行了全面比较，包括性能、适用场景和计算复杂度...',
            source: '计算机科学进展',
            date: '2023-08-22',
            matchScore: 88
          },
          {
            id: 3,
            title: '自然语言处理最新进展',
            summary: '本文综述了自然语言处理领域的最新研究进展，重点介绍了大型语言模型和多模态技术...',
            source: '人工智能研究',
            date: '2023-10-05',
            matchScore: 82
          }
        ]
        this.isLoading = false
      }, 1000)
    },
    selectDocument(document) {
      if (!this.selectedDocuments.some(doc => doc.id === document.id)) {
        this.selectedDocuments.push(document)
        this.getRecommendations()
      }
    },
    deselectDocument(documentId) {
      this.selectedDocuments = this.selectedDocuments.filter(doc => doc.id !== documentId)
      this.getRecommendations()
    },
    getRecommendations() {
      // 模拟API请求
      if (this.selectedDocuments.length > 0) {
        this.isLoading = true
        setTimeout(() => {
          this.recommendedDocuments = [
            {
              id: 4,
              title: '深度学习在医疗影像分析中的应用',
              summary: '本文探讨了深度学习技术在医疗影像分析中的具体应用案例和效果评估...',
              source: '医学影像杂志',
              date: '2023-07-18',
              matchScore: 92,
              reason: '与"人工智能在医疗领域的应用"高度相关'
            },
            {
              id: 5,
              title: 'AI伦理与隐私保护',
              summary: '本文讨论了人工智能应用中的伦理问题和隐私保护挑战，提出了相应的解决方案...',
              source: '科技与伦理',
              date: '2023-09-30',
              matchScore: 78,
              reason: '补充"人工智能在医疗领域的应用"中的伦理考量'
            }
          ]
          this.isLoading = false
        }, 800)
      } else {
        this.recommendedDocuments = []
      }
    },

    // OCR操作
    uploadFiles(files) {
      this.uploadedFiles = [...this.uploadedFiles, ...files]
      this.processOcr()
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
              // 解析后端返回的markdown内容
              results.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                fileName: file.name,
                fileSize: file.size,
                pages: response.pages || 1,
                content: response.markdown || response.content || '',
                confidence: response.confidence || 95
              })
            } else {
              // 非PDF/图片文件：添加错误提示
              results.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                fileName: file.name,
                fileSize: file.size,
                pages: 0,
                content: `不支持的文件类型。请上传PDF或图片文件（JPEG、PNG、GIF、WebP、BMP、TIFF）。`,
                confidence: 0,
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
    // 模板操作
    selectTemplate(template) {
      this.selectedTemplate = template
    },
    updateCustomPrompt(prompt) {
      this.customPrompt = prompt
    },

    // 模板管理
    addTemplate(payload) {
      const now = new Date().toISOString()
      const normalizeTags = value => {
        if (!value) return []
        if (Array.isArray(value)) return value.filter(Boolean).map(t => String(t).trim()).filter(Boolean)
        return String(value)
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      }

      const template = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: (payload.name && payload.name.trim()) || `自定义模板 ${this.templates.length + 1}`,
        description: payload.description || '自定义模板',
        preview: payload.preview || payload.prompt || '暂无预览',
        prompt: payload.prompt || '',
        category: payload.category || '通用',
        tags: normalizeTags(payload.tags),
        updatedAt: payload.updatedAt || now
      }

      this.templates = [template, ...this.templates]
      this.selectedTemplate = template
      return template
    },
    updateTemplate(id, updates) {
      const now = new Date().toISOString()
      const normalizeTags = value => {
        if (!value) return []
        if (Array.isArray(value)) return value.filter(Boolean).map(t => String(t).trim()).filter(Boolean)
        return String(value)
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      }

      this.templates = this.templates.map(t => {
        if (t.id !== id) return t
        const nextTags = updates.tags === undefined ? t.tags : normalizeTags(updates.tags)
        return {
          ...t,
          ...updates,
          tags: nextTags,
          updatedAt: updates.updatedAt || now
        }
      })

      if (this.selectedTemplate && this.selectedTemplate.id === id) {
        const found = this.templates.find(t => t.id === id)
        this.selectedTemplate = found || null
      }
    },
    deleteTemplate(id) {
      this.templates = this.templates.filter(t => t.id !== id)
      if (this.selectedTemplate && this.selectedTemplate.id === id) {
        this.selectedTemplate = null
      }
    },
    duplicateTemplate(id) {
      const target = this.templates.find(t => t.id === id)
      if (!target) return null
      const copy = {
        ...target,
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: `${target.name} 副本`,
        updatedAt: new Date().toISOString()
      }
      this.templates = [copy, ...this.templates]
      return copy
    },
    // 上传并解析模板报告（前端模拟解析）
    async uploadTemplateReport(file) {
      // 支持简易的文本解析（.txt/.md/.json），其他类型则创建占位模板
      const createTemplateFromText = (text, fileName) => {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
        const name = lines[0] ? lines[0].slice(0, 50) : (fileName || '自定义模板')
        const description = lines[1] || (lines.slice(0, 3).join(' ') || '由上传的模板报告解析生成')
        const preview = text.slice(0, 200)
        const prompt = text
        return {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name,
          description,
          preview,
          prompt
        }
      }

      try {
        this.isLoading = true
        const isText = /text|json|markdown|plain/.test(file.type) || /\.(txt|md|json)$/i.test(file.name)
        let template
        if (isText) {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error('读取文件失败'))
            reader.readAsText(file)
          })
          template = createTemplateFromText(text, file.name)
        } else {
          // 非文本文件：使用文件名生成占位模板
          template = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: file.name.replace(/\.[^.]+$/, ''),
            description: '从上传文件生成的模板（原文件为非文本，需手动调整）',
            preview: '（无法自动解析二进制文件）',
            prompt: `请根据文件 ${file.name} 中的内容生成摘要。`
          }
        }

        // 将新模板插入到列表顶部
        this.templates = [template, ...this.templates]
        // 自动选择新模板
        this.selectedTemplate = template
        this.successMessage = '模板报告解析并生成成功'
        this.isLoading = false
        return template
      } catch (err) {
        this.isLoading = false
        this.errorMessage = err.message || '解析模板失败'
        throw err
      }
    },

    // 摘要操作
    generateSummary() {
      // 模拟API请求
      this.isLoading = true
      setTimeout(() => {
        const summary = {
          id: Date.now(),
          title: this.selectedTemplate ? this.selectedTemplate.name : '自定义摘要',
          content: `这是基于您选择的${this.selectedTemplate ? this.selectedTemplate.name : '自定义'}模板生成的摘要内容。\n\n${this.dataSourceType === 'knowledgeBase' ?
            '从知识库文档中提取的核心信息包括：\n- 人工智能技术在多个领域的应用前景\n- 机器学习算法的性能比较\n- 自然语言处理的最新进展\n\n' :
            '从OCR识别文档中提取的核心信息包括：\n- 文档中的主要观点和数据\n- 关键结论和建议\n- 相关背景信息\n\n'}${this.customPrompt ? `根据您的自定义要求：${this.customPrompt}` : ''}`,
          date: new Date().toISOString(),
          templateId: this.selectedTemplate ? this.selectedTemplate.id : null,
          prompt: this.selectedTemplate ? this.selectedTemplate.prompt + (this.customPrompt ? `\n\n额外要求：${this.customPrompt}` : '') : this.customPrompt,
          sourceCount: this.dataSourceType === 'knowledgeBase' ? this.selectedDocuments.length : this.ocrResults.length
        }
        this.generatedSummary = summary
        this.summaryHistory.push(summary)
        this.isLoading = false
      }, 2500)
    },
    regenerateSummary(prompt) {
      // 模拟API请求
      this.isLoading = true
      setTimeout(() => {
        const updatedSummary = {
          ...this.generatedSummary,
          id: Date.now(),
          content: `${this.generatedSummary.content}\n\n根据您的反馈，进一步优化后的内容：\n- 补充了更多细节信息\n- 调整了结构和表述\n- 强化了关键观点的表达`,
          prompt: this.generatedSummary.prompt + `\n\n优化要求：${prompt}`,
          date: new Date().toISOString()
        }
        this.generatedSummary = updatedSummary
        this.summaryHistory.push(updatedSummary)
        this.isLoading = false
      }, 2000)
    },

    // 导出操作
    exportToPdf() {
      // 模拟API请求
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.successMessage = 'PDF导出成功'
        // 创建一个虚拟的下载链接
        const link = document.createElement('a')
        link.href = '#'
        link.download = `summary_${new Date().toISOString().slice(0, 10)}.pdf`
        link.click()
      }, 1000)
    },
    exportToWord() {
      // 模拟API请求
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.successMessage = 'Word导出成功'
        // 创建一个虚拟的下载链接
        const link = document.createElement('a')
        link.href = '#'
        link.download = `summary_${new Date().toISOString().slice(0, 10)}.docx`
        link.click()
      }, 1000)
    },

    // 清除消息
    clearMessages() {
      this.errorMessage = null
      this.successMessage = null
    }
  }
})

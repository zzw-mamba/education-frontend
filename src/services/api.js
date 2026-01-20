import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://0.0.0.0:8000',
  timeout: 3000000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 错误处理
    return Promise.reject(error)
  }
)

// 知识库搜索接口
export const searchKnowledge = (q, limit = 5, offset = 0) => {
  return api.get('/knowledge/search', {
    params: {
      q,
      limit,
      offset
    }
  })
}

// 获取知识库文件预览
export const getKnowledgeFile = (fileId) => {
  return api.get(`/knowledge/file/${fileId}`, {
    responseType: 'blob'
  })
}

// 获取类似推荐文章
export const getRecommendationsMultiple = (kbIds, limit = 10) => {
  // Use URLSearchParams to properly serialize array parameters (kb_ids=1&kb_ids=2...)
  const params = new URLSearchParams();
  if (Array.isArray(kbIds)) {
    kbIds.forEach(id => params.append('kb_ids', id));
  } else {
    params.append('kb_ids', kbIds);
  }
  params.append('limit', limit);

  return api.get('/knowledge/recommend', { params })
}

// 根据描述生成模板
export const buildTemplate = (description) => {
  return api.post('/template/build', null, {
    params: {
      request: description
    }
  });
}

// 批量解析知识库条目
export const parseMaterials = (kbIds) => {
  return api.post('/material/parse', kbIds)
}

export default api

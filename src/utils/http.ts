import axios from 'axios'
import { getToken, getRefreshToken, setToken, clearToken } from './auth'
import { addPending, removePending } from './pending'

const service = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/8170266-0-default',
  timeout: 10000
})

/** ========================
 * token刷新控制
 ======================== */
let isRefreshing = false
// 用来存放 token 过期后需要重新发起的请求队列的。
// 定义 refreshQueue 的类型
let refreshQueue: ((token: string) => void)[] = []

// 将回调函数添加到队列中
function subscribeTokenRefresh(cb: (token: string) => void): void {
  refreshQueue.push(cb)
}

// 当 token 刷新完成后，调用队列中的回调函数
function onRefreshed(token: string): void {
  refreshQueue.forEach((cb) => cb(token)) // 执行每个回调函数
  refreshQueue = [] // 清空队列，防止重复调用
}

service.interceptors.request.use(
  (config) => {
    // 取消重复请求
    removePending(config)
    addPending(config)
    // 加token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return alert(error)
  }
)

service.interceptors.response.use(
  (response) => {
    removePending(response.config)

    return response.data
  },
  async (error) => {
    const { config, response } = error

    if (!response) {
      alert('请求超时，请检查网络')
      return Promise.reject(error)
    }

    // token过期
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true

        try {
          const res = await axios.post('/api/refresh', {
            refreshToken: getRefreshToken()
          })

          const newToken = res.data.token
          setToken(newToken)

          isRefreshing = false
          onRefreshed(newToken)

          return service(config)
        } catch (err) {
          clearToken()
          window.location.href = '/login'
          return Promise.reject(err)
        }
      }

      // 队列处理
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(service(config))
        })
      })
    }

    return Promise.reject(error)
  }
)

export default service

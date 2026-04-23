import axios from 'axios'
import type { AxiosRequestConfig, CancelTokenSource } from 'axios'

// 定义 pendingMap，用于存储 CancelToken
const pendingMap = new Map<string, CancelTokenSource>()

// 获取请求的唯一标识符
export function getPendingKey(config: AxiosRequestConfig): string {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 添加请求到 pendingMap 中
export function addPending(config: AxiosRequestConfig): void {
  const key = getPendingKey(config)

  // 如果 pendingMap 中已经存在相同的请求，则复用取消函数
  if (pendingMap.has(key)) {
    config.cancelToken = pendingMap.get(key)?.token // 使用 token 属性
  } else {
    // 否则创建一个新的 CancelToken
    const cancelSource = axios.CancelToken.source()
    config.cancelToken = cancelSource.token
    pendingMap.set(key, cancelSource) // 将 cancelSource 存入 pendingMap
  }
}

// 从 pendingMap 中移除已完成或取消的请求
export function removePending(config: AxiosRequestConfig): void {
  const key = getPendingKey(config)

  // 如果 pendingMap 中有当前请求的 key，表示该请求已经存在
  if (pendingMap.has(key)) {
    const cancelSource = pendingMap.get(key)
    cancelSource?.cancel('请求被取消') // 取消当前请求
    pendingMap.delete(key) // 删除当前请求的记录
  }
}

import request from '@/utils/http'

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

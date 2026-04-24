import request from '@/utils/http'

interface userInfoType {
  username: string
  password: string
}

export function getUserInfo(data: userInfoType) {
  return request({
    url: '/user/info',
    data: {
      username: data.username,
      password: data.password
    },
    method: 'post'
  })
}

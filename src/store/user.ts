import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const access_token: string = ''
  const refresh_token: string = ''
  return {
    access_token,
    refresh_token
  }
})

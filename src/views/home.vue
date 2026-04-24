<template>
  <div>
    {{ userStore.access_token }}
    <a-button @click="setToken">token</a-button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
// import { getUserInfo } from '@/api/userApi'

// onMounted(() => {
//   getUser()
// })
const userStore = useUserStore()
const setToken = () => {
  userStore.access_token = 'abc'
}
// const getUser = () => {
//   getUserInfo().then((res) => {
//     console.log(res)
//   })
// }
</script>

<style lang="scss" scoped></style>

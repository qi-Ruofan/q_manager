<template>
  <div>
    {{ userStore.access_token }}
    <a-button @click="setToken">token</a-button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const setToken = () => {
  userStore.access_token = 'abc'
}
</script>

<style lang="scss" scoped></style>

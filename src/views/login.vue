<template>
  <div class="login-warp">
    <h1 class="login-title">综合后台系统</h1>
    <div class="login-container">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="!formState.username || !formState.password"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api/userApi'
import { setToken, setRefreshToken } from '@/utils/auth'

const router = useRouter()

interface FormState {
  username: string
  password: string
  remember: boolean
}
interface UserResponse {
  refresh_token: string
  access_token: string
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true
})

const onFinish = (values: FormState) => {
  const params = {
    username: values.username,
    password: values.password
  }
  getUserInfo(params)
    .then((res) => {
      // 通过类型断言确保我们可以安全地访问 access_token 和 refresh_token
      const data = res.data as UserResponse

      if (data.access_token && data.refresh_token) {
        setToken(data.access_token)
        setRefreshToken(data.refresh_token)
        console.log('Success:', res)
        router.push({ name: 'Home' }) // 使用路由名称
      }
    })
    .catch((error) => {
      console.error('Login failed:', error)
      alert('Login failed, please try again!')
    })
}

const onFinishFailed = (errorInfo: null) => {
  console.log('Failed:', errorInfo)
}
</script>

<style lang="scss" scoped>
.login-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #add8e6, #9898ff);
}
.login-title {
  color: #fff;
}
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 300px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #fff;
}
</style>

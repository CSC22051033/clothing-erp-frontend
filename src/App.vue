<script setup>
import TopBar from './components/TopBar.vue'
import AuthView from './components/AuthView.vue';
import { useUserStore } from './stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
</script>

<template>
  <TopBar />
  <!-- 未登录：显示登录注册组件 -->
  <AuthView v-if="!isLoggedIn" />
  <div v-else>已登录</div>
</template>

<style scoped>

</style>
<script setup>
import TopBar from './components/TopBar.vue'
import AuthView from './components/AuthView.vue';
import SideBar from './components/SideBar.vue';
import GeneralTable from './components/GeneralTable.vue';
import TabBar from './components/TabBar.vue';

import { useUserStore } from './stores/user'
import { useTabsStore } from './stores/tabs'
import { computed } from 'vue'

const userStore = useUserStore()
const tabsStore = useTabsStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentTab = computed(() => tabsStore.currentTab)
</script>

<template>
  <TopBar />
  <AuthView v-if="!isLoggedIn" />
  <div class="bodyContainer" v-else>
    <SideBar />
    <div class="right-area">
      <TabBar />
      <div class="content-area">
        <GeneralTable
          v-if="currentTab"
          :data="currentTab.data || []"
          :loading="currentTab.loading"
          :columnsOrder="currentTab.columnsOrder"
        />
        <el-empty v-else description="请从左侧菜单打开功能" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bodyContainer{
  display: flex;
  height: 90vh;
}
.right-area {
  flex: 1;           /* 占据剩余宽度 */
  display: flex;
  flex-direction: column;
  min-width: 0;      /* 防止 flex 子项溢出 */
}
.content-area {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  height: 100%;
}
</style>
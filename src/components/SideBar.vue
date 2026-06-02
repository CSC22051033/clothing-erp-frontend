<script setup>
import { ref } from 'vue'
import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus'
import { useTabsStore } from '@/stores/tabs'

// 当前选中的菜单项索引
const activeIndex = ref('user')

const tabsStore = useTabsStore()
// 菜单点击处理
const handleSelect = (index) => {
    activeIndex.value = index
    if (index === 'user') {
        tabsStore.addTab({
            id: 'user',
            title: '用户管理',
            columnsOrder: ['userId', 'status', 'username', 'realName', 'password'] ,
            fetchData: async () => {
                const { fetchUsers } = await import('@/api/user')
                return await fetchUsers()
            }
        })
    }
    // 可扩展其他菜单项（角色管理等）
}

// 动态菜单配置（支持扩展更多分组和子项）
const menuGroups = ref([
    {
        index: 'userMgmt',
        title: '用户管理',
        children: [
            { index: 'user', label: '用户管理' },
            { index: 'role', label: '角色管理' },
            { index: 'roleAssign', label: '角色分配' },
            { index: 'permission', label: '权限管理' }
        ]
    }
])
</script>

<template>
    <div class="sideContainer">
        <el-menu :default-active="activeIndex" class="user-menu" text-color="#2c3e50" active-text-color="#409eff"
            background-color="#f0f7ff" @select="handleSelect">
            <el-sub-menu v-for="group in menuGroups" :key="group.index" :index="group.index">
                <template #title>
                    <span>{{ group.title }}</span>
                </template>
                <el-menu-item v-for="item in group.children" :key="item.index" :index="item.index">
                    {{ item.label }}
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<style scoped>
.sideContainer {
    min-height: 90dvh;
    width: 18.5dvw;
    /* 边框优化：添加右侧细边框 */
    border-right: 1px solid #d9e8f5;
    /* 滚动条：内容超出时纵向滚动 */
    max-height: 90dvh;
    overflow-y: auto;
}

/* 紧凑样式：减少菜单项内边距和行高 */
:deep(.user-menu) {
    border-right: none;
    background-color: #f0f7ff;
    /* 紧凑：整体菜单内边距归零 */
    padding: 0;
}

:deep(.user-menu .el-sub-menu__title) {
    color: #2c3e50;
    background-color: #f0f7ff;
    /* 紧凑：减少高度和水平内边距 */
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
}

:deep(.user-menu .el-sub-menu__title:hover) {
    background-color: #d9ebff;
    color: #1e3a5f;
}

:deep(.user-menu .el-menu-item) {
    color: #2c3e50;
    background-color: #f0f7ff;
    height: 36px;
    line-height: 36px;
    padding: 0 16px 0 32px;
    /* 子菜单缩进增加，层次更清晰 */
}

:deep(.user-menu .el-menu-item:hover) {
    background-color: #d9ebff;
    color: #1e3a5f;
}

:deep(.user-menu .el-menu-item.is-active) {
    background-color: #c2e0ff;
    color: #0d4a7a;
    font-weight: 500;
}

/* 子菜单内层样式 - 更紧凑 */
:deep(.user-menu .el-menu--inline) {
    background-color: #f9fcff;
}

:deep(.user-menu .el-menu--inline .el-menu-item) {
    background-color: #f9fcff;
    height: 34px;
    line-height: 34px;
    padding-left: 44px;
    /* 进一步缩进，区分层级 */
}

:deep(.user-menu .el-menu--inline .el-menu-item:hover) {
    background-color: #e6f2ff;
}

:deep(.user-menu .el-menu--inline .el-menu-item.is-active) {
    background-color: #b3d9ff;
}

/* 滚动条样式美化（可选） */
.sideContainer::-webkit-scrollbar {
    width: 6px;
}

.sideContainer::-webkit-scrollbar-track {
    background: #f0f7ff;
}

.sideContainer::-webkit-scrollbar-thumb {
    background: #b8d4f0;
    border-radius: 3px;
}

.sideContainer::-webkit-scrollbar-thumb:hover {
    background: #8bb9e0;
}
</style>
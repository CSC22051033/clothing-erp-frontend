<template>
    <div class="tab-bar">
        <div v-for="tab in tabsStore.tabs" :key="tab.id" class="tab-item"
            :class="{ active: tabsStore.activeTabId === tab.id }" @click="tabsStore.setActiveTab(tab.id)">
            <span>{{ tab.title }}</span>
            <el-icon class="close-btn" @click.stop="tabsStore.removeTab(tab.id)">
                <Close />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { useTabsStore } from '@/stores/tabs'
import { Close } from '@element-plus/icons-vue'

const tabsStore = useTabsStore()
</script>

<style scoped>
.tab-bar {
    display: flex;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    padding-left: 10px;
}

.tab-item {
    padding: 8px 16px;
    margin-right: 4px;
    background: white;
    border: 1px solid #e4e7ed;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.tab-item.active {
    background: #fff;
    border-bottom-color: #fff;
    color: #409eff;
    font-weight: 500;
}

.close-btn {
    font-size: 14px;
    color: #909399;
}

.close-btn:hover {
    color: #f56c6c;
}
</style>
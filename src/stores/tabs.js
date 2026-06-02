import { defineStore } from 'pinia'
import { fetchUsers } from '@/api/user'

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: [],        // [{ id, title, data, loading, columns, fetchData }]
        activeTabId: null
    }),
    getters: {
        currentTab: (state) => state.tabs.find(tab => tab.id === state.activeTabId)
    },
    actions: {
        // 添加或激活标签页
        async addTab(tabConfig) {
            const existing = this.tabs.find(t => t.id === tabConfig.id)
            if (existing) {
                this.activeTabId = existing.id
                return
            }
            const newTab = {
                ...tabConfig,
                data: null,
                loading: false,
                columnsOrder: tabConfig.columnsOrder || null
            }
            this.tabs.push(newTab)
            this.activeTabId = newTab.id
            // 自动加载数据
            await this.loadTabData(newTab.id)
        },
        // 加载指定标签页的数据
        async loadTabData(tabId) {
            const tab = this.tabs.find(t => t.id === tabId)
            if (!tab || !tab.fetchData) return
            tab.loading = true
            try {
                const data = await tab.fetchData()
                tab.data = data
            } catch (error) {
                console.error('加载数据失败', error)
                tab.data = []
            } finally {
                tab.loading = false
            }
        },
        removeTab(tabId) {
            const index = this.tabs.findIndex(t => t.id === tabId)
            if (index === -1) return
            this.tabs.splice(index, 1)
            if (this.activeTabId === tabId) {
                this.activeTabId = this.tabs.length > 0 ? this.tabs[0].id : null
            }
            },
            setActiveTab(tabId) {
            this.activeTabId = tabId
        }
    }
})
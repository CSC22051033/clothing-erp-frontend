<script setup>
import { ref } from 'vue'
import { User, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

//#region 用户登录注册
const isLoggedIn = ref(true)
const userInfo = ref({
    name: 'Admin',
})

// 登录方法
const goToLogin = () => {
// 模拟登录成功
    ElMessageBox.confirm('模拟登录，确定要登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
        isLoggedIn.value = true
        userInfo.value = {
            name: 'Admin',
        }
        ElMessage.success('登录成功！')
    }).catch(() => {})
}

// 处理下拉菜单点击
const handleCommand = (command) => {
    switch (command) {
        case 'userInfo':
            // 查看用户信息
            ElMessage.info(`当前用户：${userInfo.value.name}`)
            // 可以跳转到用户信息页面或打开弹窗
            break
        case 'logout':
            // 退出登录
            ElMessageBox.confirm('确定要退出登录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                isLoggedIn.value = false
                userInfo.value = {
                name: '',
                }
                ElMessage.success('已退出登录')
            }).catch(() => {})
            break
        default:
            break
    }
}
//#endregion
</script>

<template>
    <div class="topContainer">
        <a href="/" class="logo">服装ERP项目</a>
        <el-button v-if="!isLoggedIn" class="login-btn" @click="goToLogin">
            登录
        </el-button>
        <el-dropdown v-else @command="handleCommand">
        <span class="user-dropdown-link">
            <el-icon :size="20">
                <User />
            </el-icon>
            <span class="user-name">
                {{ userInfo.name }}
            </span>
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
            <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
        </el-dropdown>
    </div>
</template>

<style scoped>
.topContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5dvh;
    border: 1px solid #e9edf4;
    padding: 0 20px;
}

.logo {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
    text-decoration: none;
}

.login-btn {
    margin-right: 10px;
}

.user-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    gap: 5px;
}

.user-dropdown-link:hover,
.user-dropdown-link:focus,
.user-dropdown-link:focus-visible {
    outline: none;
    border: none;
}

.user-name {
    margin-left: 0;
    font-size: 15px;
    color: #374151;
    font-weight: 500;
}

.el-icon--right {
    margin-left: 5px;
}
</style>
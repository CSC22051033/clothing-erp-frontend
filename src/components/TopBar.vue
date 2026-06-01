<script setup>
import { computed, ref } from 'vue'
import { User, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'
import { login, register } from '../api/auth'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userName = computed(() => userStore.userName)

const dialogVisible = ref(false)
const dialogMode = ref('login') // login / register

const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', password: '', confirmPassword: '', realName: '' })
const loginLoading = ref(false)
const registerLoading = ref(false)

const goToLogin = () => {
    dialogMode.value = 'login'
    loginForm.value = { username: '', password: '' }
    dialogVisible.value = true
}

const switchToRegister = () => {
    dialogMode.value = 'register'
    registerForm.value = { username: '', password: '', confirmPassword: '', realName: '' }
}

const switchToLogin = () => {
    dialogMode.value = 'login'
    loginForm.value = { username: '', password: '' }
}

const handleLogin = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
        ElMessage.warning('请填写用户名和密码')
        return
    }
    loginLoading.value = true
    try {
        const res = await login(loginForm.value)
        if (res.code === 200) {
            userStore.setLoginData(res.data)
            ElMessage.success('登录成功')
            dialogVisible.value = false
        } else {
            ElMessage.error(res.message || '登录失败')
        }
    } catch (err) {
        ElMessage.error('登录失败，请检查网络')
    } finally {
        loginLoading.value = false
    }
}

const handleRegister = async () => {
    if (!registerForm.value.username) {
        ElMessage.warning('请填写用户名')
        return
    }
    if (!registerForm.value.password) {
        ElMessage.warning('请填写密码')
        return
    }
    if (registerForm.value.password.length < 6) {
        ElMessage.warning('密码长度至少6位')
        return
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        ElMessage.warning('两次输入的密码不一致')
        return
    }
    registerLoading.value = true
    try {
        const res = await register({
            username: registerForm.value.username,
            password: registerForm.value.password,
            realName: registerForm.value.realName
        })
        if (res.code === 200) {
            ElMessage.success('注册成功，请登录')
            switchToLogin()
        } else {
            ElMessage.error(res.message || '注册失败')
        }
    } catch (err) {
        ElMessage.error('注册失败，请检查网络')
    } finally {
        registerLoading.value = false
    }
}

const handleCommand = (command) => {
    if (command === 'userInfo') {
        ElMessage.info(`当前用户：${userName.value}`)
    } else if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            userStore.logout()
            ElMessage.success('已退出登录')
        }).catch(() => {})
    }
}
</script>

<template>
    <div class="topContainer">
        <a href="/" class="logo">服装ERP项目</a>
        <el-button v-if="!isLoggedIn" class="login-btn" @click="goToLogin">登录</el-button>
        <el-dropdown v-else @command="handleCommand">
            <span class="user-dropdown-link">
                <el-icon :size="20"><User /></el-icon>
                <span class="user-name">{{ userName }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

    <!-- 登录/注册对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'login' ? '登录' : '注册'" width="400px">
        <el-form v-if="dialogMode === 'login'" :model="loginForm" label-width="80px">
            <el-form-item label="用户名" required>
                <el-input v-model="loginForm.username" placeholder="请输入用户名" @keyup.enter="handleLogin" />
            </el-form-item>
            <el-form-item label="密码" required>
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password @keyup.enter="handleLogin" />
            </el-form-item>
        </el-form>
        <el-form v-else :model="registerForm" label-width="80px">
            <el-form-item label="用户名" required>
                <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" required>
                <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（至少6位）" show-password />
            </el-form-item>
            <el-form-item label="确认密码" required>
                <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
            </el-form-item>
            <el-form-item label="真实姓名">
                <el-input v-model="registerForm.realName" placeholder="请输入真实姓名（可选）" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <div v-if="dialogMode === 'login'" class="switch-mode">
                    <span class="link-text" @click="switchToRegister">还没有账号？立即注册</span>
                </div>
                <div v-else class="switch-mode">
                    <span class="link-text" @click="switchToLogin">已有账号？立即登录</span>
                </div>
                <div class="buttons">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button v-if="dialogMode === 'login'" type="primary" :loading="loginLoading" @click="handleLogin">登录</el-button>
                    <el-button v-else type="primary" :loading="registerLoading" @click="handleRegister">注册</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
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
.dialog-footer {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.switch-mode {
    text-align: center;
}
.link-text {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
}
.link-text:hover {
    text-decoration: underline;
}
.buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
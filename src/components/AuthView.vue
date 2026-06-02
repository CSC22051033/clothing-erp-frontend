<script setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { login, register } from '../api/auth'

const userStore = useUserStore()
// 当前模式: 'login' 或 'register'
const authMode = ref('login')

// 表单数据
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', password: '', confirmPassword: '', realName: '' })

// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)

// 切换到注册模式
const switchToRegister = () => {
    authMode.value = 'register'
    registerForm.value = { username: '', password: '', confirmPassword: '', realName: '' }
}

// 切换到登录模式
const switchToLogin = () => {
    authMode.value = 'login'
    loginForm.value = { username: '', password: '' }
}

// 登录处理
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
        // 登录成功后 isLoggedIn 变为 true，App 会自动隐藏本组件并显示首页
        } else {
        ElMessage.error(res.message || '登录失败')
        }
    } catch (err) {
        ElMessage.error('登录失败，请检查网络')
    } finally {
        loginLoading.value = false
    }
}

// 注册处理
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
</script>

<template>
    <div class="auth-wrapper">
        <div class="auth-card">
        <div class="auth-header">
            <h2>{{ authMode === 'login' ? '登录' : '注册' }}</h2>
            <p class="subtitle">
            {{ authMode === 'login' ? '欢迎回来，请登录您的账号' : '创建新账号，开始使用服装ERP' }}
            </p>
        </div>

        <!-- 登录表单 -->
        <el-form v-if="authMode === 'login'" :model="loginForm" class="auth-form">
            <el-form-item>
            <el-input
                v-model="loginForm.username"
                placeholder="用户名"
                :prefix-icon="User"
                size="large"
                @keyup.enter="handleLogin"
            />
            </el-form-item>
            <el-form-item>
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                :prefix-icon="Lock"
                size="large"
                show-password
                @keyup.enter="handleLogin"
            />
            </el-form-item>
            <el-form-item>
            <el-button
                type="primary"
                size="large"
                :loading="loginLoading"
                @click="handleLogin"
                class="submit-btn"
            >
                登录
            </el-button>
            </el-form-item>
            <div class="auth-footer">
            <span class="link-text" @click="switchToRegister">还没有账号？立即注册</span>
            </div>
        </el-form>

        <!-- 注册表单 -->
        <el-form v-else :model="registerForm" class="auth-form">
            <el-form-item>
            <el-input
                v-model="registerForm.username"
                placeholder="用户名"
                :prefix-icon="User"
                size="large"
            />
            </el-form-item>
            <el-form-item>
            <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码（至少6位）"
                :prefix-icon="Lock"
                size="large"
                show-password
            />
            </el-form-item>
            <el-form-item>
            <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="确认密码"
                :prefix-icon="Lock"
                size="large"
                show-password
            />
            </el-form-item>
            <el-form-item>
            <el-input
                v-model="registerForm.realName"
                placeholder="真实姓名（可选）"
                :prefix-icon="User"
                size="large"
            />
            </el-form-item>
            <el-form-item>
            <el-button
                type="primary"
                size="large"
                :loading="registerLoading"
                @click="handleRegister"
                class="submit-btn"
            >
                注册
            </el-button>
            </el-form-item>
            <div class="auth-footer">
            <span class="link-text" @click="switchToLogin">已有账号？立即登录</span>
            </div>
        </el-form>
        </div>
    </div>
</template>

<style scoped>
.auth-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #fff;
    min-height: 85dvh;
}

.auth-card {
    width: 100%;
    max-width: 440px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.1);
    padding: 40px 32px;
    transition: transform 0.2s ease;
}

.auth-card:hover {
    transform: translateY(-4px);
}

.auth-header {
    text-align: center;
    margin-bottom: 32px;
}

.auth-header h2 {
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
}

.subtitle {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

.auth-form {
    margin-top: 8px;
}

.auth-form :deep(.el-form-item) {
    margin-bottom: 20px;
}

.auth-form :deep(.el-input__wrapper) {
    border-radius: 10px;
    transition: all 0.2s;
}

.auth-form :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #409eff inset;  /* 蓝色边框 */
}

.auth-form :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2), 0 0 0 1px #409eff inset;
}

.submit-btn {
    width: 100%;
    background-color: #409eff;  /* 纯蓝色，无渐变 */
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    height: 48px;
    transition: opacity 0.2s;
}

.submit-btn:hover {
    opacity: 0.85;
    background-color: #409eff;
}

.auth-footer {
    text-align: center;
    margin-top: 16px;
}

.link-text {
    color: #409eff;  /* 蓝色链接 */
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
}

.link-text:hover {
    color: #337ecc;
    text-decoration: underline;
}
</style>
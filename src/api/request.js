import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: '/api',
    timeout: 10000
});

// 请求拦截器：携带 token
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截器：处理 token 过期
request.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response?.status === 401) {
            ElMessage.error('登录已过期，请重新登录');
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.reload();
        } else {
            ElMessage.error(error.response?.data?.message || '请求失败');
        }
        return Promise.reject(error);
    }
);

export default request;
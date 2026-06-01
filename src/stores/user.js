import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
    }),
    getters: {
        isLoggedIn: (state) => !!state.token && !!state.userInfo,
        userName: (state) => state.userInfo?.realName || state.userInfo?.username || ''
    },
    actions: {
        setLoginData(data) {
            this.token = data.token;
            this.userInfo = data.userInfo;
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        },
        logout() {
            this.token = '';
            this.userInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        }
    }
});
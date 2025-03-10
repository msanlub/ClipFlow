import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        user: null,
        token: null
    }),
    actions: {
        logIn(user) {
            this.user = user
            this.token = user.access_token
        },
        logOut(user) {          
            this.user = null
        }
    }
})
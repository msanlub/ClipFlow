import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        user: null
    }),
    actions: {
        logIn(user) {
            this.user = user
        },
        logOut(user) {          
            this.user = null
        }
    }
})
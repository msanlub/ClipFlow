import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    isLoading: false, 
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async setAuth(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('authToken', token);
    },
    
    async logIn(email, password) {
      this.isLoading = true;
      try {
        const response = await axios.post('http://localhost/api/v1/auth/login', {
          email,
          password,
        });
        
        await this.setAuth(response.data.user, response.data.access_token);
        return true;
      } catch (error) {
        console.error('Error iniciando sesión:', error.response?.data || error);
        throw error.response?.data?.message || 'Error inesperado';
      } finally {
        this.isLoading = false;
      }
    },

    logOut() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('authToken');
    },
  },
});

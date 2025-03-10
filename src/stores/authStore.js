import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    isLoading: false, 
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async logIn(email, password) {
      this.isLoading = true;
      try {
        const response = await axios.post('http://localhost/api/v1/auth/login', {
          email,
          password,
        });

        const { user, access_token } = response.data;

        this.user = user;
        this.token = access_token;

        // Guardar token en localStorage
        localStorage.setItem('authToken', access_token);

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

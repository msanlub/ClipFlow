<template>
  <div class="form-container">
    <h2>Login</h2>
    <form @submit.prevent="submit" class="form-containerField">
      <div class="form-field">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          :class="{'input-error': errors.email}"
          placeholder="Enter your email"
          @input="validateEmail"
          @blur="validateEmail" 
        />
        <span v-if="errors.email" class="form__error">{{ errors.email }}</span>

      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          :class="{'input-error': errors.password}"
          placeholder="Enter your password" 
          @input="validatePassword"
          @blur="validatePassword"
        />
        <span v-if="errors.password" class="form__error">{{ errors.password }}</span>
      </div>

      <!-- Mostrar mensaje de error si existe -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Cargando...' : 'Login' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', 
      errors: {
        email: '',
        password: '',
      }
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!emailRegex.test(this.email)) {
        this.errors.email = 'Please enter a valid email';
      } else {
        this.errors.email = '';
      }
    },
    validatePassword() {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!this.password) {
        this.errors.password = 'Password is required';
      } else if (!passwordRegex.test(this.password)) {
        this.errors.password = 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character';
      } else {
        this.errors.password = '';
      }
    },
    async submit() {
      try {
        // Llamar a la acción logIn del authStore
        await this.authStore.logIn(this.email, this.password);

        // Redirigir al usuario después del inicio de sesión exitoso
        this.$router.push('/user');

        // Limpiar los campos del formulario
        this.email = '';
        this.password = '';
      } catch (error) {
        // Mostrar mensaje de error al usuario
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style scoped>
  @import '../../src/scss/main.scss';
</style>

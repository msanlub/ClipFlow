<template>
  <div class="form-container">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <div class="form-field">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
        />
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
        />
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
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
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
.form-container {
  max-width: 400px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>

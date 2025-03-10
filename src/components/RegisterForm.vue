<template>
  <div class="form-container">
    <h2>Register</h2>
    <form @submit.prevent="submit">
      <div class="form-field">
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          placeholder="Enter your name" 
        />
      </div>

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

      <div class="form-field">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          placeholder="Confirm your password" 
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="close">Cancel</button>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/api/api'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    clean() {
      this.name = ''
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
    },
    async submit() {
      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
      };

      try {
        // Enviar datos al endpoint de registro
        const response = await api.post('/register', formData);

        // Obtener el token y los datos del usuario de la respuesta
        const token = response.data.access_token;

        // Usar el authStore para guardar los datos del usuario y el token
        const authStore = useAuthStore();
        authStore.logIn(response.data.user, token);

        // Redirigir al usuario a la página de usuario (o cualquier otra página)
        this.$router.push('/user');

        // Limpiar los campos del formulario
        this.clean();

        console.log('Usuario registrado con éxito:', response.data);
      } catch (error) {
        // Manejar errores
        if (error.response) {
          console.error('Error registrando al usuario:', error.response.data);
        } else {
          console.error('Error inesperado:', error);
        }
      }
  },

  }
}
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
</style>

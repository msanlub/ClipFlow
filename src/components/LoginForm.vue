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
          :class="{'input-error': errors.email}"
          placeholder="Ingrese su email"
          required
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      
      <div class="form-field">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="password"
          :class="{'input-error': errors.password}"
          placeholder="Ingrese su contraseña"
          required
        />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/api/api'; 

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      errors: {},
      isSubmitting: false,
    };
  },
  methods: {
    validateForm() {
      this.errors = {}; 
      let isValid = true;

      // Validación del email
      if (!this.email || !/.+@.+\..+/.test(this.email)) {
        this.errors.email = 'Ingrese un email válido.';
        isValid = false;
      }

      // Validación de la contraseña
      if (!this.password || this.password.length < 8) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres.';
        isValid = false;
      }

      return isValid;
    },
    async submit() {
      if (this.validateForm()) {
        this.isSubmitting = true;

        try {
          const response = await api.post('/login', {
            email: this.email,
            password: this.password,
          });

          // Guardar token de acceso y usuario en el almacenamiento local
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          // Emitir evento de autenticación
          this.$emit('authenticated', response.data.user);

          // Redirigir a la página del usuario
          this.$router.push('/user');

          // limpia el formulario
          this.email = '';
          this.password = '';
        } catch (error) {
          
          if (error.response && error.response.data) {
            this.errors = error.response.data.error ? { email: error.response.data.error } : {};
          }
          console.error('Error al iniciar sesión:', error);
        } finally {
          this.isSubmitting = false;
        }
      }
    },
  },
};
</script>

<style scoped>
@import '../scss/main.scss';
</style>

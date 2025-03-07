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
    submit() {
      if (this.validateForm()) {
        this.isSubmitting = true;
        // Simulación de login vía API
        const userData = { email: this.email };
        this.$emit('authenticated', userData);
        this.email = '';
        this.password = '';
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
@import '../scss/main.scss'
</style>

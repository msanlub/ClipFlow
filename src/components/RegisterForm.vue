<template>
  <div class="form-container">
    <h2>Register</h2>
    <form @submit.prevent="submit" class="form-containerField">
      <div class="form-field">
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          :class="{'input-error': errors.name}"
          placeholder="Enter your name" 
          @input="validateName"
          @blur="validateName"
        />
        <span v-if="errors.name" class="form__error">{{ errors.name }}</span>

      </div>

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

      <div class="form-field">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          :class="{'input-error': errors.confirmPassword}"
          placeholder="Confirm your password"
          @input="validateConfirmPassword"
          @blur="validateConfirmPassword" 
        />
        <span v-if="errors.confirmPassword" class="form__error">{{ errors.confirmPassword }}</span>

      </div>

      <div class="form-actions">
        <button type="button" @click="clean">Cancel</button>
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
      confirmPassword: '',
      errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    validateName() {
      if (!this.name.trim()) {
        this.errors.name = 'Name is required';
      } else {
        this.errors.name = '';
      }
    },
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
    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password';
      } else if (this.confirmPassword !== this.password) {
        this.errors.confirmPassword = "Passwords don't match";
      } else {
        this.errors.confirmPassword = '';
      }
    },
    validateForm() {
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();
      return !Object.values(this.errors).some(error => error !== '');
    },
    
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

        // Obtener el usuario y token de la respuesta
        const user = response.data.user;
        const token = response.data.access_token;

        // guardar los datos del usuario y el token en el store
        const authStore = useAuthStore();
        await authStore.setAuth(user, token);

        // Redirigir al usuario a la página de usuario (o cualquier otra página)
        this.$router.push('/user');

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
  @import '../../src/scss/main.scss';
</style>

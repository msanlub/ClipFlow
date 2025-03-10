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
        password_confirmation: this.confirmPassword
      }

      try {
        const response = await api.post('/register', formData)
        const token = response.data.access_token
        localStorage.setItem('authToken', token)

        // Usando Pinia
        const authStore = useAuthStore()
        // Asignamos directamente o llamamos a una acción definida en el store
        authStore.user = response.data.user
        authStore.token = token

        this.$router.push('/user')
        this.clean()
        console.log(token)
        console.log('Usuario registrado con éxito', response.data)
      } catch (error) {
      
        console.error('Error registrando al usuario', error)
      }
    }
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

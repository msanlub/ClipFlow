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

      <div class="form-actions">
        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Cargando...' : 'Login' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  methods: {
    async submit() {
      try {
        const response = await this.authStore.logIn(this.email, this.password)
        if (response) {
          this.$router.push('/user')
          this.email = ''
          this.password = ''
        }
      } catch (error) {
        console.error('Error logging in:', error)
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

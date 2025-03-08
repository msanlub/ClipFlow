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
          @input="validateEmail"
          @blur="touched.email = true"
          :class="{ 'input-error': errors.email && touched.email }"
          placeholder="Enter your email"
        />
        <span v-if="errors.email && touched.email" class="error">{{ errors.email }}</span> 
      </div>
      
      <div class="form-field">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          @input="validatePassword"
          @blur="touched.password = true"
          :class="{ 'input-error': errors.password && touched.password }" 
          placeholder="Enter your password"
        />
        <span v-if="errors.password && touched.password" class="error">{{ errors.password }}</span> 
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="authStore.isLoading || !validateForm()">
          {{ authStore.isLoading ? 'Cargando...' : 'Login' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref({})
const touched = ref({
  email: false,
  password: false
}) 

const validateEmail = () => {
    errors.value.email = ''
    if (!email.value) {
        errors.value.email = 'This field is required'
    } else if (!/.+@.+\..+/.test(email.value)) {
        errors.value.email = 'Please enter a valid email'
    }
}

const validatePassword = () => {
    errors.value.password = ''
    if (!password.value) {
        errors.value.password = 'This field is required'
    } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password.value)
    ) {
        errors.value.password =
            'The password must be at least 8 characters long, one uppercase, one lowercase, one number, and one special character'
    }
}

const validateForm = () => {
    validateEmail()
    validatePassword()

    return !errors.value.email && !errors.value.password
}

const submit = async () => {
    if (validateForm()) {
        const success = await authStore.logIn(email.value, password.value)

        if (success) {
            router.push('/user') // Redirigir al usuario
            email.value = ''
            password.value = ''
        } else {
            errors.value.email = authStore.error
        }
    }
}
</script>

<style scoped>
.input-error {
  border-color: red;
}

.error {
  color: red;
  font-size: 0.875rem;
}

.form-field {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}
</style>

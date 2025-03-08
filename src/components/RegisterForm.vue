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
          @input="validateName"
          @blur="touched.name = true"
          :class="{ 'input-error': errors.name && touched.name }"
          placeholder="Enter your name" 
        />
        <span v-if="errors.name && touched.name" class="error">{{ errors.name }}</span>
      </div>

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

      <div class="form-field">
        <label for="confirmPassword">Confirm password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          @input="validateConfirmPassword"
          @blur="touched.confirmPassword = true"
          :class="{ 'input-error': errors.confirmPassword && touched.confirmPassword }"
          placeholder="Confirm password" 
        />
        <span v-if="errors.confirmPassword && touched.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
      </div>

      <div class="form-actions">
        <button type="button" @click="close">Cancel</button>
        <button type="submit" :disabled="!validateForm()">Register</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import api from '@/api/api'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref({})
const touched = ref({
  name: false,
  email: false,
  password: false,
  confirmPassword: false
})

const validateName = () => {
  errors.value.name = ''
  if (!name.value) {
    errors.value.name = 'This field is required'
  }
}

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
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password.value)) {
    errors.value.password = 'The password must be at least 8 characters long, one uppercase, one lowercase, one number, and one special character'
  }
}

const validateConfirmPassword = () => {
  errors.value.confirmPassword = ''
  if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'The passwords do not match'
  }
}

const validateForm = () => {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  return !Object.values(errors.value).some(error => error)
}

const close = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  errors.value = {}
  Object.keys(touched.value).forEach(key => touched.value[key] = false)
}

const submit = async () => {
  if (validateForm()) {
    const formData = {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    }

    try {
      const response = await api.post('/register', formData)
      
      const token = response.data.token
      localStorage.setItem('authToken', token)
      
      authStore.user = response.data.user
      authStore.token = token
      
      router.push('/user')
      close()
      
      console.log('Usuario registrado con éxito', response.data)
    } catch (error) {
      if (error.response && error.response.data.errors) {
        errors.value = error.response.data.errors
      }
      console.error('Error registrando al usuario', error)
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

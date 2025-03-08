<template>
  <div class="form-container">
    <h2>Register</h2>
    <form ref="form" @submit.prevent="submit">
      <div class="form-field">
        <label for="name">Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          @input="validateName" 
          @blur="touched.name = true" 
          :class="{'is-invalid': errors.name && touched.name}" 
          placeholder="Enter your name" 
        />
        <span v-if="errors.name && touched.name" class="error-message">{{ errors.name }}</span> 
      </div>

      <div class="form-field">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          @input="validateEmail" 
          @blur="touched.email = true"
          :class="{'is-invalid': errors.email && touched.email}"
          placeholder="Enter your email" 
        />
        <span v-if="errors.email && touched.email" class="error-message">{{ errors.email }}</span> 
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          @input="validatePassword" 
          @blur="touched.password = true" 
          :class="{'is-invalid': errors.password && touched.password}" 
          placeholder="Enter your password" 
        />
        <span v-if="errors.password && touched.password" class="error-message">{{ errors.password }}</span> 
      </div>

      <div class="form-field">
        <label for="confirmPassword">Confirm password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          @input="validateConfirmPassword" 
          @blur="touched.confirmPassword = true" 
          :class="{'is-invalid': errors.confirmPassword && touched.confirmPassword}" 
          placeholder="Confirm password" 
        />
        <span v-if="errors.confirmPassword && touched.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span> 
      </div>

      <div class="form-actions">
        <button type="button" @click="close">Cancel</button>
        <button type="submit" :disabled="!isFormValid">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'; 
import api from '@/api/api';

export default {
  name: 'RegisterForm',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: this.modelValue,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      touched: {
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      }, // Estado para saber si el campo ha sido tocado
    };
  },
  computed: {
    isFormValid() {
      return !Object.values(this.errors).some(error => error);
    },
  },
  methods: {
    close() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.errors = {}; 
      this.$refs.form.reset(); 
      this.value = false; 
      this.$emit('update:modelValue', this.value); 
    },
    validateName() {
      if (this.touched.name) {
        if (!this.name) {
          this.errors.name = 'This field is required';
        } else {
          this.errors.name = '';
        }
      }
    },
    validateEmail() {
      if (this.touched.email) {
        if (!this.email) {
          this.errors.email = 'This field is required';
        } else if (!/.+@.+\..+/.test(this.email)) {
          this.errors.email = 'Please enter a valid email';
        } else {
          this.errors.email = '';
        }
      }
    },
    validatePassword() {
      if (this.touched.password) {
        if (!this.password) {
          this.errors.password = 'This field is required';
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(this.password)
        ) {
          this.errors.password =
            'The password must be at least 8 characters long, one uppercase, one lowercase, one number, and one special character';
        } else {
          this.errors.password = '';
        }
      }
    },
    validateConfirmPassword() {
      if (this.touched.confirmPassword) {
        if (this.confirmPassword !== this.password) {
          this.errors.confirmPassword = 'The passwords do not match';
        } else {
          this.errors.confirmPassword = '';
        }
      }
    },
    async submit() {
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();

      if (!this.isFormValid) return;

      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
      };

      try {
        const response = await api.post('/register', formData);
        
        // almacena el usuario y el token
        const authStore = useAuthStore();
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        
        authStore.user = response.data.user;
        authStore.token = token;
        
        // Redirigir al usuario y limpiar el formulario
        this.$emit('registered', response.data.user);
        this.$router.push('/user');
        this.close();
        
        console.log('Usuario registrado con éxito', response.data);
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors; 
        }
        console.error('Error registrando al usuario', error);
      }
    },
  },
};
</script>

<style scoped>
 @import '../scss/components/_forms.scss'
</style>

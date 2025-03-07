<template>
  <div class="form-container">
    <h2>Registro</h2>
    <form ref="form" @submit.prevent="submit">
      <div class="form-field">
        <label for="name">Nombre</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          @input="validateName" 
          :class="{'is-invalid': errors.name}" 
          placeholder="Nombre" 
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-field">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          @input="validateEmail" 
          :class="{'is-invalid': errors.email}" 
          placeholder="Email" 
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-field">
        <label for="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          @input="validatePassword" 
          :class="{'is-invalid': errors.password}" 
          placeholder="Contraseña" 
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-field">
        <label for="confirmPassword">Confirmar contraseña</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          @input="validateConfirmPassword" 
          :class="{'is-invalid': errors.confirmPassword}" 
          placeholder="Confirmar Contraseña" 
        />
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>

      <div class="form-actions">
        <button type="button" @click="close">Cancelar</button>
        <button type="submit" :disabled="!isFormValid">Registrarse</button>
      </div>
    </form>
  </div>
</template>

<script>
// Importa la instancia de axios configurada previamente
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
    };
  },
  computed: {
    isFormValid() {
      return !Object.values(this.errors).some(error => error);
    },
  },
  methods: {
    close() {
      // Limpiar todos los campos del formulario
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.errors = {}; // Limpiar errores
      this.$refs.form.reset(); // Resetear el formulario
      this.value = false; // Cerrar el modal
      this.$emit('update:modelValue', this.value); // Emitir el cambio al padre
    },
    validateName() {
      if (!this.name) {
        this.errors.name = 'Este campo es requerido.';
      } else {
        this.errors.name = '';
      }
    },
    validateEmail() {
      if (!this.email) {
        this.errors.email = 'Este campo es requerido.';
      } else if (!/.+@.+\..+/.test(this.email)) {
        this.errors.email = 'Ingrese un email válido.';
      } else {
        this.errors.email = '';
      }
    },
    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Este campo es requerido.';
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(this.password)
      ) {
        this.errors.password =
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
      } else {
        this.errors.password = '';
      }
    },
    validateConfirmPassword() {
      if (this.confirmPassword !== this.password) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden.';
      } else {
        this.errors.confirmPassword = '';
      }
    },
    async submit() {
      // Se valida todo el formulario antes de enviarlo
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();

      if (!this.isFormValid) return;

      // Crear el objeto con los datos del formulario
      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
      };

      try {
        // Enviar el formulario a la API para registrar el usuario
        const response = await api.post('/register', formData);
        
        // Si el registro es exitoso, guardar el token
        const token = response.data.token;
        localStorage.setItem('authToken', token);

        // Notificar al padre que el registro fue exitoso
        this.$emit('registered', response.data.user);

        // Redirigir a la página del usuario
        this.$router.push('/user');

        // Limpiar el formulario y cerrar el modal
        this.close();

        console.log('Usuario registrado con éxito', response.data);
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors; // Mostrar los errores en el formulario
        }
        console.error('Error registrando al usuario', error);
      }
    },
  },
  watch: {
    modelValue(val) {
      this.value = val;
    },
    value(val) {
      this.$emit('update:modelValue', val);
    },
  },
};
</script>

<style scoped>
 @import '../scss/components/_forms.scss'
</style>

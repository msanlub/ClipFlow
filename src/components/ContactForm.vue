<template>
  <div class="form-container">
    <h2>Contacto</h2>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input
          type="text"
          id="name"
          v-model="name"
          :class="{'input-error': errors.name}"
          placeholder="Ingrese su nombre"
          required
        />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>
      
      <div class="form-group">
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

      <div class="form-group">
        <label for="message">Mensaje</label>
        <textarea
          id="message"
          v-model="message"
          :class="{'input-error': errors.message}"
          placeholder="Escriba su mensaje"
          required
        ></textarea>
        <span v-if="errors.message" class="error">{{ errors.message }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">Enviar</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      name: '',
      email: '',
      message: '',
      errors: {},
      isSubmitting: false,
    };
  },
  methods: {
    validateForm() {
      this.errors = {}; // Limpiar errores previos
      let isValid = true;

      // Validación del nombre
      if (!this.name) {
        this.errors.name = 'Este campo es requerido.';
        isValid = false;
      }

      // Validación del email
      if (!this.email || !/.+@.+\..+/.test(this.email)) {
        this.errors.email = 'Ingrese un email válido.';
        isValid = false;
      }

      // Validación del mensaje
      if (!this.message) {
        this.errors.message = 'Este campo es requerido.';
        isValid = false;
      }

      return isValid;
    },
    submit() {
      if (this.validateForm()) {
        this.isSubmitting = true;
        // Simulación de enviar mensaje vía API
        alert('Mensaje enviado!');
        this.name = '';
        this.email = '';
        this.message = '';
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
  @import '../scss/components/_forms.scss';
</style>

<template>
  <div class="form-container">
    <h2>Contacto</h2>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          v-model="name"
          :class="{'input-error': errors.name}"
          placeholder="Enter your name"
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
          placeholder="Enter your email"
          required
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          id="message"
          v-model="message"
          :class="{'input-error': errors.message}"
          placeholder="Write your message"
          required
        ></textarea>
        <span v-if="errors.message" class="error">{{ errors.message }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">Send</button>
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
      this.errors = {};
      let isValid = true;

      // Validación del nombre
      if (!this.name) {
        this.errors.name = 'This field is required';
        isValid = false;
      }

      // Validación del email
      if (!this.email || !/.+@.+\..+/.test(this.email)) {
        this.errors.email = 'Please enter a valid email';
        isValid = false;
      }

      // Validación del mensaje
      if (!this.message) {
        this.errors.message = 'This field is required';
        isValid = false;
      }

      return isValid;
    },
    submit() {
      if (this.validateForm()) {
        this.isSubmitting = true;
        // TOODO enviar el mensaje a un endpoint de contacto wei
        alert('Message sent successfully!');
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

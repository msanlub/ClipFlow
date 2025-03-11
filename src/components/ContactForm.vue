<template>
  <div class="container__form">
    <h2>Contacto</h2>
    <form @submit.prevent="submit">
      <div class="form__group">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          v-model="name"
          :class="{'input-error': errors.name}"
          placeholder="Enter your name"
          @input="validateName"
          @blur="validateName"
          required
        />
        <span v-if="errors.name" class="form__error">{{ errors.name }}</span>
      </div>
      
      <div class="form__group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          :class="{'input-error': errors.email}"
          placeholder="Enter your email"
          @input="validateEmail"
          @blur="validateEmail"
          required
        />
        <span v-if="errors.email" class="form__error">{{ errors.email }}</span>
      </div>

      <div class="form__group">
        <label for="message">Message</label>
        <textarea
          id="message"
          v-model="message"
          :class="{'input-error': errors.message}"
          placeholder="Write your message"
          @input="validateMessage"
          @blur="validateMessage"
          required
        ></textarea>
        <span v-if="errors.message" class="form__error">{{ errors.message }}</span>
      </div>

      <div class="form__actions">
        <button type="button" @click="cancel">Cancel</button>
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
    validateName() {
      if (!this.name) {
        this.errors.name = 'This field is required';
      } else {
        this.errors.name = '';
      }
    },
    validateEmail() {
      if (!this.email || !/.+@.+\..+/.test(this.email)) {
        this.errors.email = 'Please enter a valid email';
      } else {
        this.errors.email = '';
      }
    },
    validateMessage() {
      if (!this.message) {
        this.errors.message = 'This field is required';
      } else {
        this.errors.message = '';
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      this.validateName();
      if (this.errors.name) isValid = false;

      this.validateEmail();
      if (this.errors.email) isValid = false;

      this.validateMessage();
      if (this.errors.message) isValid = false;

      return isValid;
    },
    submit() {
      if (this.validateForm()) {
        this.isSubmitting = true;
        // TODO: Enviar el mensaje a un endpoint de contacto
        alert('Message sent successfully!');
        this.resetForm();
        this.isSubmitting = false;
      }
    },
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.message = '';
      this.errors = {};
    },
  },
};
</script>

<style scoped>
  @import '../scss/components/_forms.scss';
</style>

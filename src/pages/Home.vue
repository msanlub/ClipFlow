<script>
import TemplateList from '@/components/TemplateList.vue';
import ContactForm from '@/components/ContactForm.vue';

export default {
  name: 'Home',
  components: {
    TemplateList,
    ContactForm,
  }
}
</script>

<template>
  <div class="container__home" >
    <TemplateList />
    <h2 class="home__contacts">Do you have any suggestions? Tell us!</h2>
    <ContactForm />
  </div>
</template>

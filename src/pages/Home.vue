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
  <TemplateList />
  <ContactForm />
</template>

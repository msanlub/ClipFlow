<script>
import TemplateList from '@/components/TemplateList.vue';

export default {
  name: 'Home',
  components: {
    TemplateList
  }
}
</script>

<template>
  <TemplateList />
  <ContactForm />
</template>

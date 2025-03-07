<template>
  <Header />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import TemplateList from './components/TemplateList.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import ContactForm from './components/ContactForm.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    TemplateList,
    ContactForm,
    LoginForm,
    RegisterForm,
  },
  
}
</script>

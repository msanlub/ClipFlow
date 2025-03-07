<template>
  <header class="header">
    
    <!-- Logo -->
    <div>
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Menú -->
    <nav class="menu">
      <router-link to="/" class="menu-link">Home</router-link>
      <router-link to="/register" class="menu-link">Registro</router-link>
      <router-link to="/login" class="menu-link">Login</router-link>
    </nav>

    <!-- Botón para cambiar tema -->
    <button
        @click="toggleTheme"
        @keydown.enter="toggleTheme"
        class="theme-icon"
        :class="{ 'theme-icon--dark': isDark, 'theme-icon--light': !isDark }"
        tabindex="0"
        role="button"
      >
        <font-awesome-icon :icon="isDark ? ['fas', 'moon'] : ['fas', 'sun']" />
      </button>

    
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Registrar iconos en la librería
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(fas);

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
};

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});
</script>

<style lang="scss" scoped>
  @import '../../src/scss/main.scss';
</style>
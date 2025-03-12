<template>
  <header class="header">
    <!-- Logo -->
    <div>
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Menú -->
    <nav class="menu">
      <router-link to="/" class="menu-link">Home</router-link>
      
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/register" class="menu-link">Registro</router-link>
        <router-link to="/login" class="menu-link">Login</router-link>
      </template>
      
      <!-- Si está autenticado, muestra User y LogOut -->
      <template v-else>
        <router-link to="/user" class="menu-link">User</router-link>
        <button @click="logout" class="menu-link">LogOut</button>
      </template>
    </nav>

    <!-- Botón para cambiar tema -->
    <button
      @click="toggleTheme"
      @keydown.enter="toggleTheme"
      class="theme-icon"
      :class="{ 'theme-icon--dark': themeStore.isDark, 'theme-icon--light': !themeStore.isDark }"
      tabindex="0"
      role="button"
    >
      <font-awesome-icon :icon="themeStore.isDark ? ['fas', 'moon'] : ['fas', 'sun']" />
    </button>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

// Registrar iconos en la librería
library.add(fas)

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

// sincronizo el dataTheme
onMounted(() => {
  document.documentElement.setAttribute('data-theme', themeStore.theme)
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const logout = () => {
  authStore.logOut()
  router.push('/')
}
</script>

<style lang="scss" scoped>
  @import '../../src/scss/main.scss';
</style>

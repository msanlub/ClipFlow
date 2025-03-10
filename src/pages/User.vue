<template>
  <div class="user-page">
    <h1>Welcome, {{ userName }}</h1>
    
    <!-- Verificar si los favoritos están cargando o si no hay favoritos -->
    <div v-if="loading">Loading your favorites...</div>
    <div v-else-if="userFavorites.length === 0">You have no favorites yet.</div>
    <FavoritesList v-else :favorites="userFavorites" />
  </div>
</template>

<script>
import FavoritesList from '@/components/FavoritesList.vue';
import privateAPI from '@/api/private';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'UserPage',
  components: {
    FavoritesList
  },
  data() {
    return {
      userName: '',
      userFavorites: [],
      loading: true // Indicador de carga
    };
  },
  async created() {
    const authStore = useAuthStore();

    if (!authStore.token) {
      // Si no hay token, redirigir al login
      this.$router.push('/login');
      return;
    }

    try {
      // Obtener datos del usuario desde el servidor
      const response = await privateAPI.get('/me');
      this.userName = response.data.name;

      // Obtener favoritos del usuario
      const favoritesResponse = await privateAPI.get('/favorites');
      this.userFavorites = favoritesResponse.data;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      this.$router.push('/login'); // Redirigir a login si ocurre un error
    } finally {
      this.loading = false; // Después de la carga, cambiar el estado de loading
    }
  }
};
</script>

<style scoped>
.user-page {
  padding: 2rem;
  background-color: #f9f9f9;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

div {
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}
</style>

<template>
  <div class="user-page">
    <h1>Welcome, {{ userName }}</h1>
    
    <!-- Lista de favoritos -->
    <FavoritesList :favorites="userFavorites" />
  </div>
</template>

<script>
import FavoritesList from '@/components/FavoritesList.vue';
import privateAPI from '@/api/private'; // Asegúrate de importar el cliente con autenticación
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'UserPage',
  components: {
    FavoritesList
  },
  data() {
    return {
      userName: '',
      userFavorites: []
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
</style>

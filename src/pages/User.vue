<template>
  <div class="user-page">
    <h1 class="user-name">Welcome, {{ userName }}</h1>

    <!-- Sección de plantillas favoritos -->
    <div v-if="loading">Loading your favorites...</div>
    <div v-else-if="userFavorites.length === 0">You have no favorites yet.</div>
    <FavoritesList v-else :favorites="userFavorites" />

    <!-- Sección de videos del usuario -->
    <h2 class="user-videos">Your videos</h2>
    <div v-if="loadingVideos">Loading your videos...</div>
    <div v-else-if="userVideos.length === 0">You have no videos yet.</div>
    <UserVideoList v-else :videos="userVideos" />
  </div>
</template>

<script>
import FavoritesList from '@/components/FavoritesList.vue';
import UserVideoList from '@/components/UserVideoList.vue';
import privateAPI from '@/api/private';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'UserPage',
  components: {
    FavoritesList,
    UserVideoList,
  },
  data() {
    return {
      userName: '',
      userFavorites: [],
      loading: true,
      loadingVideos: false,
      userVideos: []
    };
  },
  async created() {
    const authStore = useAuthStore();

    if (!authStore.token) {
      console.warn('No hay token disponible, redirigiendo al login...');
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

      //Obtener videos del usuario
      this.loadingVideos = true;
      const videosResponse = await privateAPI.get('/userVideos');
      this.userVideos = videosResponse.data;
      console.log("Videos obtenidos:", this.userVideos);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      if (error.response && error.response.status === 401) {
        this.$router.push('/login');
      }
    } finally {
      this.loading = false;
      this.loadingVideos = false; 
    }
    
  }

};
</script>

<style scoped>
 @import '../../src/scss/main.scss';
</style>

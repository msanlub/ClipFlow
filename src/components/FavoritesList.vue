<template>
  <!-- Tu template se mantiene igual -->
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import privateAPI from '@/api/private';

export default {
  name: 'FavoritesList',
  data() {
    return {
      favorites: [],
      isLoading: false,
      error: null,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
  },
  methods: {
    getImagePath(path) {
      return path ? `http://localhost/${path.replace(/\\/g, '/')}` : '';
    },
    async fetchFavorites() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const response = await privateAPI.get('/favorites');
        this.favorites = response.data;
      } catch (error) {
        console.error('Error al obtener los favoritos:', error);
        this.error = 'No se pudieron cargar los favoritos. Por favor, intenta de nuevo.';

        if (error.response && error.response.status === 401) {
          this.authStore.logOut();
          this.$router.push('/login');
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.fetchFavorites();
  },
 
};
</script>

<style scoped>
@import '../scss/main.scss';

/* Estilos adicionales para la lista de favoritos */
.templates {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.template-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  width: 200px;
  text-align: center;
  background-color: #f9f9f9;
}

.template-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.template-info {
  font-size: 16px;
  margin: 10px 0;
}

.no-favorites {
  font-size: 18px;
  color: #888;
}
</style>

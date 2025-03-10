<template>
  <div class="favorites-list">
    <h2>Favorites templates</h2>

    <!-- Mostrar mensaje si no hay favoritos -->
    <div v-if="favorites.length === 0" class="no-favorites">
      No tienes favoritos aún.
    </div>

    <!-- Mostrar lista de favoritos -->
    <section v-else class="templates">
      <div v-for="favorite in favorites" :key="favorite.id" class="template-card">
        <img :src="getImagePath(favorite.template.icon_path)" alt="Imagen de plantilla" class="template-image" />
        <h3 class="template-info">{{ favorite.template.name }}</h3>
        <p class="template-info">{{ favorite.template.description }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import privateAPI from '@/api/private';

export default {
  name: 'FavoritesList',
  data() {
    return {
      favorites: [],
    };
  },
  computed: {
    authStore() {
      return useAuthStore(); 
    },
  },
  methods: {
    // Función para transformar la ruta de la imagen
    getImagePath(path) {
      return path ? `http://localhost/${path.replace(/\\/g, '/')}` : '';
    },
    async fetchFavorites() {
      // Verificar si el usuario está autenticado
      if (!this.authStore.token) {
        this.$router.push('/login');
        return;
      }

      try {
        const response = await privateAPI.get('/favorites');
        this.favorites = response.data;
      } catch (error) {
        console.error('Error al obtener los favoritos:', error);

        // Si el error es un 401, cerrar sesión y redirigir al login
        if (error.response && error.response.status === 401) {
          this.authStore.logOut();
          this.$router.push('/login');
        }
      }
    },
  },
  created() {
    // Llamar a fetchFavorites al crear el componente
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

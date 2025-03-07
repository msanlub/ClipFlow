<template>
  <div class="favorites-list">
    <h2>Favoritas</h2>
    <div class="templates">
      <div v-for="template in favorites" :key="template.id" class="template-card">
        <img :src="getImagePath(template.icon_path)" alt="Imagen de plantilla" class="template-image" />
        <h3 class="template-info">{{ template.name }}</h3>
        <p class="template-info">{{ template.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import privateAPI from "@/api/private"; // Usar privateAPI para las solicitudes autenticadas

export default {
  name: 'FavoritesList',
  data() {
    return {
      favorites: [] // Aquí se guardarán los favoritos
    };
  },
  computed: {
    // Método para obtener la ruta correcta del icono
    getImagePath() {
      return (path) => `http://localhost/${path.replace(/\\/g, '/')}`;
    }
  },
  methods: {
    // Método para obtener los favoritos desde la API
    fetchFavorites() {
      privateAPI.get('/favorites')
        .then(response => {
          this.favorites = response.data; // Asignamos la respuesta al array de favoritos
        })
        .catch(error => {
          console.error('Error al obtener los favoritos:', error);
        });
    }
  },
  created() {
    // Llamar al método fetchFavorites cuando el componente se monta
    this.fetchFavorites();
  }
}
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

.favorite-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: red;
}

.favorite-button:hover {
  color: #ff4d4d;
}
</style>

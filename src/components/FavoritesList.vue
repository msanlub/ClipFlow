<template>
  <div class="favorites-list">
    <h2>Favorites templates</h2>
    <section class="templates">
      <div v-for="favorite in favorites" :key="favorite.id" class="template-card">
        <img :src="getImagePath(favorite.template.icon_path)" alt="Imagen de plantilla" class="template-image" />
        <h3 class="template-info">{{ favorite.template.name }}</h3>
        <p class="template-info">{{ favorite.template.description }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import privateAPI from '@/api/private'

const router = useRouter()
const authStore = useAuthStore()
const favorites = ref([])

// Función para transformar la ruta de la imagen
const getImagePath = (path) => `http://localhost/${path.replace(/\\/g, '/')}`

const fetchFavorites = async () => {
  // si el usuario no está logueado, lo mandamos al login
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  try {
    const response = await privateAPI.get('/favorites')
    favorites.value = response.data
  } catch (error) {
    console.error('Error al obtener los favoritos:', error)
  }
}

onMounted(() => {
  fetchFavorites()
})
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

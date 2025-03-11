<template>
  <div>
    <!-- Título -->
    <h2>Your Favorite Templates</h2>

    <!-- Lista de Plantillas Favoritas -->
    <div class="templates" v-if="favorites.length > 0">
      <div v-for="template in favorites" :key="template.id" class="template-card">
        <!-- Mostrar el icono -->
        <img :src="template.icon_url" :alt="template.name" class="template-icon" />

        <h3 class="template-info">{{ template.name }}</h3>
        <p class="template-info">{{ template.description }}</p>

        <!-- Icono de corazón para eliminar de favoritos -->
        <button @click="removeFavorite(template)" class="favorite-button">
          <i class="fas fa-heart"></i>
        </button>

        <!-- Botón para usar la plantilla, abrir modal -->
        <button @click="openModal(template)" class="use-button">
          <i class="fas fa-play"></i> Use
        </button>
      </div>
    </div>
    <div v-else class="no-favorites">
      <p>No favorite templates yet.</p>
    </div>

    <!-- Componente del modal -->
    <TemplateFormModal :is-open="isModalOpen" :template="selectedTemplate" @close="closeModal" />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import privateAPI from '@/api/private';
import Swal from 'sweetalert2';
import TemplateFormModal from '@/components/ModalFormCreate.vue'; 

export default {
  name: 'FavoritesList',
  components: {
    TemplateFormModal, // Regístralo
  },
  data() {
    return {
      favorites: [],
      isLoading: false,
      error: null,
      isModalOpen: false,
      selectedTemplate: null,
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
    async removeFavorite(template) {
      Swal.fire({
        title: 'Are you sure?',
        text: "This will remove the template from your favorites.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
      }).then((result) => {
        if (result.isConfirmed) {
          privateAPI.delete(`/favorites/${template.favorite_id}`)
            .then(() => {
              this.favorites = this.favorites.filter(fav => fav.id !== template.id);
              Swal.fire(
                'Removed!',
                'The template has been removed from your favorites.',
                'success'
              );
            })
            .catch((error) => {
              console.error('Error removing favorite:', error);
              Swal.fire(
                'Error!',
                'There was an error removing the template from your favorites.',
                'error'
              );
            });
        }
      });
    },
    openModal(template) {
      this.selectedTemplate = template;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
  created() {
    this.fetchFavorites();
  },
};
</script>

<style scoped>
/* Estilos */
</style>

<template>
  <div class="container__templates">
    <!-- Título -->
    <h2>Choose your template</h2>

    <!-- Lista de Plantillas -->
    <div class="templates">
      <div v-for="template in paginatedTemplates" :key="template.id" class="template-card">
        <!-- Mostrar el icono -->
        <img :src="template.icon_url" :alt="template.name" class="template-icon" />

        <h3 class="template-infoTitle">{{ template.name }}</h3>
        <p class="template-infoP">{{ template.description }}</p>

        <div class="template__button">
          <!-- Icono de corazón para favoritos -->
          <button @click="toggleFavorite(template)" class="favorite-button">
            <i :class="template.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>

          <!-- Botón para usar la plantilla, abrir modal -->
          <button @click="openModal(template)" class="use-button">
            <i class="fas fa-play"></i> Use
          </button>
        </div>
        
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination">
      <button @click="goToPage(page - 1)" :disabled="page === 1" class="pagination__buttonPrevius">Previous</button>
      <span class="pagination__number">{{ page }} / {{ totalPages }}</span>
      <button @click="goToPage(page + 1)" :disabled="page === totalPages" class="pagination__buttonNext">Next</button>
    </div>

    <!-- Componente del modal -->
    <TemplateFormModal :is-open="isModalOpen" :template="selectedTemplate" @close="closeModal" />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import api from '@/api/api';
import privateAPI from '@/api/private';
import Swal from 'sweetalert2';
import TemplateFormModal from '@/components/ModalFormCreate.vue';

export default {
  name: 'TemplateList',
  components: {
    TemplateFormModal, 
  },
  data() {
    return {
      templates: [],
      page: 1,
      templatesPerPage: 3,
      isModalOpen: false,
      selectedTemplate: null,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.templates.length / this.templatesPerPage);
    },
    paginatedTemplates() {
      const start = (this.page - 1) * this.templatesPerPage;
      const end = start + this.templatesPerPage;
      return this.templates.slice(start, end);
    }
  },
  methods: {
    fetchTemplates() {
      api.get('/templates')
        .then(response => {
          this.templates = response.data;
        })
        .catch(() => {
          Swal.fire('Error', 'Failed to fetch templates. Please try again later.', 'error');
        });
    },
    toggleFavorite(template) {
      const authStore = useAuthStore();
      if (!authStore.token) {
        Swal.fire('Authentication Required', 'Please log in to manage favorites.', 'info');
        this.$router.push('/login');
        return;
      }

      privateAPI.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
      if (template.favorite) {
        privateAPI.delete(`/favorites/${template.favorite_id}`)
          .then(() => {
            template.favorite = false;
            template.favorite_id = null;
            Swal.fire('Removed', 'Template removed from favorites.', 'success');
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to remove favorite. Please try again.', 'error');
          });
      } else {
        privateAPI.post('/favorites', { template_id: template.id })
          .then(response => {
            template.favorite = true;
            template.favorite_id = response.data.id;
            Swal.fire('Added', 'Template added to favorites.', 'success');
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to add favorite. Please try again.', 'error');
          });
      }
    },
    openModal(template) {
      this.selectedTemplate = template;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.page = pageNumber;
      }
    }
  },
  created() {
    this.fetchTemplates();
    
    // Escuchar eventos de login/logout para actualizar favoritos
    const authStore = useAuthStore();
    this.$watch(
      () => authStore.isAuthenticated,
      (newValue) => {
        if (newValue) {
          // El usuario se ha logueado, recargar para actualizar favoritos
          this.fetchTemplates();
        } else {
          // El usuario ha cerrado sesión, limpiar estado de favoritos
          this.templates = this.templates.map(template => {
            template.favorite = false;
            template.favorite_id = null;
            return template;
          });
        }
      }
    );
  }
};
</script>

<style >
 @import '../../src/scss/main.scss';
</style>

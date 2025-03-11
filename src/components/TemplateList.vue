<template>
  <div>
    <!-- Título -->
    <h2>Choose your template</h2>

    <!-- Lista de Plantillas -->
    <div class="templates">
      <div v-for="template in paginatedTemplates" :key="template.id" class="template-card">
        <!-- Mostrar el icono -->
        <img :src="template.icon_url" :alt="template.name" class="template-icon" />

        <h3 class="template-info">{{ template.name }}</h3>
        <p class="template-info">{{ template.description }}</p>

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

    <!-- Modal de formulario -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Customize your template</h3>

        <!-- Formulario -->
        <form @submit.prevent="generateTemplate">
          <!-- Imagen 1 -->
          <div>
            <label for="image1">Image 1</label>
            <input type="file" id="image1" @change="handleFileChange($event, 'image1')" required />
          </div>
          <!-- Imagen 2 -->
          <div>
            <label for="image2">Image 2</label>
            <input type="file" id="image2" @change="handleFileChange($event, 'image2')" required />
          </div>
          <!-- Imagen 3 -->
          <div>
            <label for="image3">Image 3</label>
            <input type="file" id="image3" @change="handleFileChange($event, 'image3')" required />
          </div>
          <!-- Imagen 4 -->
          <div>
            <label for="image4">Image 4</label>
            <input type="file" id="image4" @change="handleFileChange($event, 'image4')" required />
          </div>
          <!-- Texto 1 -->
          <div>
            <label for="text1">Text 1</label>
            <input type="text" id="text1" v-model.trim="formData.text1" maxlength="10" />
          </div>
          <!-- Texto 2 -->
          <div>
            <label for="text2">Text 2</label>
            <input type="text" id="text2" v-model.trim="formData.text2" maxlength="10" />
          </div>

          <!-- Botón de generar -->
          <button type="submit" class="generate-button">
            Generate
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          </button>
        </form>

        <!-- Botón de cerrar -->
        <button @click="closeModal" class="close-modal">Close</button>
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination">
      <button @click="goToPage(page - 1)" :disabled="page === 1">Previous</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button @click="goToPage(page + 1)" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import api from '@/api/api';
import privateAPI from '@/api/private';
import Swal from 'sweetalert2';

export default {
  name: 'TemplateList',
  data() {
    return {
      templates: [],
      page: 1,
      templatesPerPage: 3,
      isModalOpen: false,
      loading: false,
      selectedTemplate: null,
      formData: {
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        text1: '',
        text2: ''
      }
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
    handleFileChange(event, field) {
      const file = event.target.files[0];
      if (file) {
        // Validar formato y tamaño del archivo
        const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (!validFormats.includes(file.type)) {
          Swal.fire('Invalid File', 'Only JPEG, PNG, GIF, and SVG formats are allowed.', 'error');
          return;
        }
        if (file.size > 2048 * 1024) { // Tamaño máximo: 2MB
          Swal.fire('File Too Large', 'The file size must not exceed 2MB.', 'error');
          return;
        }
        this.formData[field] = file;
      }
    },
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
      this.formData = { image1: null, image2: null, image3: null, image4: null, text1: '', text2: '' };
    },
    async generateTemplate() {
      const authStore = useAuthStore();
      
      if (!authStore.isAuthenticated) {
        Swal.fire('Authentication Required', 'Please log in to generate videos.', 'info');
        this.$router.push('/login');
        return;
      }

      if (!this.formData.image1 || !this.formData.image2 || !this.formData.image3 || !this.formData.image4) {
        Swal.fire('Missing Files', 'Please upload all required images.', 'error');
        return;
      }

      this.loading = true;

      const formData = new FormData();
      formData.append('img1', this.formData.image1);
      formData.append('img2', this.formData.image2);
      formData.append('img3', this.formData.image3);
      formData.append('img4', this.formData.image4);
      formData.append('text1', this.formData.text1);
      formData.append('text2', this.formData.text2);

      try {
        const response = await privateAPI.post(`/templates/${this.selectedTemplate.id}/generate`, formData, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        this.loading = false;
        Swal.fire({
          title: 'Success',
          text: 'Video generated successfully!',
          icon: 'success',
          confirmButtonText: 'View My Videos'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push("/user");
          }
        });

        console.log(response.data);
        this.closeModal();
      } catch (error) {
        this.loading = false;
        console.error('Error generating video:', error);
        Swal.fire('Error', 'Failed to generate the video. Please try again later.', 'error');
      }
    },

    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.page = pageNumber;
      }
    }
  },
  created() {
    this.fetchTemplates();
  }
};
</script>

<style scoped>
 @import '../../src/scss/main.scss';

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-content form {
  margin-bottom: 20px;
}

.close-modal {
  background: #f00;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.generate-button {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.generate-button i {
  margin-left: 10px;
}

.favorite-button,
.use-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #f00;
  margin-right: 10px;
}

.favorite-button:hover,
.use-button:hover {
  color: #0056b3;
}

/* Spinner de carga */
.fa-spinner {
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<template>
  <div>
    <!-- Título -->
    <h2>Elige tu plantilla</h2>

    <!-- Lista de Plantillas -->
    <div class="templates">
      <div v-for="template in paginatedTemplates" :key="template.id" class="template-card">
        <!-- Mostrar el icono -->
        <img :src="getImagePath(template.icon_path)" :alt="template.name" class="template-icon" />
        
        <h3 class="template-info">{{ template.name }}</h3>
        <p class="template-info">{{ template.description }}</p>
        
        <!-- Icono de corazón para favoritos -->
        <button @click="toggleFavorite(template)" class="favorite-button">
          <i :class="template.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>

        <!-- Botón para usar la plantilla, abrir modal -->
        <button @click="openModal(template)" class="use-button">
          <i class="fas fa-play"></i> Usar Plantilla
        </button>
      </div>
    </div>

    <!-- Modal de formulario -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Personaliza tu plantilla</h3>

        <!-- Formulario -->
        <form @submit.prevent="generateTemplate">
          <!-- Imagen 1 -->
          <div>
            <label for="image1">Imagen 1</label>
            <input type="file" id="image1" @change="handleFileChange($event, 'image1')" required />
          </div>
          <!-- Imagen 2 -->
          <div>
            <label for="image2">Imagen 2</label>
            <input type="file" id="image2" @change="handleFileChange($event, 'image2')" required />
          </div>
          <!-- Imagen 3 -->
          <div>
            <label for="image3">Imagen 3</label>
            <input type="file" id="image3" @change="handleFileChange($event, 'image3')" required />
          </div>
          <!-- Imagen 4 -->
          <div>
            <label for="image4">Imagen 4</label>
            <input type="file" id="image4" @change="handleFileChange($event, 'image4')" required />
          </div>
          <!-- Texto 1 -->
          <div>
            <label for="text1">Texto 1</label>
            <input type="text" id="text1" v-model="formData.text1" />
          </div>
          <!-- Texto 2 -->
          <div>
            <label for="text2">Texto 2</label>
            <input type="text" id="text2" v-model="formData.text2" />
          </div>

          <!-- Botón de generar -->
          <button type="submit" class="generate-button">
            Generar
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          </button>
        </form>

        <!-- Botón de cerrar -->
        <button @click="closeModal" class="close-modal">Cerrar</button>
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination">
      <button @click="goToPage(page - 1)" :disabled="page === 1">Anterior</button>
      <span>{{ page }} de {{ totalPages }}</span>
      <button @click="goToPage(page + 1)" :disabled="page === totalPages">Siguiente</button>
    </div>
  </div>
</template>

<script>
import api from '@/api/api';
import privateAPI from '@/api/private'; 

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
    // Calcular el total de páginas
    totalPages() {
      return Math.ceil(this.templates.length / this.templatesPerPage);
    },
    paginatedTemplates() {
      const start = (this.page - 1) * this.templatesPerPage;
      const end = start + this.templatesPerPage;
      return this.templates.slice(start, end);
    },
  },
  methods: {
    // Método para manejar el cambio de archivo
    handleFileChange(event, field) {
      const file = event.target.files[0]; // Obtenemos el archivo seleccionado
      if (file) {
        this.formData[field] = file; // asignael archivo al campo correspondiente de formData
      }
    },

    // Método para obtener las plantillas de la API
    fetchTemplates() {
      api.get('/templates') 
        .then(response => {
          this.templates = response.data; 
        })
        .catch(error => {
          console.error('Error fetching templates:', error);
        });
    },

    // Función para obtener la ruta correcta del icono
    getImagePath(path) {
      return `http://localhost/${path.replace(/\\/g, '/')}`;
    },

    toggleFavorite(template) {
      const token = localStorage.getItem('authToken'); // Obtener el token JWT

      if (token) {
        // Configurar el encabezado Authorization para la solicitud
        privateAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (template.favorite) {
          privateAPI.delete(`/favorites/${template.favorite_id}`)
            .then(response => {
              template.favorite = false;
              template.favorite_id = null; // limpiar el ID del favorito
            })
            .catch(error => {
              console.error('Error al eliminar de favoritos:', error);
            });
        } else {
          privateAPI.post('/favorites', { template_id: template.id })
            .then(response => {
              template.favorite = true;
              template.favorite_id = response.data.id; // Almacenamos el ID del favorito para futuras eliminaciones
            })
            .catch(error => {
              console.error('Error al agregar a favoritos:', error);
            });
        }
      } else {
        console.log('No se encontró un token de autenticación.');
      }
    },



    openModal(template) {
      this.selectedTemplate = template;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.formData = {
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        text1: '',
        text2: ''
      };
    },

    generateTemplate() {
      this.loading = true;
      
      const formData = new FormData();
      formData.append('image1', this.formData.image1);
      formData.append('image2', this.formData.image2);
      formData.append('image3', this.formData.image3);
      formData.append('image4', this.formData.image4);
      formData.append('text1', this.formData.text1);
      formData.append('text2', this.formData.text2);

      // Llama a la API para procesar el vidoe
      api.post(`/templates/${this.selectedTemplate.id}/generate`, formData)
        .then(response => {
          this.loading = false;
          console.log('Plantilla generada con éxito', response);
          this.closeModal();
        })
        .catch(error => {
          this.loading = false;
          console.error('Error generando la plantilla:', error);
        });
    },

    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.page = pageNumber;
      }
    }
  },

  // Llamar al método fetchTemplates cuando el componente se monta
  created() {
    this.fetchTemplates();
  },
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

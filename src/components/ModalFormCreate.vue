<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h3 class="content__title">Customize your template</h3>
  
        <!-- Formulario -->
        <form @submit.prevent="generateTemplate" class="container__form">
          <!-- Imagen 1 -->
          <div class="form__image">
            <label for="image1">Image 1</label>
            <input type="file" id="image1" @change="handleFileChange($event, 'image1')" required />
          </div>
          <!-- Imagen 2 -->
          <div class="form__image">
            <label for="image2">Image 2</label>
            <input type="file" id="image2" @change="handleFileChange($event, 'image2')" required />
          </div>
          <!-- Imagen 3 -->
          <div class="form__image">
            <label for="image3">Image 3</label>
            <input type="file" id="image3" @change="handleFileChange($event, 'image3')" required />
          </div>
          <!-- Imagen 4 -->
          <div class="form__image">
            <label for="image4">Image 4</label>
            <input type="file" id="image4" @change="handleFileChange($event, 'image4')" required />
          </div>
          <!-- Texto 1 -->
          <div class="form__text">
            <label for="text1">Text 1</label>
            <input type="text" id="text1" v-model.trim="formData.text1" maxlength="10" />
          </div>
          <!-- Texto 2 -->
          <div class="form__text">
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
        <button @click="$emit('close')" class="close-modal">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/authStore';
  import privateAPI from '@/api/private';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'TemplateFormModal',
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
      template: {
        type: Object,
        required: false,
        default: null,
      },
    },
    emits: ['close'],
    data() {
      return {
        loading: false,
        formData: {
          image1: null,
          image2: null,
          image3: null,
          image4: null,
          text1: '',
          text2: '',
        },
      };
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
          const response = await privateAPI.post(`/templates/${this.template.id}/generate`, formData, {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
  
          this.loading = false;
          Swal.fire({
            title: 'Success',
            text: 'Video generated successfully!',
            icon: 'success',
            confirmButtonText: 'View My Videos',
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push('/user');
            }
          });
  
          console.log(response.data);
          this.$emit('close');
        } catch (error) {
          this.loading = false;
          console.error('Error generating video:', error);
          Swal.fire('Error', 'Failed to generate the video. Please try again later.', 'error');
        }
      },
    },
  };
  </script>
  
  <style scoped>
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
  
  /* Spinner de carga */
  .fa-spinner {
    animation: spin 1s infinite linear;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  
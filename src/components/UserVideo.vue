<template>
  <div class="video-item">
    <div class="video-thumbnail">
      <video 
        v-if="videoUrl" 
        :src="videoUrl"
        preload="metadata"
        class="thumbnail-preview"
      ></video>
      <div v-else class="placeholder-thumbnail">
        {{ video.name || 'Video #' + video.id }}
      </div>
    </div>
    <div class="video-info">
      <h3>{{ video.name || 'Video #' + video.id }}</h3>
      <p>Creado el: {{ formatDate(video.created_at) }}</p>
      <div class="video-actions">
        <button @click="previewVideo" class="preview-button">Preview</button>
        <button @click="downloadVideo" class="download-button">Download</button>
        <button @click="deleteVideo" class="delete-button">Eliminate</button>
      </div>
    </div>
    
    <!-- Modal para vista previa del video (opcional) -->
    <div v-if="showPreview" class="video-preview-modal">
      <div class="modal-content">
        <span class="close-button" @click="closePreview">&times;</span>
        <video controls :src="videoUrl" class="video-player"></video>
      </div>
    </div>
  </div>
</template>

<script>
import privateAPI from '@/api/private';

export default {
  name: 'UserVideo',
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showPreview: false,
    };
  },
  computed: {
    videoUrl() {
      
      if (this.video.video_url) {
        return this.video.video_url;
      }
      
      // Fallback a construir la URL usando file_path
      if (this.video.file_path) {
        return `${process.env.VUE_APP_API_URL}/storage/${this.video.file_path}`;
      }
      
      return null;
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Fecha desconocida';
      return new Date(dateString).toLocaleDateString();
    },
    previewVideo() {
      if (this.videoUrl) {
        this.showPreview = true;
      } else {
        console.error('No hay URL de video disponible');
        alert('No se puede mostrar la vista previa del video');
      }
    },
    closePreview() {
      this.showPreview = false;
    },
    async downloadVideo() {
      try {
        
        this.$emit('loading', true);
        
        const response = await privateAPI.get(`/userVideos/${this.video.id}/download`, { 
          responseType: 'blob' 
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Crear un nombre de archivo significativo
        const fileName = this.video.name 
          ? `${this.video.name.replace(/[^a-z0-9]/gi, '_')}.mp4` 
          : `video_${this.video.id}.mp4`;
          
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading video:', error);
        alert('Error al descargar el video');
      } finally {
        
        this.$emit('loading', false);
      }
    },
    async deleteVideo() {
      try {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este video?');
        if (!confirmDelete) return;

        // Mostrar indicador de carga (opcional)
        this.$emit('loading', true);
        
        await privateAPI.delete(`/userVideos/${this.video.id}`);
        this.$emit('videoDeleted', this.video.id);
      } catch (error) {
        console.error('Error al eliminar el video:', error);
        alert('Error al eliminar el video');
      } finally {
       
        this.$emit('loading', false);
      }
    },
  },
};
</script>

<style scoped>
.video-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.video-thumbnail {
  width: 100%;
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumbnail-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-thumbnail {
  color: #999;
  font-size: 16px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-info {
  padding: 15px;
}

.video-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.video-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.preview-button {
  background-color: #4CAF50;
  color: white;
}

.preview-button:hover {
  background-color: #45a049;
}

.download-button {
  background-color: #2196F3;
  color: white;
}

.download-button:hover {
  background-color: #0b7dda;
}

.delete-button {
  background-color: #ff4d4d;
  color: white;
}

.delete-button:hover {
  background-color: #ff0000;
}

/* Estilos para el modal de vista previa */
.video-preview-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  width: 80%;
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #555;
}

.video-player {
  width: 100%;
  max-height: 70vh;
}
</style>
<template>
  <div class="video-item">
    <div class="video-thumbnail">
      <img 
        v-if="video.thumbnail_url" 
        :src="video.thumbnail_url" 
        :alt="video.name" 
        class="thumbnail-image"
      >
      <div v-else class="placeholder-thumbnail">
        {{ video.name || 'Video' }}
      </div>
    </div>
    <div class="video-info">
      <h3>{{ video.name || 'Video' }}</h3>
      <p>Creado el: {{ formatDate(video.created_at) }}</p>
      <div class="video-actions">
        <button @click="previewVideo" class="preview-button">Vista previa</button>
        <button @click="downloadVideo" class="download-button">Descargar</button>
        <button @click="deleteVideo" class="delete-button">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserVideo',
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    previewVideo() {
      console.log(this.video.video_url)
      // Utiliza la URL del video directamente
      if (this.video.video_url) {
        window.open(this.video.video_url, '_blank');
        
      } else {
        console.error('No hay URL de video disponible');
        alert('No se puede mostrar la vista previa del video');
      }
    },
    async downloadVideo() {
      try {
        const response = await this.$api.get(`/userVideos/${this.video.id}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.video.name || 'video'}_${this.video.id}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading video:', error);
        alert('Error al descargar el video');
      }
    },
    async deleteVideo() {
      try {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este video?');
        if (!confirmDelete) return;

        await this.$api.delete(`/userVideos/${this.video.id}`);
        this.$emit('videoDeleted', this.video.id);
      } catch (error) {
        console.error('Error al eliminar el video:', error);
        alert('Error al eliminar el video');
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
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-thumbnail {
  color: #999;
  font-size: 16px;
  text-align: center;
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
</style>
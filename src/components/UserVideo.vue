<template>
    <div class="video-item">
      <img :src="video.thumbnail_url" :alt="video.name" class="video-thumbnail">
      <div class="video-info">
        <h3>{{ video.name }}</h3>
        <p>Creado el: {{ formatDate(video.created_at) }}</p>
        <button @click="previewVideo">Vista previa</button>
        <button @click="downloadVideo">Descargar</button>
        <button @click="deleteVideo" class="delete-button">Eliminar</button>
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
        window.open(`/v1/auth/userVideos/${this.video.id}/preview`, '_blank');
      },
      async downloadVideo() {
        try {
          const response = await this.$api.get(`/userVideos/${this.video.id}/download`, { responseType: 'blob' });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `video_${this.video.id}.mp4`);
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
          this.$emit('videoDeleted', this.video.id); // Emitir evento para informar al componente padre
        } catch (error) {
          console.error('Error deleting video:', error);
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
  }
  
  .video-thumbnail {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .video-info {
    padding: 10px;
  }
  
  .delete-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    background-color: #ff0000;
  }
  </style>
  
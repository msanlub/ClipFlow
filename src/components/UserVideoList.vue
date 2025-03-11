<template>
    <div class="user-videos-list">
      <h2>Mis Videos</h2>
      <div v-if="loading">Cargando videos...</div>
      <div v-else-if="videos.length === 0">No tienes videos creados aún.</div>
      <div v-else class="video-grid">
        <UserVideo
          v-for="video in videos"
          :key="video.id"
          :video="video"
          @videoDeleted="removeVideo"
        />
      </div>
    </div>
  </template>
  
  <script>
  import UserVideo from './UserVideo.vue';
  import api from '@/api/api';
  
  export default {
    name: 'ListUserVideo',
    components: { UserVideo },
    data() {
      return {
        videos: [],
        loading: true,
      };
    },
    mounted() {
      this.fetchUserVideos();
    },
    methods: {
      async fetchUserVideos() {
        try {
          const response = await api.get('/userVideos');
          this.videos = response.data;
          this.loading = false;
        } catch (error) {
          console.error('Error fetching user videos:', error);
          this.loading = false;
        }
      },
      removeVideo(id) {
        // Elimina el video de la lista local cuando se recibe el evento desde UserVideo
        this.videos = this.videos.filter(video => video.id !== id);
      },
    },
  };
  </script>
  
  <style scoped>
  .user-videos-list {
    margin-top: 20px;
  }
  
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  </style>
  
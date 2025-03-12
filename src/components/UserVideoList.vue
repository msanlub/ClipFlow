<template>
    <div class="user-videos-list">
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

    export default {
      name: 'UserVideoList',
      components: { UserVideo },
      props: {
        videos: {
          type: Array,
          required: true,
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
  
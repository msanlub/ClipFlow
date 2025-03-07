<template>
    <div class="user-page">
      <h1>Bienvenido, {{ userName }}</h1>
      
      <!-- Lista de favoritos -->
      <FavoritesList :favorites="userFavorites" />
    </div>
  </template>
  
  <script>
  import FavoritesList from '@/components/FavoritesList.vue'
  
  export default {
    name: 'UserPage',
    components: {
      FavoritesList
    },
    data() {
      return {
        userName: 'Juan Pérez',
        userFavorites: [
          { id: 1, title: 'Template 1', description: 'Plantilla estilo happy', image: 'https://via.placeholder.com/200' },
          { id: 2, title: 'Template 2', description: 'Plantilla estilo rock', image: 'https://via.placeholder.com/200' },
          { id: 3, title: 'Template 3', description: 'Plantilla estilo soul', image: 'https://via.placeholder.com/200' },
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .user-page {
    padding: 2rem;
    background-color: #f9f9f9;
    text-align: center;
  }
  
  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
  }
  </style>
  
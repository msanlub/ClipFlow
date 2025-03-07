<template>
    <div class="favorites-list">
      <h2>Favoritas</h2>
      <div class="templates">
        <div v-for="template in favorites" :key="template.id" class="template-card">
          <img :src="template.image" alt="Imagen de plantilla" class="template-image" />
            <h3 class="template-info">{{ template.title }}</h3>
            <p class="template-info">{{ template.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FavoritesList',
    props: {
      favorites: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
    @import '../scss/main.scss';
  </style>
  
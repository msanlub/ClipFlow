<template>
  <div>
    <!-- Título -->
    <h2>Elige tu plantilla</h2>

    <!-- Lista de Plantillas -->
     <div class="templates">
        <div v-for="template in paginatedTemplates" :key="template.id" class="template-card">
          <img :src="template.image" :alt="template.title" class="template-image" />
          <h3 class="template-info">{{ template.title }}</h3>
          <p class="template-info">{{ template.description }}</p>
          <button @click="toggleFavorite(template)">
            {{ template.favorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos' }}
          </button>
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
export default {
  name: 'TemplateList',
  data() {
    return {
      templates: [
        { id: 1, title: 'Template 1', description: 'Plantilla estilo happy', image: 'https://via.placeholder.com/200', favorite: false },
        { id: 2, title: 'Template 2', description: 'Plantilla estilo rock', image: 'https://via.placeholder.com/200', favorite: false },
        { id: 3, title: 'Template 3', description: 'Plantilla estilo soul', image: 'https://via.placeholder.com/200', favorite: false },
        { id: 4, title: 'Template 4', description: 'Plantilla estilo adventure', image: 'https://via.placeholder.com/200', favorite: false },
        { id: 5, title: 'Template 5', description: 'Plantilla estilo minimal', image: 'https://via.placeholder.com/200', favorite: false },
        { id: 6, title: 'Template 6', description: 'Plantilla estilo retro', image: 'https://via.placeholder.com/200', favorite: false },
      ],
      page: 1,
      templatesPerPage: 3,
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
    toggleFavorite(template) {
      template.favorite = !template.favorite;
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.page = pageNumber;
      }
    },
  },
};
</script>

<style scoped>
 @import '../../src/scss/main.scss';
</style>

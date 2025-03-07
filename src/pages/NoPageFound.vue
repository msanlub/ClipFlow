<template>
    <div class="no-page-found">
      <h1 class="error-code">404</h1>
      <p class="message">La página que buscas no existe</p>
      <router-link to="/" class="home-link">Volver a la página de inicio</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NoPageFound'
  }
  </script>
  
  <style scoped>
  .no-page-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f4;
    text-align: center;
  }
  
  .error-code {
    font-size: 10rem;
    font-weight: bold;
    color: #ff6f61;
    margin: 0;
  }
  
  .message {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1.5rem;
  }
  
  .home-link {
    font-size: 1.2rem;
    color: #007bff;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    border: 2px solid #007bff;
    transition: all 0.3s ease;
  }
  
  .home-link:hover {
    background-color: #007bff;
    color: white;
  }
  
  .home-link:active {
    transform: scale(0.98);
  }
  </style>
  
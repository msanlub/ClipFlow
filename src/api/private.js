import axios from 'axios';

const privateAPI = axios.create({
  baseURL: 'http://localhost/api/v1/auth', 
});

// Interceptor para agregar el token a las solicitudes
privateAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar las respuestas
privateAPI.interceptors.response.use(response => {
  return response; // todo perfe
}, error => {
  if (error.response && error.response.status === 401) {
    // Si el token es inválido o ha expirado, redirigeal login
    console.log('Token expirado o inválido');
    
    window.location.href = '/login'; 
  }
  return Promise.reject(error);
});

export default privateAPI;

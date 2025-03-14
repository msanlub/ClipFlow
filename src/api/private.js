import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const privateAPI = axios.create({
  baseURL: 'https://192.99.15.53:8444/api/v1/auth/', 
});

// Interceptor para agregar el token
privateAPI.interceptors.request.use(config => {
  const authStore = useAuthStore(); 

  if (authStore.token) {
    config.headers['Authorization'] = `Bearer ${authStore.token}`;
  } else {
    console.warn('No hay token disponible en authStore');
  }
  return config;
}, error => Promise.reject(error));

// Interceptor para manejar errores de autenticación
privateAPI.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    console.log('Token expirado o inválido');
    const authStore = useAuthStore();
    authStore.logOut(); 
  }
  return Promise.reject(error);
});

export default privateAPI;

import axios from "axios";

// Crea una instancia de axios con la URL base de tu API
const api = axios.create({
  baseURL: 'https://192.99.15.53:8444/api/v1/auth/', 
  headers: {
    'Accept': 'application/json',
  }
});


export default api;

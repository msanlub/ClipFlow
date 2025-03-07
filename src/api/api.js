import axios from "axios";

// Crea una instancia de axios con la URL base de tu API
const api = axios.create({
  baseURL: 'http://localhost/api/v1/auth', 
  headers: {
    'Accept': 'application/json',
  }
});


export default api;

// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Đổi lại baseURL nếu cần
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể thêm interceptors nếu cần
// api.interceptors.request.use(config => { ... });
// api.interceptors.response.use(response => { ... });

export default api;

import axios from 'axios';

const API_URL = '/api'; // Change to your backend URL

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

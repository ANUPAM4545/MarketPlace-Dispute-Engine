import axios from 'axios';

// Create an Axios instance with base URL for the Flask backend
const api = axios.create({
    baseURL: 'https://dispute-backend-d2c7.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token to every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

import axios from 'axios';

// Create an Axios instance with base URL for the Flask backend
const api = axios.create({
    baseURL: 'http://13.127.9.75:5000',
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

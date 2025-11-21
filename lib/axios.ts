import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth or other headers
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally
        if (error.response) {
            console.error('API Error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

// axiosInstance

import { CLIENT_URL, SERVER_URL } from '@web/config';
import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: CLIENT_URL + '/api',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
    // check if status is 401
    if (config.status === 401) {
        console.log('Unauthorized request');
    }
    return config;
});


export default axiosInstance;

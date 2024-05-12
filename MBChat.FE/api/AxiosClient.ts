import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from "@/constants/ApiUrl";
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request` for the full list of configs

const axiosClient = axios.create({
    baseURL: `${BASE_URL}`,
});
axiosClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';

    return config;
})
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle errors
    console.log("error response", error)
    return error.response;
});
export default axiosClient;
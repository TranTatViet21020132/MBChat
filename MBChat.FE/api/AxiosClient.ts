import axios from "axios";
import * as SecureStore from 'expo-secure-store';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request` for the full list of configs

const axiosClient = axios.create({
    baseURL: `http://112.137.129.161:8001/`,
});
axiosClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE1NDA5Njg5LCJpYXQiOjE3MTI4MTc2ODksImp0aSI6IjM2YTA5NjBjMDczMTQ0ZTQ5Y2E1ZGRlNzA0ZTZhMjkyIiwidXNlcl9pZCI6MX0.kdegUOb65kLoiX5dwyD4zYRBszbzGfHuGb_t3obpIXI`;
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
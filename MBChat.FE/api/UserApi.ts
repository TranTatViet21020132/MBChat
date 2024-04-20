import axiosClient from "./AxiosClient";

class UserApi{
    signup = async (data: object) => {
        const url = "/api/user/signup/";
        return await axiosClient.post(url, data);
    }

    signin = async (data: object) => {
        const url = '/api/user/login/';
        return await axiosClient.post(url, data);
    }

    verifyUser = async (data: object) => {
        const url = '/api/user/verify/';
        return await axiosClient.post(url, data);
    }

    requestResetPassword = async (data: object) => {
        const url = '/api/user/passwordreset/';
        return await axiosClient.post(url, data);
    }
    
    resetPassword = async (data: object) => {
        const url = '/api/user/passwordreset/confirm/';
        return await axiosClient.post(url, data);
    }

    verifyToken = async (data: object) => {
        const url = '/api/token/verify/';
        return await axiosClient.post(url, data);
    }
}

export default new UserApi();
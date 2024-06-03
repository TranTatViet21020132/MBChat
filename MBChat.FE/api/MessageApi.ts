import axiosClient from "./AxiosClient";

class MessageApi{

    uploadImage = async (data: any) => {
        const url = '/api/message/upload/image/';
        return await axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    getImage = async () => {
        const url = '/api/channel/1/media/'
        return await axiosClient.get(url);
    }

}

export default new MessageApi();
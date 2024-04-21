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

}

export default new MessageApi();
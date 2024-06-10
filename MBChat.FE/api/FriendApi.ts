import axiosClient from "./AxiosClient";

class FriendApi {
    getUserList = async () => {
        const url = '/api/user/all';
        return await axiosClient.get(url);
    }

    getUserNotis = async () => {
      const url = '/api/user/notifications';
      return await axiosClient.get(url);
  }
}

export default new FriendApi();
import { addChatHistory, addMessage, setChats, setCommunities } from "../chat/chatSlice";
import { setFirstName, setUserProfile } from "../user/userSlice";
import { addCandidateToPeerConnection, addIceCandaiteToARecord, addIceCandidate, addIceCompleted, addRemoteOfferAnswerToPeerConnection, addRemoteOfferDescriptionToPeerConnection, addToHostList, createCall, joinCall, processIceCandidates, setCalling, setCurrentChannel, setFirstUserHost, setGettingCall, setIceCompleted, setRemoteOfferDescription, setRemoteOfferDescriptionToARecord } from "../webrtc/webrtcSlice";
enum Action {
    GET_CHAT_LIST = "get_chat_list",
    GET_COMMUNITY_LIST = "get_community_list",
    GET_PROFILE = "get_profile",
    GET_MESSAGE_LIST = "get_message_list",
    SEND_MESSAGE = "send_message",
    VIDEO_CALL = "video_call",
    OFFER_ANSWER = "offer_answer",
    ICECANDIDATE = "icecandidate",
    OFFER_DESCRIPTION = "offer_description",
    ICECANDIDATE_COMPLETED = "icecandidate_completed",
    JOIN_CALL = "join_call"
}



const onmessageFunction = async (getState: any, dispatch: any) => {
    return async (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        const userInformation = getState().user;
        const peerConnectionRecord = getState().webrtc.peerConnectionRecord;
        const hostList = getState().webrtc.hostList;
        let data;
        console.log(response.action, userInformation.username);
        if (response.status === 200 || !response.status) {
            switch (response.action) {
                case Action.GET_CHAT_LIST:
                    data = response.data.map((item: any) => {
                        return {
                            id: item.id,
                            from: item.title,
                            date: item.last_updated,
                            img: item.avatar_url,
                            msg: item.last_message,
                            read: true,
                            unreadCount: 2,
                            type: "chats",
                            channelTitle: item.channel_title,
                            userList: item.user_list
                        };
                    });
                    dispatch(setChats(data));
                    break;
                case Action.GET_COMMUNITY_LIST:
                    data = response.data.map((item: any) => {
                        return {
                            id: item.id,
                            from: item.title,
                            date: item.last_updated,
                            img: item.avatar_url,
                            msg: item.last_message,
                            read: true,
                            unreadCount: 2,
                            type: "communities",
                            channelTitle: item.channel_title,
                            userList: item.user_list

                        };
                    });
                    dispatch(setCommunities(data));
                    break;
                case Action.GET_PROFILE:
                    data = response.data;
                    dispatch(setUserProfile({
                            id: data.user.id,
                            username: data.user.username,
                            avatarUrl: data.avatar_url,
                            fullname: data.user.fullname,
                            verified: true,
                            bio: data.bio ? data.bio : "",
                            firstName: data.user.first_name,
                            lastName: data.user.last_name
                        })
                    );
                    break;
                case Action.GET_MESSAGE_LIST:
                    data = response.data;
                    let chat_history_object_array = response.data.map(
                        (message: any, idx: number) => {
                            let data = {
                                _id: message.id,
                                text: message.content,
                                createdAt: message.create_at,
                                user: {
                                    _id: message.member.user.id === userInformation.id ? 1 : message.member.user.id + 1,
                                    name: message.member.user.fullname,
                                },
                            };
                            if (message.reply) {
                                // @ts-ignore
                                data["repliedMessage"] = message.reply;
                            }
                            if (message.location) {
                                const locationArr = message.location.split(" ");
                                // @ts-ignore
                                data["location"] = {
                                    latitude: parseFloat(locationArr[0]),
                                    longitude: parseFloat(locationArr[1]),
                                };
                            } else if (message.image) {
                                // @ts-ignore
                                data["image"] = message.image;
                            }
                            return data;
                        }
                    );
                    dispatch(
                        addChatHistory({
                            targetId: response.targetId,
                            chatHistory: chat_history_object_array,
                        })
                    );
                    break;
                case Action.SEND_MESSAGE:
                    console.log("send send snsidskldjslkdjl", userInformation.username);
                    data = response.data;
                    let chat_history_object = {
                        _id: data.id,
                        text: data.content,
                        createdAt: new Date(),
                        user: {
                            _id: data.member.user.id === userInformation.id ? 1 : data.member.user.id + 1,
                            name: data.member.user.fullname,
                        },
                    };
                    if (data.reply) {
                        // @ts-ignore
                        chat_history_object["repliedMessage"] = data.reply;
                    }
                    if (data.location) {
                        const locationArr = data.location.split(" ");
                        // @ts-ignore
                        chat_history_object["location"] = {
                            latitude: parseFloat(locationArr[0]),
                            longitude: parseFloat(locationArr[1]),
                        };
                    } else if (data.image) {
                        // @ts-ignore
                        chat_history_object["image"] = data.image;
                    }
                    dispatch(
                        addMessage({
                            targetId: response.targetId,
                            chatMessageObject: chat_history_object,
                        })
                    );
                    break;
                case Action.VIDEO_CALL:
                    data = response.data;
                    await dispatch(setCalling(true));
                    await dispatch(setCurrentChannel(data.from_channel))
                    if (hostList.length === 0) {
                        await dispatch(setFirstUserHost(data.from_user))
                    }
                    await dispatch(addToHostList(data.from_user))
                    if (userInformation.id != data.from_user) {
                        if (hostList.length === 0) {
                            await dispatch(setGettingCall(true));
                        } else {
                            await dispatch(joinCall(data.from_user))
                        }

                    } else {
                        await dispatch(createCall())
                    }
                    break;
                case Action.JOIN_CALL:
                    break;
                case Action.OFFER_ANSWER:
                    data = response.data
                    if (userInformation.id != data.from_user) {
                        await dispatch(setRemoteOfferDescriptionToARecord({
                            target: data.from_user,
                            value: data.data
                        }));
                        if (peerConnectionRecord[data.from_user]) {
                            console.log("yeah yeah offer answer")
                            await dispatch(addRemoteOfferAnswerToPeerConnection({
                                remoteDescription: data.data,
                                hostId: data.from_user
                            }));
                        }
                    }
                    break;
                case Action.OFFER_DESCRIPTION:
                    data = response.data
                    if (userInformation.id != data.from_user) {
                        await dispatch(setRemoteOfferDescriptionToARecord({
                            target: data.from_user,
                            value: data.data
                        }));
                        if (peerConnectionRecord[data.from_user]) {
                            console.log("yeah yeah offer description")
                            await dispatch(addRemoteOfferDescriptionToPeerConnection({
                                remoteDescription: data.data,
                                hostId: data.from_user
                            }));
                        }
                    }
                    break;
                case Action.ICECANDIDATE:
                    data = response.data;
                    if (userInformation.id != data.from_user) {
                        await dispatch(addIceCandaiteToARecord({
                            target: data.from_user,
                            value: data.data
                        }));
                    }
                    break;
                case Action.ICECANDIDATE_COMPLETED:
                    data = await response.data;
                    console.log("ice completed", userInformation.id, data.from_user);
                    if (userInformation.id != data.from_user) {
                        // dispatch(processIceCandidates())
                        dispatch(addIceCompleted({
                            target: data.from_user,
                            value: true
                        }))
                    }
                    
                    break;
            }
        }
    };
};

export default onmessageFunction;

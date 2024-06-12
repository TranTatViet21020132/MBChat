import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    RTCPeerConnection,
    MediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
} from "react-native-webrtc";
import Utils from "./utils";
const configuration = {
    iceServers: [
        {
            urls: "stun:192.168.2.3:3478",
        },
        {
            urls: "turn:192.168.2.3:3478",
            username: "demo",
            credential: "secret",
        },
        {
            urls: "turn:192.168.2.3:3478?transport=tcp",
            username: "demo",
            credential: "secret",
        },
    ],
};
let count = 0;

interface webrtcState {
    peerConnection: RTCPeerConnection | null;
    localStream: MediaStream | null;
    remoteStreams: Array<MediaStream>;
    iceCandidates: Array<RTCIceCandidate>;
    remoteOfferDescription: RTCSessionDescription | null;
    currentChannel: number;
    gettingCall: boolean;
    iceCompleted: boolean;
    peerConnectionRecord: Record<string, RTCPeerConnection>;
    remoteOfferDescriptionRecord: Record<string, RTCSessionDescription>;
    iceCandidatesRecord: Record<string, Array<RTCIceCandidate>>;
    iceCompletedRecord: Record<string, boolean>;
    calling: boolean;
    firstUserHost: string;
    hostList: Array<string>;
}

const initialState: webrtcState = {
    peerConnection: null,
    localStream: null,
    remoteStreams: [],
    iceCandidates: [],
    remoteOfferDescription: null,
    currentChannel: 0,
    gettingCall: false,
    iceCompleted: false,
    peerConnectionRecord: {},
    remoteOfferDescriptionRecord: {},
    iceCandidatesRecord: {},
    iceCompletedRecord: {},
    calling: false,
    firstUserHost: "",
    hostList: [],
};

const webrtcSlice = createSlice({
    name: "webrtc",
    initialState,
    reducers: {
        addIceCandidate: (state, action: PayloadAction<RTCIceCandidate>) => {
            state.iceCandidates.push(action.payload);
        },
        addRemoteStream: (state, action: PayloadAction<MediaStream>) => {
            state.remoteStreams.push(action.payload);
        },
        createPeerConnection: (state, action) => {
            state.peerConnection = new RTCPeerConnection(configuration);
        },
        setLocalStream: (state, action: PayloadAction<MediaStream>) => {
            state.localStream = action.payload;
        },
        setRemoteOfferDescription: (
            state,
            action: PayloadAction<RTCSessionDescription>
        ) => {
            state.remoteOfferDescription = action.payload;
        },
        setRemoteOfferDescriptionToARecord: (
            state,
            action: PayloadAction<{
                target: string;
                value: RTCSessionDescription;
            }>
        ) => {
            const obj: Record<string, RTCSessionDescription> = {};
            obj[action.payload.target] = action.payload.value;
            state.remoteOfferDescriptionRecord = {
                ...state.remoteOfferDescriptionRecord,
                ...obj,
            };
        },
        resetIceCandidates: (state) => {
            state.iceCandidates = [];
        },
        setGettingCall: (state, action: PayloadAction<boolean>) => {
            state.gettingCall = action.payload;
        },
        setCurrentChannel: (state, action: PayloadAction<number>) => {
            state.currentChannel = action.payload;
        },
        setIceCompleted: (state, action: PayloadAction<boolean>) => {
            state.iceCompleted = action.payload;
        },
        setCalling: (state, action: PayloadAction<boolean>) => {
            state.calling = action.payload;
        },
        setFirstUserHost: (state, action: PayloadAction<string>) => {
            state.firstUserHost = action.payload;
        },
        addToHostList: (state, action: PayloadAction<string>) => {
            state.hostList = [...state.hostList, action.payload];
        },
        resetIceCandidatesInARecord: (state, action: PayloadAction<string>) => {
            state.iceCandidatesRecord[action.payload] = [];
        },
        addIceCompleted: (
            state,
            action: PayloadAction<{ target: string; value: boolean }>
        ) => {
            state.iceCompletedRecord[action.payload.target] =
                action.payload.value;
        },
        resetWebrtc: () => {
            return initialState
        },

        addIceCandaiteToARecord: (
            state,
            action: PayloadAction<{ target: string; value: RTCIceCandidate }>
        ) => {
            let arr = [];
            if (!state.iceCandidatesRecord[action.payload.target]) {
                state.iceCandidatesRecord[action.payload.target] = [
                    action.payload.value,
                ];
            } else {
                state.iceCandidatesRecord[action.payload.target].push(
                    action.payload.value
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createCall.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnectionRecord = {
                    ...state.peerConnectionRecord,
                    ...action.payload,
                };
                console.log("Create peer connection");
            }
        });
        builder.addCase(joinCall.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnectionRecord = {
                    ...state.peerConnectionRecord,
                    ...action.payload,
                };
                console.log("Join peer connection");
            }
        });
        builder.addCase(
            addRemoteOfferAnswerToPeerConnection.fulfilled,
            (state, action) => {
                if (action.payload) {
                    state.peerConnectionRecord = {
                        ...state.peerConnectionRecord,
                        ...action.payload,
                    };
                    console.log("add remote offer answer to peer connection");
                } else {
                    console.log("no offer answer", action.payload);
                }
            }
        );
        builder.addCase(
            addRemoteOfferDescriptionToPeerConnection.fulfilled,
            (state, action) => {
                if (action.payload) {
                    state.peerConnectionRecord = {
                        ...state.peerConnectionRecord,
                        ...action.payload,
                    };
                    console.log(
                        "add remote offer description to peer connection"
                    );
                }
            }
        );
        builder.addCase(processIceCandidates.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnectionRecord = {
                    ...state.peerConnectionRecord,
                    ...action.payload,
                };
                console.log("add ice candidates to peer connection");
            }
        });
        builder.addCase(hangup.fulfilled, (state, action) => {
            console.log("hang up successfully");
            return initialState;
        });
        builder.addCase(
            addCandidateToPeerConnection.fulfilled,
            (state, action) => {
                if (action.payload) {
                    state.peerConnection = action.payload;
                    console.log("add single candidate to peer connection");
                }
            }
        );
    },
});

async function findUserListOfChannel(getState: any, channelId: string) {
    const chatList = await getState().chat.chatList;
    const communityList = await getState().chat.communityList;
    for (let i = 0; i < chatList.length; i++) {
        if (chatList[i]["id"] === channelId) {
            return chatList[i]["userList"];
        }
    }
    for (let i = 0; i < communityList.length; i++) {
        if (communityList[i]["id"] == channelId) {
            return communityList[i]["userList"];
        }
    }
    return [];
}

async function setupWebrtc(getState: any, dispatch: any) {
    const socket = await getState().websocket.socket;
    const userId = await getState().user.id;
    const currentChannel = await getState().webrtc.currentChannel;
    const userList = await findUserListOfChannel(getState, currentChannel);
    let peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addEventListener("connectionstatechange", (event) => {});
    peerConnection.addEventListener("icecandidate", (event: any) => {
        if (!event.candidate) {
            if (socket) {
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i] != userId) {
                        const form_data = {
                            action: "icecandidate_completed",
                            target: "user",
                            targetId: userList[i],
                            data: {
                                from_user: userId,
                                data: event.candidate,
                            },
                        };
                        socket.send(JSON.stringify(form_data));
                    }
                }
            }
            return;
        }
        if (socket) {
            for (let i = 0; i < userList.length; i++) {
                if (userList[i] != userId) {
                    const form_data = {
                        action: "icecandidate",
                        target: "user",
                        targetId: userList[i],
                        data: {
                            from_user: userId,
                            data: event.candidate,
                        },
                    };
                    console.log("candidate", ++count);
                    socket.send(JSON.stringify(form_data));
                }
            }
        }
    });

    peerConnection.addEventListener("icecandidateerror", (event) => {});

    peerConnection.addEventListener("iceconnectionstatechange", (event) => {
        console.log(
            "ICE Connection State: ",
            peerConnection.iceConnectionState
        );
    });

    peerConnection.addEventListener("icegatheringstatechange", (event) => {
        console.log("ICE Gathering State: ", peerConnection.iceGatheringState);
    });
    peerConnection.addEventListener("negotiationneeded", (event) => {});

    peerConnection.addEventListener("signalingstatechange", (event) => {});

    peerConnection.addEventListener("track", (event: any) => {
        dispatch(addRemoteStream(event.streams[0]));
    });
    const stream = await Utils.getStream();
    if (stream) {
        dispatch(setLocalStream(stream));
        stream
            .getTracks()
            .forEach((track: any) => peerConnection.addTrack(track, stream));
    }
    return peerConnection;
}

export const createCall = createAsyncThunk(
    "webrtc/createCall",
    async (_, { getState, dispatch }: any) => {
        const userId = await getState().user.id;
        const currentChannel = await getState().webrtc.currentChannel;
        const userList = await findUserListOfChannel(getState, currentChannel);
        const hostList = await getState().webrtc.hostList;
        const firstUserHost = await getState().webrtc.firstUserHost;
        let peerConnectionRecord: Record<string, any> = {};
        const stream: MediaStream = await getState().webrtc.localStream || await Utils.getStream();
        for (let i = 0; i < userList.length; i++) {
            if (hostList.includes(userList[i]) || userList[i] === userId || userList[i] === firstUserHost) {
                continue;
            }
            console.log("Host list", hostList, userList[i])
            const peerConnection = await new RTCPeerConnection(configuration);
            peerConnection.addEventListener(
                "connectionstatechange",
                (event) => {}
            );
            peerConnection.addEventListener("icecandidate", (event: any) => {
                if (!event.candidate) {
                    if (socket) {
                        const form_data = {
                            action: "icecandidate_completed",
                            target: "user",
                            targetId: userList[i],
                            data: {
                                from_user: userId,
                                data: event.candidate,
                            },
                        };
                        socket.send(JSON.stringify(form_data));
                    }
                    return;
                }
                if (socket) {
                    const form_data = {
                        action: "icecandidate",
                        target: "user",
                        targetId: userList[i],
                        data: {
                            from_user: userId,
                            data: event.candidate,
                        },
                    };
                    console.log("candidate", ++count);
                    socket.send(JSON.stringify(form_data));
                }
            });
            peerConnection.addEventListener("icecandidateerror", (event) => {});

            peerConnection.addEventListener(
                "iceconnectionstatechange",
                (event) => {
                    console.log(
                        "ICE Connection State: ",
                        peerConnection.iceConnectionState
                    );
                }
            );

            peerConnection.addEventListener(
                "icegatheringstatechange",
                (event) => {
                    console.log(
                        "ICE Gathering State: ",
                        peerConnection.iceGatheringState
                    );
                }
            );
            peerConnection.addEventListener("negotiationneeded", (event) => {});

            peerConnection.addEventListener(
                "signalingstatechange",
                (event) => {}
            );
            peerConnection.addEventListener("track", (event: any) => {
                const media = new MediaStream();
                media.addTrack(event.track);
                dispatch(addRemoteStream(media));
            });

            if (stream) {
                await stream
                    .getTracks()
                    .forEach((track: any) =>
                        peerConnection.addTrack(track, stream)
                    );
                
            }

            const socket = await getState().websocket.socket;
            if (peerConnection) {
                let sessionConstraints = {
                    mandatory: {
                        OfferToReceiveAudio: true,
                        OfferToReceiveVideo: true,
                        VoiceActivityDetection: true,
                    },
                };
                const offerDescription = await peerConnection.createOffer(
                    sessionConstraints
                );
                await peerConnection.setLocalDescription(offerDescription);
                if (socket) {
                    const formData = {
                        action: "offer_description",
                        target: "user",
                        targetId: userList[i],
                        data: {
                            from_user: userId,
                            data: offerDescription,
                        },
                    };
                    socket.send(JSON.stringify(formData));
                }
                peerConnectionRecord[userList[i]] = peerConnection;
            }
        }
        await dispatch(setLocalStream(stream));
        return peerConnectionRecord;
    }
);

export const joinCall = createAsyncThunk(
    "webrtc/joinCall",
    async (hostId: string, { getState, dispatch }: any) => {
        if (hostId === "") return null;

        dispatch(setGettingCall(false));
        const socket = await getState().websocket.socket;
        const userId = await getState().user.id;
        const remoteOfferDescriptionRecord = await getState().webrtc
            .remoteOfferDescriptionRecord;
        const iceCandidatesRecord = await getState().webrtc.iceCandidatesRecord;
        let peerConnectionRecord: Record<string, any> = {};
        const hostList = await getState().webrtc.hostList;
        const currentChannel = await getState().webrtc.currentChannel;
        const userList = await findUserListOfChannel(getState, currentChannel);
        // await userList.sort((a: any, b: any) => {
        //     return Number(a) - Number(b);
        // })
        const peerConnection = await new RTCPeerConnection(configuration);
        const localStream: MediaStream = await getState().webrtc.localStream;
        peerConnection.addEventListener("connectionstatechange", (event) => {});
        peerConnection.addEventListener("icecandidate", (event: any) => {
            if (!event.candidate) {
                if (socket) {
                    const form_data = {
                        action: "icecandidate_completed",
                        target: "user",
                        targetId: hostId,
                        data: {
                            from_user: userId,
                            data: event.candidate,
                        },
                    };
                    socket.send(JSON.stringify(form_data));
                }
                return;
            }
            if (socket) {
                const form_data = {
                    action: "icecandidate",
                    target: "user",
                    targetId: hostId,
                    data: {
                        from_user: userId,
                        data: event.candidate,
                    },
                };
                console.log("candidate", ++count);
                socket.send(JSON.stringify(form_data));
            }
        });
        peerConnection.addEventListener("icecandidateerror", (event) => {});

        peerConnection.addEventListener("iceconnectionstatechange", (event) => {
            console.log(
                "ICE Connection State: ",
                peerConnection.iceConnectionState
            );
        });

        peerConnection.addEventListener("icegatheringstatechange", (event) => {
            console.log(
                "ICE Gathering State: ",
                peerConnection.iceGatheringState
            );
        });
        peerConnection.addEventListener("negotiationneeded", (event) => {});

        peerConnection.addEventListener("signalingstatechange", (event) => {});
        peerConnection.addEventListener("track", (event: any) => {
            const media = new MediaStream();
                media.addTrack(event.track);
                dispatch(addRemoteStream(media));
        });
        if (!localStream) {
            const stream = await Utils.getStream();
            if (stream) {
                await stream
                    .getTracks()
                    .forEach((track: any) =>
                        peerConnection.addTrack(track, stream)
                    );
                await dispatch(setLocalStream(stream));
            }
        } else {
            await localStream.getTracks().forEach((track: any) => peerConnection.addTrack(track, localStream));
        }
        if (peerConnection && remoteOfferDescriptionRecord[hostId]) {

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(remoteOfferDescriptionRecord[hostId])
            );
            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);
            await iceCandidatesRecord[hostId].map(async (candidate: any) => {
                await peerConnection.addIceCandidate(candidate);
            });
            dispatch(resetIceCandidatesInARecord(hostId));
            if (socket) {
                const formData = {
                    action: "offer_answer",
                    target: "user",
                    targetId: hostId,
                    data: {
                        data: answerDescription,
                        from_user: userId,
                    },
                };
                socket.send(JSON.stringify(formData));
            }
        } 
        if (userId === 12 && Number(hostId) != 12) {
            // for (let i = 0; i < userList.length; i++) {
            //     if (hostList.includes(userList[i])) {
            //         continue;
            //     }
            //     console.log(userList[i], hostList)
            //     const formData = {
            //         action: "video_call",
            //         target: "user",
            //         targetId: userList[i],
            //         data: {
            //             from_user: userId,
            //             from_channel: currentChannel
            //         }
            //     }
            //     socket.send(JSON.stringify(formData));

            // }
            socket.send(JSON.stringify({
                action: "video_call",
                target: "user",
                targetId: 12,
                data: {
                    from_user: userId,
                    from_channel: currentChannel
                }
            }));
            setTimeout(() => {
                socket.send(JSON.stringify({
                    action: "video_call",
                    target: "user",
                    targetId: 13,
                    data: {
                        from_user: userId,
                        from_channel: currentChannel
                    }
                }));
            }, 5000)
        }
        peerConnectionRecord[hostId] = peerConnection;
        return peerConnectionRecord;
    } 
);

export const addRemoteOfferAnswerToPeerConnection = createAsyncThunk(
    "webrtc/addRemoteOfferAnswerToPeerConnection",
    async (
        data: {
            remoteDescription: RTCSessionDescription;
            hostId: string;
        },
        { getState, dispatch }: any
    ) => {
        const peerConnectionRecord = await getState().webrtc
            .peerConnectionRecord;
        const iceCandidatesRecord = await getState().webrtc.iceCandidatesRecord;
        let newPeerConnectionRecord: Record<string, any> = {};
        console.log(
            "check in remote offer answer",
            !peerConnectionRecord[data.hostId]
        );
        if (peerConnectionRecord[data.hostId]) {
            const peerConnection = peerConnectionRecord[data.hostId];
            await peerConnection.setRemoteDescription(data.remoteDescription);
            await iceCandidatesRecord[data.hostId].map((candidate: any) => {
                peerConnection.addIceCandidate(candidate);
            });
            dispatch(resetIceCandidates());
            newPeerConnectionRecord[data.hostId] = peerConnection;
            return newPeerConnectionRecord;
        }
        return null;
    }
);

export const addRemoteOfferDescriptionToPeerConnection = createAsyncThunk(
    "webrtc/addRemoteOfferDescriptionToPeerConnection",
    async (
        data: {
            remoteDescription: RTCSessionDescription;
            hostId: string;
        },
        { getState, dispatch }: any
    ) => {
        const peerConnectionRecord = await getState().webrtc.peerConnection;
        const iceCandidatesRecord = await getState().webrtc.iceCandidates;
        const socket = await getState().websocket.socket;
        const userId = await getState().user.id;
        let newPeerConnectionRecord: Record<string, any> = {};

        if (peerConnectionRecord[data.hostId]) {
            const peerConnection = peerConnectionRecord[data.hostId];
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.remoteDescription)
            );
            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);
            await iceCandidatesRecord[data.hostId].map(
                async (candidate: any) => {
                    await peerConnection.addIceCandidate(candidate);
                }
            );
            dispatch(resetIceCandidatesInARecord(data.hostId));
            if (socket) {
                const formData = {
                    action: "offer_answer",
                    target: "user",
                    targetId: data.hostId,
                    data: {
                        data: answerDescription,
                        from_user: userId,
                    },
                };
                socket.send(JSON.stringify(formData));
            }
            newPeerConnectionRecord[data.hostId] = peerConnection;
            return newPeerConnectionRecord;
        }
        return null;
    }
);

export const processIceCandidates = createAsyncThunk(
    "webrtc/processIceCandidates",
    async (hostId: string, { getState, dispatch }: any) => {
        const peerConnectionRecord = await getState().webrtc
            .peerConnectionRecord;
        let newPeerConnectionRecord: Record<string, any> = {};
        if (
            peerConnectionRecord[hostId] &&
            peerConnectionRecord[hostId].remoteDescription
        ) {
            const peerConnection = peerConnectionRecord[hostId];
            const iceCandidatesRecord = await getState().webrtc
                .iceCandidatesRecord;
            const iceCandidates = iceCandidatesRecord[hostId];
            await iceCandidates.map((candidate: any) => {
                peerConnection.addIceCandidate(candidate);
            });
            dispatch(resetIceCandidatesInARecord(hostId));
            dispatch(
                addIceCompleted({
                    target: hostId,
                    value: false,
                })
            );
            newPeerConnectionRecord[hostId] = peerConnection;
            return newPeerConnectionRecord;
        }
        return null;
    }
);

export const hangup = createAsyncThunk(
    "webrtc/hangup",
    async (_, { getState, dispatch }: any) => {
        const peerConnectionRecord: Record<string, RTCPeerConnection> =
            await getState().webrtc.peerConnectionRecord;
        const localStream: MediaStream = await getState().webrtc.localStream;

        await localStream
            .getTracks()
            .forEach(async (track: any) => await track.stop());

        await localStream.release();

        count = 0;
        Object.values(peerConnectionRecord).forEach(
            (peerConnection: RTCPeerConnection) => {
                peerConnection.close();
            }
        );
    }
);

export const addCandidateToPeerConnection = createAsyncThunk(
    "webrtc/addCandidateToPeerConnection",
    async (candidate: RTCIceCandidate, { getState, dispatch }: any) => {
        const peerConnection = await getState().webrtc.peerConnection;
        if (peerConnection && peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(candidate);
            return peerConnection;
        } else {
            await dispatch(addIceCandidate(candidate));
        }
        return null;
    }
);

export const {
    addIceCandidate,
    addRemoteStream,
    setRemoteOfferDescription,
    setLocalStream,
    setGettingCall,
    setCurrentChannel,
    setIceCompleted,
    resetIceCandidates,
    setCalling,
    setFirstUserHost,
    addToHostList,
    resetIceCandidatesInARecord,
    addIceCompleted,
    addIceCandaiteToARecord,
    setRemoteOfferDescriptionToARecord,
    resetWebrtc
} = webrtcSlice.actions;

export default webrtcSlice.reducer;

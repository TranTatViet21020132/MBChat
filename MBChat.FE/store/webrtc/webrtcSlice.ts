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
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                'stun:stun3.l.google.com:19302',
                "stun:stun4.l.google.com:19302"           
            ],
        }
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
    peerConnectionRecord: Record<string, Array<RTCPeerConnection>>;
    remoteOfferDescriptionRecord: Record<string, Array<RTCPeerConnection>>;
    iceCandidatesRecord: Record<string, Array<RTCIceCandidate>>;
    iceCompletedRecord: Record<string, boolean>;
    calling: boolean;
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
    calling: false
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
            state.calling = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createCall.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("Create peer connection");
            }
        });
        builder.addCase(joinCall.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("Join peer connection");
            }
        });
        builder.addCase(
            addRemoteToPeerConnection.fulfilled,
            (state, action) => {
                if (action.payload) {
                    state.peerConnection = action.payload;
                    console.log("add remote description to peer connection");
                }
            }
        );
        builder.addCase(processIceCandidates.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("add ice candidates to peer connection");
            }
        });
        builder.addCase(hangup.fulfilled, (state, action) => {
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
        console.log('ICE Connection State: ', peerConnection.iceConnectionState);
    });

    peerConnection.addEventListener("icegatheringstatechange", (event) => {
        console.log('ICE Gathering State: ', peerConnection.iceGatheringState);
    })
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
        const socket = await getState().websocket.socket;
        const peerConnection = await setupWebrtc(getState, dispatch);
        const userId = await getState().user.id;
        const currentChannel = await getState().webrtc.currentChannel;
        const userList = await findUserListOfChannel(getState, currentChannel);
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
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i] != userId) {
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
                }
            }
        }
        return peerConnection;
    }
);

export const joinCall = createAsyncThunk(
    "webrtc/joinCall",
    async (_, { getState, dispatch }: any) => {
        const socket = await getState().websocket.socket;
        const userId = await getState().user.id;
        const currentChannel = await getState().webrtc.currentChannel;
        const peerConnection = await setupWebrtc(getState, dispatch);
        const remoteOfferDescription = await getState().webrtc
            .remoteOfferDescription;
        const iceCandidates = await getState().webrtc.iceCandidates;
        const userList = await findUserListOfChannel(getState, currentChannel);
        
        dispatch(setGettingCall(false));
        if (peerConnection && remoteOfferDescription) {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(remoteOfferDescription)
            );
            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);
            await iceCandidates.map((candidate: any) => {
                peerConnection.addIceCandidate(candidate);
            });
            dispatch(resetIceCandidates());
            if (socket) {
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i] != userId) {
                        const formData = {
                            action: "offer_answer",
                            target: "user",
                            targetId: userList[i],
                            data: {
                                data: answerDescription,
                                from_user: userId,
                            },
                        };
                        socket.send(JSON.stringify(formData));
                    }
                }
                
            }
        }
        return peerConnection;
    }
);

export const addRemoteToPeerConnection = createAsyncThunk(
    "webrtc/addRemoteToPeerConnection",
    async (
        remoteDescription: RTCSessionDescription,
        { getState, dispatch }: any
    ) => {
        const peerConnection = await getState().webrtc.peerConnection;
        const iceCandidates = await getState().webrtc.iceCandidates;
        if (peerConnection) {
            await peerConnection.setRemoteDescription(remoteDescription);
            if (iceCandidates.length > 0) {
                for (let i = 0; i < iceCandidates.length; i++) {
                    await peerConnection.addIceCandidate(iceCandidates[i])
                }
                await dispatch(resetIceCandidates());
            }
            return peerConnection;
        }
        return null;
    }
);

export const processIceCandidates = createAsyncThunk(
    "webrtc/processIceCandidates",
    async (_, { getState, dispatch }: any) => {
        const peerConnection = await getState().webrtc.peerConnection;
        const iceCompleted = await getState().webrtc.iceCompleted;
        if (peerConnection && peerConnection.remoteDescription) {
            const iceCandidates = await getState().webrtc.iceCandidates;
            await iceCandidates.map((candidate: any) => {
                peerConnection.addIceCandidate(candidate);
            });
            dispatch(resetIceCandidates());
            // if (iceCompleted) {
            //     dispatch(setIceCompleted(false));
            // }
            return peerConnection;
        }
        return null;
    }
);

export const hangup = createAsyncThunk(
    "webrtc/hangup",
    async (_, { getState, dispatch }: any) => {
        const webrtc = await getState().webrtc;
        if (webrtc.localStream) {
            await webrtc.localStream
                .getTracks()
                .forEach((track: any) => track.stop());
            await webrtc.localStream.release();
        }
        count = 0;
        if (webrtc.peerConnection) {
            await webrtc.peerConnection.close();
        }
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
    setCalling
} = webrtcSlice.actions;

export default webrtcSlice.reducer;

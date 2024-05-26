import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RTCPeerConnection, MediaStream, RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";
import Utils from "./utils";
const configuration = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302"
            ],
        },
    ],
};
let count = 0

interface webrtcState {
    peerConnection: RTCPeerConnection | null;
    localStream: MediaStream | null;
    remoteStreams: Array<MediaStream>;
    iceCandidates: Array<RTCIceCandidate>;
    remoteOfferDescription: RTCSessionDescription | null;
    currentChannel: number;
    gettingCall: boolean;
    iceCompleted: boolean;
}

const initialState: webrtcState = {
    peerConnection: null,
    localStream: null,
    remoteStreams: [],
    iceCandidates: [],
    remoteOfferDescription: null,
    currentChannel: 0,
    gettingCall: false,
    iceCompleted: false
}

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
        setRemoteOfferDescription: (state, action: PayloadAction<RTCSessionDescription>) => {
            state.remoteOfferDescription = action.payload;
            
        },
        resetIceCandidates: (state) => {
            state.iceCandidates = []
        },
        setGettingCall: (state, action: PayloadAction<boolean>) => {
            state.gettingCall = action.payload
        },
        setCurrentChannel: (state, action: PayloadAction<number>) => {
            state.currentChannel = action.payload
        },
        setIceCompleted: (state, action: PayloadAction<boolean>) => {
            state.iceCompleted = action.payload
        },
        hangup: (state) => {
            if (state.localStream) {
                state.localStream.getTracks().forEach((track) => track.stop());
                state.localStream.release();
            }
            state.remoteStreams = [];
            state.remoteOfferDescription = null;
            state.localStream = null;
            state.iceCandidates = [];
            state.iceCompleted = false;
            count = 0;
            if (state.peerConnection) {
                state.peerConnection.close();
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createCall.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("Create peer connection")
            }
        })
        builder.addCase(joinCall.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("Join peer connection")
            }
        })
        builder.addCase(addRemoteToPeerConnection.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("add remote description to peer connection");
            }
        })
        builder.addCase(processIceCandidates.fulfilled, (state, action) => {
            if (action.payload) {
                state.peerConnection = action.payload;
                console.log("add ice candidates to peer connection");
            }
        })
    }
})

async function setupWebrtc (getState: any, dispatch: any) {
    const socket = await getState().websocket.socket;
    const userId = await getState().user.id;
    const currentChannel = await getState().webrtc.currentChannel;
    let peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addEventListener("connectionstatechange", (event) => {})
    peerConnection.addEventListener("icecandidate", (event: any) => {
        if (!event.candidate) {
            if (event.target.iceGatheringState === "complete" && socket) {
                const form_data = {
                    action: "icecandidate_completed",
                    target: "channel",
                    targetId: currentChannel,
                    data: {
                        from_user: userId,
                        data: event.candidate
                    }
                }
                socket.send(JSON.stringify(form_data));
            }
            return
        }
        if (socket) {
            const form_data = {
                action: "icecandidate",
                target: "channel",
                targetId: currentChannel,
                data: {
                    from_user: userId,
                    data: event.candidate
                }
            }
            console.log("candidate", ++count);
            socket.send(JSON.stringify(form_data));
        }
    })

    peerConnection.addEventListener("icecandidateerror", (event) => {})

    peerConnection.addEventListener("iceconnectionstatechange", (event) => {})

    peerConnection.addEventListener("negotiationneeded", (event) => {})
    
    peerConnection.addEventListener("signalingstatechange", (event) => {})

    peerConnection.addEventListener("track", (event: any) => {
        dispatch(addRemoteStream(event.streams[0]))
    })
    const stream = await Utils.getStream();
    if (stream ) {
        dispatch(setLocalStream(stream));
        stream.getTracks().forEach((track: any) => peerConnection.addTrack(track, stream));
    }
    return peerConnection;
}

export const createCall = createAsyncThunk(
    "webrtc/createCall",
    async (_, {getState, dispatch}: any) => {
        const socket = await getState().websocket.socket;        
        const peerConnection = await setupWebrtc(getState, dispatch);
        const userId = await getState().user.id;
        const currentChannel = await getState().webrtc.currentChannel;
        if (peerConnection) {
            let sessionConstraints = {
                mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true,
                    VoiceActivityDetection: true,
                },
            };
            const offerDescription = await peerConnection.createOffer(sessionConstraints);
            await peerConnection.setLocalDescription(offerDescription);
            if (socket) {
                const formData = {
                    action: "offer_description",
                    target: "channel",
                    targetId: currentChannel,
                    data: {
                        from_user: userId,
                        data: offerDescription
                    }
                }
                socket.send(JSON.stringify(formData));
            }
        }
        return peerConnection;
    }
)

export const joinCall = createAsyncThunk(
    "webrtc/joinCall",
    async (_, {getState, dispatch}: any) => {
        const socket = await getState().websocket.socket;
        const userId = await getState().user.id;
        const currentChannel = await getState().webrtc.currentChannel;
        const peerConnection = await setupWebrtc(getState, dispatch);
        const remoteOfferDescription = await getState().webrtc.remoteOfferDescription;
        const iceCandidates = await getState().webrtc.iceCandidates;
        dispatch(setGettingCall(false));
        if (peerConnection && remoteOfferDescription) {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(remoteOfferDescription)
            );
            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);
            await iceCandidates.map((candidate: any) => {
                peerConnection.addIceCandidate(candidate);

            })
            dispatch(resetIceCandidates())
            if (socket) {
            
                const formData = {
                    action: "offer_answer",
                    target: "channel",
                    targetId: currentChannel,
                    data: {
                        data: answerDescription,
                        from_user: userId
                    }
                }
                socket.send(JSON.stringify(formData));

            }
        }
        return peerConnection;
    }
)

export const addRemoteToPeerConnection = createAsyncThunk(
    "webrtc/addRemoteToPeerConnection",
    async (remoteDescription: RTCSessionDescription, {getState, dispatch}: any) => {
        const peerConnection = await getState().webrtc.peerConnection;
        await peerConnection.setRemoteDescription(remoteDescription);
        return peerConnection;
    }
)

export const processIceCandidates = createAsyncThunk(
    "webrtc/processIceCandidates",
    async (_, {getState, dispatch}: any) => {
        const peerConnection = await getState().webrtc.peerConnection;
        if (peerConnection) {
            const iceCandidates = await getState().webrtc.iceCandidates;
            await iceCandidates.map((candidate: any) => {
                peerConnection.addIceCandidate(candidate);
            })
            dispatch(resetIceCandidates())
            return peerConnection;
        }
        return null;
    }
)

export const { addIceCandidate, addRemoteStream, setRemoteOfferDescription,
    setLocalStream, hangup, setGettingCall,
    setCurrentChannel, setIceCompleted, resetIceCandidates } = webrtcSlice.actions;

export default webrtcSlice.reducer;
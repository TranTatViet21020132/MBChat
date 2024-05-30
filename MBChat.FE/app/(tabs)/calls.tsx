import { View, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import Button from "@/components/VideoCall/Button";
import GettingCall from "@/components/VideoCall/GettingCall";
import Video from "@/components/VideoCall/Video";
import {
    MediaStream,
    RTCPeerConnection,
    RTCSessionDescription,
} from "react-native-webrtc";
import { RTCIceCandidate } from "react-native-webrtc";
import Utils from "@/components/VideoCall/Utils";
import { WebsocketContext } from "@/context/WebsocketContext";
import { UserContext } from "@/context/userContext";
import { ChatContext } from "@/context/chatContext";
import { useRouter } from "expo-router";
import { CallContext } from "@/context/CallContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { hangup, joinCall, processIceCandidates } from "@/store/webrtc/webrtcSlice";
const configuration = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302"
            ],
        },
    ],
};
let remoteCandidates: RTCIceCandidate[] = [];
let count: number = 0;
let added: number = 0;
const Calls = () => {
    const webrtc = useSelector((state: RootState) => state.webrtc);
    const dispatch = useDispatch<AppDispatch>();
    
    const handleProcessIceCandidates = async (hostId: string) => {
        await dispatch(processIceCandidates(hostId))
    }

    useEffect(() => {
        if (Object.keys(webrtc.peerConnectionRecord).length > 0) {
            for (const key in webrtc.peerConnectionRecord) {
                if (webrtc.peerConnectionRecord[key] && webrtc.iceCompletedRecord[key] && webrtc.peerConnectionRecord[key].remoteDescription && webrtc.iceCandidatesRecord[key].length > 0) {
                    handleProcessIceCandidates(key);
                } 
            }
        }

    }, [webrtc, webrtc.remoteStreams])
    if (webrtc.gettingCall) {
        return <GettingCall hangup={ () => {
            dispatch(hangup());
        }} join={async () => {
            await dispatch(joinCall(webrtc.firstUserHost));
        }} />;
    }
    
    if (webrtc.localStream) {
            return (
                <Video
                    hangup={() => {dispatch(hangup())}}
                    localStream={webrtc.localStream}
                    remoteStreams={webrtc.remoteStreams}
                />
            );
        }
    return <View>
        <Text>calls</Text>
      </View>
    // const router = useRouter();

    // const [localStream, setLocalStream] = useState<MediaStream | null>();
    // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    // const [gettingCall, setGettingCall] = useState(false);
    // const pc = useRef<RTCPeerConnection>();
    // const connecting = useRef(false);
    // const websocketContext = React.useContext(WebsocketContext);
    // const userContext = React.useContext(UserContext);
    // const chatContext = React.useContext(ChatContext);
    // const callContext = React.useContext(CallContext);

    // function handleRemoteCandidate(iceCandidate: RTCIceCandidate) {
    //     iceCandidate = new RTCIceCandidate(iceCandidate);
    //     if (!pc.current) return;
    //     // pc.current.addIceCandidate(iceCandidate);
    //     if (!pc.current.remoteDescription) {
    //         if (
    //             remoteCandidates.some(
    //                 (candidate) =>
    //                     candidate.candidate === iceCandidate.candidate
    //             )
    //         ) {
    //             return;
    //         }
    //         remoteCandidates.push(iceCandidate);
    //         // return remoteCandidates.push( iceCandidate );
    //         return;
    //     }
    //     return pc.current.addIceCandidate(iceCandidate);
    // }

    // function processCandidates() {
    //     if (!pc.current || !callContext) return;
    //     if (callContext.callInformation.icecandidate.data.length < 1) {
    //         return;
    //     }
    //     let from = added;
    //     added = callContext.callInformation.icecandidate.data.length;
    //     callContext.callInformation.icecandidate.data
    //         .slice(from)
    //         .map((candidate) => {
    //             if (pc.current) {
    //                 console.log(
    //                     "Process to added:",
    //                     "User",
    //                     userContext?.userInfomation.id,
    //                     callContext.callInformation.icecandidate.data.length
    //                 );
    //                 pc.current.addIceCandidate(candidate);
    //             }
    //         });
    //     remoteCandidates = [];
    // }

    // const handleAnswerOffer = async () => {
    //     if (!pc.current || !callContext?.callInformation.offerAnswer) return;

    //     await pc.current.setRemoteDescription(
    //         new RTCSessionDescription(callContext?.callInformation.offerAnswer)
    //     );
    //     processCandidates();
    // };

    // useEffect(() => {
    //     if (
    //         !pc.current &&
    //         callContext?.callInformation.from_user ==
    //             userContext?.userInfomation.id &&
    //         callContext?.callInformation.gettingCall
    //     ) {
    //         console.log("yes");
    //         create();
    //     }

    //     if (
    //         callContext?.callInformation.from_user !=
    //             userContext?.userInfomation.id &&
    //         callContext?.callInformation.offerDescription &&
    //         !connecting.current
    //     ) {
    //         setGettingCall(true);
    //     }
    //     if (
    //         callContext?.callInformation.from_user ==
    //             userContext?.userInfomation.id &&
    //         pc.current &&
    //         !pc.current?.remoteDescription &&
    //         callContext?.callInformation.offerAnswer
    //     ) {
    //         handleAnswerOffer();
    //     }
    //     if (
    //         callContext &&
    //         added > 0 &&
    //         callContext.callInformation.icecandidate.data.length > added
    //         && pc.current?.remoteDescription
    //     ) {
    //         processCandidates();
    //     }
    // }, [callContext?.callInformation]);

    // const setupWebrtc = async () => {
    //     pc.current = new RTCPeerConnection(configuration);

    //     pc.current.addEventListener("connectionstatechange", (event) => {
    //         console.log(pc.current?.connectionState);
    //         switch (pc.current?.connectionState) {
    //             case "closed":
    //                 count = 0;
    //                 added = 0;
    //                 callContext?.setCallInformation({
    //                     from_user: 0,
    //                     from_channel: 0,
    //                     offerDescription: null,
    //                     offerAnswer: null,
    //                     icecandidate: {
    //                         from_user: 0,
    //                         data: [],
    //                     },
    //                     gettingCall: false,
    //                 });
    //                 console.log("close");
    //                 pc.current = undefined;
    //                 setRemoteStream(null);
    //                 handup();
    //                 break;
    //         }
    //     });

    //     pc.current.addEventListener("icecandidate", (event: any) => {
            
    //         if (event.target.iceGatheringState) {
    //             console.log("candidate state", event.target.iceGatheringState, event.candidate )
    //         }
    //         if (!event.candidate || !callContext) {
    //             return;
    //         }
    //         // handleRemoteCandidate(event.candidate)
    //         count += 1;
    //         console.log("User", userContext?.userInfomation.id, count);
    //         const form_data = {
    //             action: "icecandidate",
    //             target: "channel",
    //             targetId: callContext.callInformation.from_channel,
    //             data: {
    //                 from_user: userContext?.userInfomation.id,
    //                 data: event.candidate,
    //             },
    //         };
    //         if (websocketContext?.websocket) {
    //             websocketContext.websocket.send(JSON.stringify(form_data));
    //         }
    //     });

    //     pc.current.addEventListener("icecandidateerror", (event) => {
    //         // You can ignore some candidate errors.
    //         // Connections can still be made even when errors occur.
    //     });

    //     pc.current.addEventListener("iceconnectionstatechange", (event) => {
    //         if (!pc.current) return;
    //         console.log(pc.current.iceConnectionState);
    //         switch (pc.current.iceConnectionState) {
    //             case "connected":
    //             case "completed":
    //                 // You can handle the call being connected here.
    //                 // Like setting the video streams to visible.
    //                 break;
    //         }
    //     });

    //     pc.current.addEventListener("negotiationneeded", (event) => {
    //         // You can start the offer stages here.
    //         // Be careful as this event can be called multiple times.
    //     });

    //     pc.current.addEventListener("signalingstatechange", (event) => {
    //         if (!pc.current) return;
    //         switch (pc.current.signalingState) {
    //             case "closed":
    //                 // You can handle the call being disconnected here.

    //                 break;
    //         }
    //     });

    //     pc.current.addEventListener("track", async (event) => {
    //         if (pc.current?.remoteDescription) {
    //             const remoteMediaStream = new MediaStream();
    //             await event.streams[0].getTracks().forEach((track) => {
    //                 remoteMediaStream.addTrack(track);
    //             });
    //             setRemoteStream(remoteMediaStream);
    //         }
    //     });

    //     const stream = await Utils.getStream();
    //     if (stream) {
    //         setLocalStream(stream);
    //         stream
    //             .getTracks()
    //             .forEach((track) => pc.current?.addTrack(track, stream));
    //     }
    // };

    // const create = async () => {
    //     console.log("Calling");
    //     connecting.current = true;

    //     await setupWebrtc();

    //     if (pc.current) {
    //         let sessionConstraints = {
    //             mandatory: {
    //                 OfferToReceiveAudio: true,
    //                 OfferToReceiveVideo: true,
    //                 VoiceActivityDetection: true,
    //             },
    //         };
    //         try {
    //             const offerDescription = await pc.current.createOffer(
    //                 sessionConstraints
    //             );
    //             await pc.current.setLocalDescription(offerDescription);

    //             if (websocketContext?.websocket && callContext) {
    //                 const formData = {
    //                     action: "offer_description",
    //                     target: "channel",
    //                     targetId: callContext.callInformation.from_channel,
    //                     data: {
    //                         data: offerDescription,
    //                         from_user: userContext?.userInfomation.id,
    //                     },
    //                 };
    //                 websocketContext.websocket.send(JSON.stringify(formData));
    //             }
    //             // Send the offerDescription to the other participant.
    //         } catch (err) {
    //             // Handle Errors
    //         }
    //     }
    // };

    // const join = async () => {
    //     console.log("Joining the call");
    //     connecting.current = true;
    //     setGettingCall(false);

    //     if (callContext?.callInformation.offerDescription) {
    //         await setupWebrtc();

    //         if (pc.current && callContext.callInformation.offerDescription) {
    //             await pc.current.setRemoteDescription(
    //                 new RTCSessionDescription(
    //                     callContext.callInformation.offerDescription
    //                 )
    //             );
    //             const answerDescription = await pc.current.createAnswer();
    //             await pc.current.setLocalDescription(answerDescription);
    //             processCandidates();
                
    //               setTimeout(() => {
    //                 if (websocketContext?.websocket) {
    //                   console.log("sendt");
    //                   const formData = {
    //                       action: "offer_answer",
    //                       target: "channel",
    //                       targetId: callContext.callInformation.from_channel,
    //                       data: {
    //                           data: answerDescription,
    //                           from_user: userContext?.userInfomation.id,
    //                       },
    //                   };
    //                   websocketContext.websocket.send(JSON.stringify(formData));
    //                 }
    //               }, 2000)
                    
    //         }
    //     }
    // };

    // const handup = async () => {
    //     setGettingCall(false);
    //     connecting.current = false;
    //     streamCleanUp();
    //     if (pc.current) {
    //         pc.current.close();
    //     }
    // };

    // const streamCleanUp = async () => {
    //     if (localStream) {
    //         localStream.getTracks().forEach((track) => track.stop());
    //         localStream.release();
    //     }
    //     setLocalStream(null);
    //     setRemoteStream(null);
    // };

    // if (gettingCall) {
    //     return <GettingCall hangup={handup} join={join} />;
    // }

    // if (localStream) {
    //     return (
    //         <Video
    //             hangup={handup}
    //             localStream={localStream}
    //             remoteStream={remoteStream}
    //         />
    //     );
    // }

    // return (
    //     <View style={styles.container}>
    //         <Button
    //             iconName="video"
    //             backgroundColor="grey"
    //             onPress={() => {
    //                 // create();
    //                 if (websocketContext?.websocket) {
    //                     const formData = {
    //                         action: "video_call",
    //                         target: "channel",
    //                         targetId: 1,
    //                         data: {
    //                             from_user: userContext?.userInfomation.id,
    //                             from_channel: chatContext?.chats.id,
    //                         },
    //                     };
    //                     websocketContext?.websocket.send(
    //                         JSON.stringify(formData)
    //                     );
    //                 }
    //             }}
    //             style={{}}
    //         />
    //     </View>
    // );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Calls;

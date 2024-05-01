import { View, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import Button from "@/components/VideoCall/Button";
import GettingCall from "@/components/VideoCall/GettingCall";
import Video from "@/components/VideoCall/Video";
import { MediaStream, RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
import {RTCIceCandidate} from "react-native-webrtc";
import Utils from "@/components/VideoCall/Utils";
import { WebsocketContext } from "@/context/WebsocketContext";
import { UserContext } from "@/context/userContext";
const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Calls = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
    const [gettingCall, setGettingCall] = useState(false);
    const pc = useRef<RTCPeerConnection>();
    const connecting = useRef(false);
    const websocketContext = React.useContext(WebsocketContext);
    const userContext = React.useContext(UserContext);
    let remoteCandidates = [];

    function handleRemoteCandidate( iceCandidate: any ) {
      iceCandidate = new RTCIceCandidate( iceCandidate );
      if (!pc.current) {
        return;
      } 
      if ( pc.current.remoteDescription == null ) {
        return remoteCandidates.push( iceCandidate );
      };
      return pc.current.addIceCandidate( iceCandidate );
    };

    function processCandidates() {
      if ( remoteCandidates.length < 1 || pc.current) { return; };
      
      remoteCandidates.map( candidate => pc.current.addIceCandidate( candidate ) );
      remoteCandidates = [];
    };

    
    useEffect(() => {
      if (userContext?.userInfomation.offerDescription && !connecting.current) {
        setGettingCall(true);
      }
      if (pc.current && !pc.current?.remoteDescription && userContext?.userInfomation.offerAnswer ) {
        console.log("offerAnswer")
        pc.current.setRemoteDescription(new RTCSessionDescription(userContext.userInfomation.offerAnswer))
      }
    }, [userContext?.userInfomation])

    const setupWebrtc = async () => {
        pc.current = new RTCPeerConnection(configuration);

        pc.current.addEventListener("connectionstatechange", (event) => {
            console.log(pc.current?.connectionState);
            switch (pc.current?.connectionState) {
                case "closed":
                    break;
            }
        });

        pc.current.addEventListener("icecandidate", (event: any) => {
            if (!event.candidate) {
                return;
            }
            handleRemoteCandidate(event.candidate)
            
        });

        pc.current.addEventListener( 'icecandidateerror', event => {
          // You can ignore some candidate errors.
          // Connections can still be made even when errors occur.
        } );
        
        pc.current.addEventListener( 'iceconnectionstatechange', event => {
          if (!pc.current) return;
          console.log(pc.current.iceConnectionState);
          switch( pc.current.iceConnectionState ) {
            case 'connected':
            case 'completed':
              // You can handle the call being connected here.
              // Like setting the video streams to visible.
              break;
          };
        } );

        pc.current.addEventListener( 'negotiationneeded', event => {
          // You can start the offer stages here.
          // Be careful as this event can be called multiple times.
        } );
        
        pc.current.addEventListener( 'signalingstatechange', event => {
          if (!pc.current) return;
          switch( pc.current.signalingState ) {
            case 'closed':
              // You can handle the call being disconnected here.
        
              break;
          };
        } );

        pc.current.addEventListener("track", async (event) => {
          let remoteMediaStream = remoteMediaStream || new MediaStream();
	        await remoteMediaStream.addTrack( event.track, remoteMediaStream );
          console.log(remoteMediaStream)
          setRemoteStream(event.streams[0]);
        });

        const stream = await Utils.getStream();
        if (stream) {
            setLocalStream(stream);
            stream
                .getTracks()
                .forEach((track) => pc.current?.addTrack(track, stream));
        }
    };

    const create = async () => {
      console.log("Calling");
      connecting.current = true;

      await setupWebrtc();
      
      if (pc.current) {
        let sessionConstraints = {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
            VoiceActivityDetection: true
          }
        };
        try {
          const offerDescription = await pc.current.createOffer( sessionConstraints );
          await pc.current.setLocalDescription( offerDescription );
          processCandidates();
          if (websocketContext?.websocket) {
            const formData = {
              action: "video_call",
              target: "user",
              "targetId": 3,
              "data": offerDescription
            }
            websocketContext.websocket.send(JSON.stringify(formData));
            

          }
          // Send the offerDescription to the other participant.
        } catch( err ) {
          // Handle Errors
        };
      }
    };

    const join = async () => {
      console.log("Joining the call")
      connecting.current = true;
      setGettingCall(false);

      if (userContext?.userInfomation.offerDescription) {
        await setupWebrtc();

        if (pc.current) {
          pc.current.setRemoteDescription(new RTCSessionDescription(userContext?.userInfomation.offerDescription))
          const answerDescription = await pc.current.createAnswer();
          await pc.current.setLocalDescription( answerDescription );
          processCandidates();
          if (websocketContext?.websocket) {
            console.log("sendt")
            const formData = {
              "action": "offer_answer",
              target: "user",
              targetId: 1,
              "data": answerDescription
            }
            websocketContext.websocket.send(JSON.stringify(formData));
            
          }
        }
      }
    };

    const handup = async () => {
      setGettingCall(false);
      connecting.current = false;
      streamCleanUp();
      if (pc.current) {
        pc.current.close();
      }
    };

    const streamCleanUp = async () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream.release();
      }
      setLocalStream(null);
      setRemoteStream(null);
    }

    if (gettingCall) {
        return <GettingCall hangup={handup} join={join} />;
    }

    if (localStream) {
        return (
            <Video
                hangup={handup}
                localStream={localStream}
                remoteStream={remoteStream}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Button
                iconName="video"
                backgroundColor="grey"
                onPress={create}
                style={{}}
            />
        </View>
    );
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

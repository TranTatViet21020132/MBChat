import { mediaDevices } from "react-native-webrtc";

export default class Utils {
    static async getStream() {
        // let isFront = true;
        // const sourceInfos = await mediaDevices.enumerateDevices();
        // console.log(sourceInfos);
        // let videoSourceId;
        // for (let i = 0; i < sourceInfos.length; i++) {
        //     const sourceInfo = sourceInfos[i];
        //     if (
        //         sourceInfo.kind == "videoinput" &&
        //         sourceInfo.facing == (isFront ? "front" : "environment")
        //     ) {
        //         videoSourceId = sourceInfo.deviceId;
        //     }
        // }
        // const stream = await mediaDevices.getUserMedia({
        //     audio: true,
        //     video: {
        //         width: 640,
        //         height: 480,
        //         frameRate: 30,
        //         facingMode: isFront ? "user" : "environment",
        //         deviceId: videoSourceId,
        //     },
        // });
        // if (typeof stream != "boolean") return stream
        // return null;
        let mediaConstraints = {
            audio: true,
            video: {
                frameRate: 30,
                facingMode: 'user'
            }
        };
        
        let localMediaStream;
        let remoteMediaStream;
        let isVoiceOnly = false;
        
        try {
            const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );
        
            if ( isVoiceOnly ) {
                let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
                videoTrack.enabled = false;
            };
        
            localMediaStream = mediaStream;
            return localMediaStream
        } catch( err ) {
            // Handle Error
            return null;
        };
    }
}

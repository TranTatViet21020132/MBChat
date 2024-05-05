import React from "react";
import { RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";
export type CallContextType = {
    callInformation: CallInformationData;
    setCallInformation: React.Dispatch<React.SetStateAction<CallInformationData>>;
}

export interface CallInformationData {
    from_user: number;
    from_channel: number;
    icecandidate: {
        from_user: number;
        data: Array<RTCIceCandidate>
    };
    offerAnswer: RTCSessionDescription | null;
    offerDescription: RTCSessionDescription | null;
    gettingCall: boolean;
}

export const CallContext = React.createContext<CallContextType | null>(null);

const CallProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [callInformation, setCallInformation] = React.useState<CallInformationData>(
        {
            from_user: 0,
            from_channel: 0,
            icecandidate: {
                from_user: 0,
                data: []
            },
            offerAnswer: null,
            offerDescription: null,
            gettingCall: false
        }
    )

    return (
        <CallContext.Provider value={{ callInformation, setCallInformation }}>
            {children}
        </CallContext.Provider>
    )
}

export default CallProvider;
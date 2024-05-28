import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MediaStream, RTCView } from "react-native-webrtc";
import Button from "./Button";
interface Props {
    hangup: () => void;
    localStream?: MediaStream | null;
    remoteStreams?: Array<MediaStream>;
}

function ButtonContainer(props: Props) {
    return (
        <View style={styles.bContainer}>
            <Button
                iconName="phone"
                backgroundColor="red"
                onPress={props.hangup}
                style={{}}
            />
        </View>
    );
}

export default function Video(props: Props) {
    if (props.localStream && props.remoteStreams?.length == 0) {
        return (
            <View style={styles.container}>
                <RTCView
                    streamURL={props.localStream.toURL()}
                    objectFit={"cover"}
                    style={styles.video}
                />
                <ButtonContainer hangup={props.hangup} />
            </View>
        );
    }
    if (props.localStream && props.remoteStreams && props.remoteStreams?.length > 0) {
        return (
            <View style={styles.container}>
                {props.remoteStreams?.map((remoteStream, idx) => {
                    return <RTCView 
                        streamURL={remoteStream.toURL()}
                        key={idx}
                        objectFit={"cover"}
                        style={{position: 'absolute',
                        width: 100,
                        height: 150,
                        top: 0,
                        left: 110 * idx,
                        elevation: 10
                        }}
                    />
                })}
                {/* <RTCView
                    streamURL={props.remoteStream.toURL()}
                    objectFit={"cover"}
                    style={styles.video}
                /> */}
                <RTCView
                    streamURL={props.localStream.toURL()}
                    objectFit={"cover"}
                    style={styles.video}
                />
                <ButtonContainer hangup={props.hangup} />
            </View>
        );
    }
    return <ButtonContainer hangup={props.hangup} />;
}

const styles = StyleSheet.create({
    bContainer: {
        flexDirection: "row",
        bottom: 30,
    },
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    video: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    videoLocal: {
        position: 'absolute',
        width: 100,
        height: 150,
        top: 0,
        left: 20,
        elevation: 10
    }
});

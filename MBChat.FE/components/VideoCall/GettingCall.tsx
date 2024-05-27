import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Button from "./Button";
import { Avatar } from "react-native-elements";
interface Props {
    hangup: () => void;
    join: () => void;
}

export default function GettingCall(props: Props) {
    return (
        <View style={styles.container}>
            <Avatar 
            source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
            containerStyle={{
                ...styles.image
            }}
            />
            <View style={styles.bContainer}>
                <Button 
                iconName="phone"
                backgroundColor="green"
                onPress={props.join}
                style={{marginRight: 30}}
                />
                <Button 
                iconName="phone"
                backgroundColor="red"
                onPress={props.hangup}
                style={{marginLeft: 30}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    bContainer: {
        flexDirection: 'row',
        bottom: 30
    }
})
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from '@expo/vector-icons';
import {Clipboard} from "react-native";
export const ChatFooter = ({ currentMessage, setOpenMenu, setOpenReplyMessage}: any) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={() => {
                setOpenReplyMessage(true)
                setOpenMenu(false)
            }}>
                <Entypo name="reply" size={24} color="black" />
                <Text>Trả lời</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => {
                setOpenMenu(false);
                Clipboard.setString(currentMessage.text)
            }}>
                <FontAwesome5 name="copy" size={24} color="black" />
                <Text>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
                <Entypo name="forward" size={24} color="black" />
                <Text>Chuyển tiếp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => setOpenMenu(false)}>
                <Fontisto name="close-a" size={20} color="black" /> 
                <Text>Đóng</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    item: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
});

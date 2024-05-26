import { View, Text, ScrollView, FlatList } from "react-native";
import chats from "@/assets/data/chats.json";
import ChatRow from "@/components/chats/ChatRow";
import { defaultStyles } from "@/constants/Styles";
import { ChatListContext } from "@/context/chatListContext";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const ChatsPage = () => {
    const chatList = useSelector((state: RootState) => state.chat.chatList);
    const socket = useSelector((state: RootState) => state.websocket.socket);
    function waitForSocketConnection(websocket: WebSocket) {
        setTimeout(function () {
            if (websocket) {
                if (websocket.readyState === 1) {
                    const formData = {
                        action: "get_chat_list",
                    };
                    const formSubmit = JSON.stringify(formData);
                    websocket.send(formSubmit);
                    console.log("sending successfully")
                } else {
                    waitForSocketConnection(websocket);
                }
            }
        }, 5);
    }

    // const {chatList} = chatListContext;
    React.useEffect(() => {
        if (chatList.length == 0 && socket) {
            waitForSocketConnection(socket);
        }
    }, [chatList, socket]);

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
                marginTop: 100,
                paddingBottom: 0,
                flex: 1,
                backgroundColor: "#fff",
            }}
        >
            <FlatList
                data={chatList}
                renderItem={({ item }) => <ChatRow {...item} />}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                    <View
                        style={[defaultStyles.separator, { marginLeft: 90 }]}
                    />
                )}
                scrollEnabled={false}
            />
        </ScrollView>
    );
};
export default ChatsPage;

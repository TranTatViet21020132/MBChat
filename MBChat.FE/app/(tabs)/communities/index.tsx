import { View, Text, ScrollView, FlatList } from "react-native";
import ChatRow from "@/components/chats/ChatRow";
import { defaultStyles } from "@/constants/Styles";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Communities = () => {
    const communityList = useSelector((state: RootState) => state.chat.communityList);
    const socket = useSelector((state: RootState) => state.websocket.socket);
    function waitForSocketConnection(websocket: WebSocket) {
        setTimeout(function () {
            if (websocket) {
                if (websocket.readyState === 1) {
                    const formData = {
                        action: "get_community_list",
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

    React.useEffect(() => {
        if (communityList.length == 0 && socket) {
            waitForSocketConnection(socket);
        }
    }, [socket])

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
                paddingBottom: 0,
                flex: 1,
                backgroundColor: "#fff",
            }}
        >
            <FlatList
                data={communityList}
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

export default Communities;

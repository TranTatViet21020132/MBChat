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

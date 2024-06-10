import { View, ScrollView, FlatList } from "react-native";
import ChatRow from "@/components/chats/ChatRow";
import { defaultStyles } from "@/constants/Styles";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const ChatsPage = () => {
    const chatList = useSelector((state: RootState) => state.chat.chatList);
    const chatListSearch = useSelector((state: RootState) => state.chat.chatListSearch).trim();
    const filteredChats = chatList.filter(chat => 
        chat.from.toLowerCase().includes(chatListSearch.toLowerCase())
      );
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
                data={filteredChats}
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

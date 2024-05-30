import { View, Text, ScrollView, FlatList } from "react-native";
import ChatRow from "@/components/chats/ChatRow";
import { defaultStyles } from "@/constants/Styles";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Communities = () => {
    const communityList = useSelector((state: RootState) => state.chat.communityList);
    const communityListSearch = useSelector((state: RootState) => state.chat.communityListSearch);
    const filteredCommunities = communityList.filter(community =>
        community.from.toLowerCase().includes(communityListSearch.toLowerCase())
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
                data={filteredCommunities}
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

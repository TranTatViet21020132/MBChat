import { View, Text, ScrollView, FlatList } from 'react-native';
import chats from '@/assets/data/chats.json';
import ChatRow from '@/components/chats/ChatRow';
import { defaultStyles } from '@/constants/Styles';
import { ChatListContext } from '@/context/chatListContext';
import React from 'react';
import { WebsocketContext } from '@/context/WebsocketContext';
const ChatsPage = () => {
    function waitForSocketConnection(websocket: WebSocket) {
      setTimeout(function () {
          if (websocket) {
              if (websocket.readyState === 1) {
                  const formData = {
                      action: "get_chat_list"
                  };
                  const formSubmit = JSON.stringify(formData);
                  websocket.send(formSubmit);
                  
              } else {
                  waitForSocketConnection(websocket);
              }
          }
      }, 5);
  }
    
  const websocketContext = React.useContext(WebsocketContext);
  const chatListContext = React.useContext(ChatListContext);
  if (!chatListContext || !chatListContext.setChatList) {
    return null;
  }
  const {chatList} = chatListContext;
  React.useEffect(() => {
    if (chatList.length == 0 && websocketContext?.websocket) {
          waitForSocketConnection(websocketContext.websocket);
      }
  }, [chatList])

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ marginTop: 100, paddingBottom: 0, flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={chatList}
        renderItem={({ item }) => <ChatRow {...item} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};
export default ChatsPage;
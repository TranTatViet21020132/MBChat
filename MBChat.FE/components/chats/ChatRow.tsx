import SwipeableRow from '@/components/SwipeableRow';
import { COLORS } from '@/constants/Colors';
import { format } from 'date-fns';
import { Link, router, useRouter } from 'expo-router';
import { FC, useCallback } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { Screen } from '@/constants/Screens';
import React from 'react';
import { ChatContext } from '@/context/chatContext';

export interface ChatRowProps {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
}

const ChatRow: FC<ChatRowProps> = ({ id, from, date, img, msg, read, unreadCount }) => {
  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { setChats } = chatContext;
  const chatData = { id, from, date, img, msg, read, unreadCount };

  const handleSingeChatfetch = useCallback(() => {
    router.push(`/(tabs)/chats/${id}`);
    setChats(chatData);
  }, []);

  return (
    <SwipeableRow
      screen={Screen.Chats}
      handleMore={() => console.log('More function called')}
      handleArchive={() => console.log('Archive function called')}
    >
      <TouchableHighlight
      activeOpacity={0.8}
      underlayColor={COLORS.lightGray}
      onPress={handleSingeChatfetch}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingLeft: 10,
            paddingVertical: 10,
          }}>
          <Image source={{ uri: img }} style={{ width: 50, height: 50, borderRadius: 50 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{from}</Text>
            <Text style={{ fontSize: 16, color: COLORS.gray }}>
              {msg.length > 40 ? `${msg.substring(0, 40)}...` : msg}
            </Text>
          </View>
          <Text style={{ color: COLORS.gray, paddingRight: 20, alignSelf: 'flex-start' }}>
            {format(date, 'dd/MM/yy')}
          </Text>
        </View>
      </TouchableHighlight>
    </SwipeableRow>
  );
};
export default ChatRow;
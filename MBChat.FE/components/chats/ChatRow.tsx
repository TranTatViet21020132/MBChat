import SwipeableRow from '@/components/SwipeableRow';
import { COLORS } from '@/constants/Colors';
import { format } from 'date-fns';
import { Link, router, useRouter } from 'expo-router';
import { FC, useCallback } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { Screen } from '@/constants/Screens';
import React from 'react';
import { ChatContext } from '@/context/chatContext';
import { Avatar } from 'react-native-elements';
import { getInitials, getRandomBackgroundColor } from '@/services/utils';
import { defaultImageURL } from '@/services/utils';
import { COLORSHADES } from '@/constants/Colors';
export type ChatRowProps = {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
  type: "communities" | "chats";
  channelTitle: Array<string>;
}

export type AvatarRenderProps = {
  id: string;
  channelTitle: Array<string>;
}

const AvatarRender: FC<AvatarRenderProps> = ({id, channelTitle}) => {

  if (channelTitle.length === 1) {
    return <Avatar 
      size={50}
      rounded
      title={getInitials(channelTitle[0])}
      containerStyle={{ backgroundColor: COLORSHADES[parseInt(id) % 100] }}
    />
  } 
  return <View style={{ width: 50, height: 50, position: 'relative' }}>
    {channelTitle.map((title, idx) => {
      let top = 0;
      let left = 0;
      if (idx === 0) {
        top = 15
        left = 15
      } else if (idx == 1) {
        left = 15
      } else if (idx == 2) {
        top = 15
      }
      return <Avatar
        key={idx}
        size={35}
        rounded
        title={getInitials(title)}
        containerStyle={{
          backgroundColor: COLORSHADES[(idx + parseInt(id)) % 100],
          position: "absolute",
          top: top,
          left: left,
          zIndex: idx + 1
        }}
      />
    })}

  </View>
}

const ChatRow: FC<ChatRowProps> = ({ id, from, date, img, msg, read, unreadCount, type, channelTitle }) => {
  const chatContext = React.useContext(ChatContext);
  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { setChats } = chatContext;
  const chatData = { id, from, date, img, msg, read, unreadCount };

  const handleSingeChatfetch = useCallback(() => {
    router.push(`/(tabs)/${type}/${id}`);
    setChats(chatData);
  }, []);

  const isValidAvatarUrl = img && img !== defaultImageURL;

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
            {isValidAvatarUrl  ? 
            <Image source={{ uri: img }} style={{ width: 50, height: 50, borderRadius: 50 }} />
            :
            <AvatarRender channelTitle={channelTitle} id={id}/>}
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
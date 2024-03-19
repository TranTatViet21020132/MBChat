import SwipeableRow from '@/components/SwipeableRow';
import { COLORS } from '@/constants/Colors';
import { format } from 'date-fns';
import { Link, useRouter } from 'expo-router';
import { FC } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { Screen } from '@/constants/Screens';

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
  const chatData = { id, from, date, img, msg, read, unreadCount };
  const encodedData = encodeURIComponent(JSON.stringify(chatData));

  return (
    <SwipeableRow
      screen={Screen.Chats}
      handleMore={() => console.log('More function called')}
      handleArchive={() => console.log('Archive function called')}
    >
    <Link href={`/(tabs)/chats/${encodedData}`} asChild>
      <TouchableHighlight
      activeOpacity={0.8}
      underlayColor={COLORS.lightGray}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingLeft: 20,
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
      </Link>
    </SwipeableRow>
  );
};
export default ChatRow;
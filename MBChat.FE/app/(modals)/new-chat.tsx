import { View, Text, StyleSheet, Image } from 'react-native';
import { defaultStyles } from "@/constants/Styles";
import Toast from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import FriendApi from '@/api/FriendApi';
import { COLORS } from '@/constants/Colors';

type User = {
  id: number;
  username: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
  fullname: string;
  isFriend?: boolean;
  friend_request_pending?: boolean;
};

const Page = () => {
  const socket: WebSocket | null = useSelector((state: RootState) => state.websocket.socket);

  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const getUserList = async () => {
      const response = (await FriendApi.getUserList()).data.data;
      setUserList(response);
    };
    getUserList();
  }, []);

  const data = userList.map((contact, index) => ({
    ...contact,
    value: contact.fullname,
    key: `${contact.fullname} - ${index}`,
  }));

  const handleSendingRequest = async (user: User) => {
      if (!socket) {
        console.error('WebSocket connection is not available');
        return;
      }

      try {
        const action = user.friend_request_pending ? 'cancel_friend_request' : 'friend_request';
        const friendRq = {
          action,
          target: 'user',
          targetId: user.id,
        };

        socket.send(JSON.stringify(friendRq));

        Toast.show({
          type: 'success',
          text1: user.friend_request_pending ? 
          'Friend request unsent successfully!' : 'Friend request sent successfully!',
          text2: 'Check for notifications in the update tab',
        });

        setUserList((prevUserList) =>
          prevUserList.map((u) => 
            (u.id === user.id ? { ...u, friend_request_pending: !u.friend_request_pending } : u))
        );

        console.log('Request has been sent!');
      } catch (error) {
        console.error('Error sending/canceling friend request:', error);

        Toast.show({
          type: 'error',
          text1: 'Failed to send the friend request',
          text2: 'Maybe try again...',
        });
      }
    };

  return (
    <View style={{ flex: 1, paddingTop: 110, backgroundColor: COLORS.light.background }}>
      <AlphabetList
        data={data}
        stickySectionHeadersEnabled
        indexLetterStyle={{
          color: COLORS.light.primary,
          fontSize: 12,
        }}
        indexContainerStyle={{
          width: 24,
          backgroundColor: COLORS.light.background,
        }}
        renderCustomItem={(item: any) => (
          <>
            <View style={styles.listItemContainer}>
              <View style={styles.leftItem}>
                <Image source={{ uri: item.avatar_url }} style={styles.listItemImage} />
                <View>
                  <Text style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{item.fullname}</Text>
                </View>
              </View>
              {!item.isFriend ? (
                <AntDesign
                  name={item.friend_request_pending ? 'deleteuser' : 'adduser'}
                  size={22}
                  onPress={() => handleSendingRequest(item)}
                />
              ) : null}
            </View>
            <View style={[defaultStyles.separator, { marginLeft: 50 }]} />
          </>
        )}
        renderCustomSectionHeader={(section) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={{ color: COLORS.gray }}>{section.title}</Text>
          </View>
        )}
        style={{
          marginLeft: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingLeft: 14,
    paddingRight: 32,
    backgroundColor: '#fff',
  },

  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  sectionHeaderContainer: {
    height: 30,
    backgroundColor: COLORS.light.background,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});

export default Page;

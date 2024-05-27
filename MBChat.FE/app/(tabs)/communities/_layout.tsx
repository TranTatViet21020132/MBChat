import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import { Pressable, View, Image, Text } from 'react-native';
import { ChatContext } from '@/context/chatContext';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ChatsLayout = () => {
  const router = useRouter();
  const socket = useSelector((state: RootState) => state.websocket.socket);
  const userInformation = useSelector((state: RootState) => state.user);
  const chatContext = React.useContext(ChatContext);

  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { chats } = chatContext;
  // if (userContext?.userInfomation.gettingCall) {
  //  router.push("/(tabs)/calls")
  // }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Communities',
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerBlurEffect: 'regular',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              {/* <Pressable>
                <Ionicons name="camera-outline" color={COLORS.light.primary} size={30} />
              </Pressable> */}
              <Link href={"/(modals)/new-chat"} asChild>
                <Pressable>
                  <Ionicons name="add-circle" color={COLORS.light.primary} size={30} />
                </Pressable>
              </Link>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitle: () => (
            <Link href={"/chats/profile"} asChild>
              <Pressable>
                <View
                  style={{
                    flexDirection: 'row',
                    width: 220,
                    alignItems: 'center',
                    gap: 10,
                    paddingBottom: 4,
                  }}>
                  <Image
                    source={{
                      uri: chats.img,
                    }}
                    style={{ width: 40, height: 40, borderRadius: 50 }}
                  />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>{chats.from}</Text>
                </View>
              </Pressable>
            </Link>
          ),

          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <Pressable>
                <Ionicons onPress={() => {
                    if (socket) {
                      const formData = {
                        action: "video_call",
                        target: "channel",
                        targetId: chatContext.chats.id,
                        data: {
                          from_user: userInformation.id,
                          from_channel: chatContext.chats.id
                        }
                      }
                      socket.send(JSON.stringify(formData));
                      router.push("/(tabs)/calls")
                    }
                }}name="videocam-outline" color={COLORS.light.primary} size={28} />
              </Pressable>
              <Pressable>
                <Ionicons 
                  onPress={() => {
                  }}
                name="call-outline" color={COLORS.light.primary} size={28} />
              </Pressable>
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.light.background,
          },
        }}
      />
      
    </Stack>
  );
};
export default ChatsLayout;
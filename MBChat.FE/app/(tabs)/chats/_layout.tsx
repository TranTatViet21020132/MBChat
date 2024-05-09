import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import { Pressable, View, Image, Text } from 'react-native';
import { ChatContext } from '@/context/chatContext';
import React from 'react';
import { UserContext } from '@/context/userContext';
import { WebsocketContext } from '@/context/WebsocketContext';

const ChatsLayout = () => {
  const router = useRouter();

  const chatContext = React.useContext(ChatContext);
  const websocketContext = React.useContext(WebsocketContext);
  const userContext = React.useContext(UserContext);
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
          title: 'Chats',
          headerLargeTitle: true,
          headerTransparent: true,
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
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                color={COLORS.light.primary}
                size={30}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <Pressable>
                <Ionicons onPress={() => {
                    if (websocketContext?.websocket) {
                      const formData = {
                        action: "video_call",
                        target: "channel",
                        targetId: chatContext.chats.id,
                        data: {
                          from_user: userContext?.userInfomation.id,
                          from_channel: chatContext.chats.id
                        }
                      }
                      websocketContext.websocket.send(JSON.stringify(formData));
                      
                    }
                }}name="videocam-outline" color={COLORS.light.primary} size={28} />
              </Pressable>
              <Pressable>
                <Ionicons name="call-outline" color={COLORS.light.primary} size={28} />
              </Pressable>
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.light.background,
          },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};
export default ChatsLayout;
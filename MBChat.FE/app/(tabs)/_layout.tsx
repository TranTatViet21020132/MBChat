import React from 'react';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useSegments } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/components/useColorScheme';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { usePushNotifications } from '@/services/notifications/usePushNotifications';

function waitForSocketConnection(websocket: WebSocket) {
  setTimeout(function () {
      if (websocket) {
          if (websocket.readyState === 1) {
              const formData = {
                  action: "get_profile"
              };
              const formSubmit = JSON.stringify(formData);
              websocket.send(formSubmit);
              websocket.send(JSON.stringify({
                action: "get_chat_list"
              }))
              websocket.send(JSON.stringify({
                action: "get_community_list"
              }))
              
          } else {
              waitForSocketConnection(websocket);
          }
      }
  }, 5);
}

const TabsLayout = () => {
  const socket = useSelector((state: RootState) => state.websocket.socket);
  const userInfomation = useSelector((state: RootState) => state.user);
  const {expoPushToken, notification} = usePushNotifications();
  const expoData = JSON.stringify(notification, undefined, 2);

  React.useEffect(() => {
    if (!userInfomation.verified && socket) {
      waitForSocketConnection(socket);
    }
  }, [socket])

  const { t } = useTranslation();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={colorScheme === 'light' ? 
        {
          tabBarStyle: { backgroundColor: COLORS.light.background },
          tabBarActiveTintColor: COLORS.light.primary,
          tabBarInactiveBackgroundColor: COLORS.light.background,
          tabBarActiveBackgroundColor: COLORS.light.background,
          headerStyle: {
            backgroundColor: COLORS.light.background,
          },
          headerShadowVisible: false,
        } : {
          tabBarStyle: { backgroundColor: COLORS.dark.background },
          tabBarActiveTintColor: COLORS.dark.primary,
          tabBarInactiveBackgroundColor: COLORS.dark.background,
          tabBarActiveBackgroundColor: COLORS.dark.background,
          headerStyle: {
            backgroundColor: COLORS.dark.background,
          },
          headerShadowVisible: false,
        }
        }>
        <Tabs.Screen
          name="updates"
          options={{
            title: t("tab.content.update"),
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="update" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="calls"
          options={{
            title: t("tab.content.calls"),
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons name="phone-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: t("tab.content.communities"),
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="people" size={size} color={color} />
            ),
            tabBarStyle: {
              backgroundColor: COLORS.light.background,
              display: segments[2] === '[id]' ? 'none' : 'flex'
            },
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: t("tab.content.chats"),
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="chatbubbles" size={size} color={color} />
            ),
            tabBarStyle: {
              backgroundColor: COLORS.light.background,
              display: segments[2] === '[id]' ? 'none' : 'flex',
            },
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: t("tab.content.settings"),
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="cog" size={size} color={color} />
            ),
            headerShown: false
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};
export default TabsLayout;
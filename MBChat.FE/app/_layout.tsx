import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { Fragment, useCallback, useEffect } from "react";
import {ChatProvider} from "@/context/chatContext";
import WebsocketProvider from "@/context/WebsocketContext";
import UserProvider from "@/context/userContext";
import { I18nextProvider } from "react-i18next";
import i18n from "@/services/i18n.config";
import { useTranslation } from "react-i18next";

import { useColorScheme } from "@/components/useColorScheme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { COLORS } from "@/constants/Colors";
import ChatListProvider from "@/context/chatListContext";
import CallProvider from "@/context/CallContext";
import { AppRegistry } from "react-native";
import { usePushNotifications } from '@/services/notifications/usePushNotifications';
import * as SecureStore from 'expo-secure-store';
export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const {expoPushToken, notification} = usePushNotifications();
    const data = JSON.stringify(notification, undefined, 2);
    

    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const router = useRouter();
    
    return (
        <ChatProvider>
            <ChatListProvider>
                <UserProvider>
                    <CallProvider>
                    <WebsocketProvider>
                      <I18nextProvider i18n={i18n}>
                        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                          <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="otp" 
                              options={{ 
                                headerTitle: t("otp.content.title"), 
                                headerBackVisible: false,
                                headerShadowVisible: false,
                                headerStyle: {
                                  backgroundColor: COLORS.light.background,
                                },
                              }}
                            />
                            <Stack.Screen name="verify/signup" 
                              options={{ 
                                headerTitle: 'Sign up', 
                                headerShown: false
                              }}
                            />
                            <Stack.Screen name="verify/login" 
                              options={{ 
                                headerTitle: 'Login', 
                                headerShown: false
                              }}
                            />
                            <Stack.Screen name="verify/[phone]" 
                              options={{
                                headerBackTitle: 'Edit number',
                                headerShadowVisible: false,
                                headerStyle: {
                                  backgroundColor: COLORS.light.background,
                                },
                              }}
                            />
                            <Stack.Screen name="(tabs)"
                              options={{ headerShown: false }}
                            />
                            <Stack.Screen
                              name="(modals)/new-chat"
                              options={{
                                presentation: 'modal',
                                title: 'New Chat',
                                headerTransparent: true,
                                headerBlurEffect: 'regular',
                                headerStyle: {
                                  backgroundColor: COLORS.light.background,
                                },
                                headerRight: () => (
                                  <Pressable
                                    style={{ backgroundColor: COLORS.lightGray, borderRadius: 20, padding: 4 }}
                                    onPress={() => router.back()}>
                                    <Ionicons name="close" color={COLORS.gray} size={30} />
                                  </Pressable>
                                ),
                                headerSearchBarOptions: {
                                  placeholder: 'Search name or number',
                                  hideWhenScrolling: false,
                                },
                              }}
                            />
                          </Stack>
                          <Toast />
                        </ThemeProvider>
                      </I18nextProvider>
                    </WebsocketProvider>
                    </CallProvider>
                </UserProvider>
            </ChatListProvider>
        </ChatProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
})
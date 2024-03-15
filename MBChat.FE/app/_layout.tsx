import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';

import {I18nextProvider} from "react-i18next";
import i18n from "@/services/i18n.config";
import { useTranslation } from 'react-i18next';

import { useColorScheme } from '@/components/useColorScheme';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/Colors'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="otp" 
            options={{ 
              headerTitle: t("otp.content.title"), 
              headerBackVisible: false
            }}
          />
          <Stack.Screen name="verify/[phone]" 
            options={{ headerBackTitle: 'Edit number' }}
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
                  onPress={handleBack}
                  >
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
      </ThemeProvider>
    </I18nextProvider>
  );
}

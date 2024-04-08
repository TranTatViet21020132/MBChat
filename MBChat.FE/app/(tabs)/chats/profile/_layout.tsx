import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

const Layout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitle: "Contact Information", 
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                color={COLORS.light.primary}
                size={30}
              />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: COLORS.light.background,
          },
        }}
      />
      <Stack.Screen
        name="(tabs)/documents"
        options={{
          title: '',
          headerBackTitleVisible: false, 
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                color={COLORS.light.primary}
                size={30}
              />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: COLORS.light.background,
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
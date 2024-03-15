import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

const Layout = () => {
  const router = useRouter();

  const handleOpenModal = () => {
    router.push("/(modals)/new-chat");
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Chats',
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: 'regular',
          headerLeft: () => (
            <Pressable>
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                color={COLORS.light.primary}
                size={30}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <Pressable>
                <Ionicons name="camera-outline" color={COLORS.light.primary} size={30} />
              </Pressable>
              <Pressable onPress={handleOpenModal}>
                <Ionicons name="add-circle" color={COLORS.light.primary} size={30} />
              </Pressable>
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
    </Stack>
  );
};
export default Layout;
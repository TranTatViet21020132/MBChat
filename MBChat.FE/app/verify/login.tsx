import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { View, Text, TextInput } from '@/components/Themed'
import { COLORS, SIZES } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import UserApi from '@/api/UserApi'
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message'
import { BASE_DOMAIN } from '@/constants/ApiUrl';
import { usePushNotifications } from '@/services/notifications/usePushNotifications';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { connectWebsocket } from '@/store/websocket/websocketSlice'
const login = () => {
  const {expoPushToken, notification} = usePushNotifications();
  const expoData = JSON.stringify(notification, undefined, 2);
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }
  const dispatch = useDispatch<AppDispatch>();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  const handleLogin = async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      await SecureStore.deleteItemAsync('accessToken');
    }
    const response = await UserApi.signin({
      "username": username,
      "password": password
    })
    if (response.status === 200) {
      const data = response.data.data;
      const accessToken = data["access"];
      await SecureStore.setItemAsync('accessToken', accessToken);
      dispatch(connectWebsocket());
      router.replace('/(tabs)/chats');

    } else {
      Toast.show({
        "type": "error",
        "text1": "Login message",
        "text2": response.data.message
      })
    }
  }

  useEffect(() => {
    const accessToken = SecureStore.getItem('accessToken');
    if (accessToken) {
      dispatch(connectWebsocket());
      router.replace('/(tabs)/chats');
    }
  }, [])

 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.textHeader}
          lightColor={COLORS.light.text}
          darkColor={COLORS.light.text}
        >
          Log in to continue
        </Text>
        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            value={username}
            onChangeText={(text: string) => {
              setUsername(text)
            }}
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'Username or email'}
            placeholderTextColor={'grey'}
          />
        </View>

        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            value={password}
            onChangeText={(text: string) => {
              setPassword(text)
            }}
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'Password'}
            placeholderTextColor={'grey'}
            secureTextEntry={!showPassword}
          />

          <Ionicons
            name={!showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#aaa"
            onPress={toggleShowPassword}
          />
        </View>

        <View style={styles.containerforgotPassword}
          lightColor={COLORS.transparent}
          darkColor={COLORS.transparent}
        >
          <Text style={{color: COLORS.light.primary}}>
            Forgot password?
          </Text>
        </View>

        <View style={styles.containerButton}
          lightColor={COLORS.transparent}
          darkColor={COLORS.transparent}
        >
          <Pressable style={styles.buttonSubmit} 
            onPress={handleLogin}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff'
            }}>
              Log in
            </Text>
          </Pressable>
        </View>

        <View style={styles.containerBoundary}
          lightColor={COLORS.transparent}
          darkColor={COLORS.transparent}
        >
          <View style={{ height: 1, backgroundColor: '#aaa', width: '30%' }}></View>
          <Text style={{ color: '#aaa' }}>Or</Text>
          <View style={{ height: 1, backgroundColor: '#aaa', width: '30%' }}></View>
        </View>

        <View style={styles.bottom}
          lightColor={COLORS.transparent}
          darkColor={COLORS.transparent}
        >
          <Text style={{ color: '#aaa' }}>
            Don't have an account?
          </Text>
          <Link href={'/verify/signup'} style={{ paddingLeft: 10 }}>
            <Text
              style={{color: COLORS.light.primary}}
            >
              Sign up
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
  },
  textHeader: {
    fontSize: SIZES.xLarge,
    fontWeight: '600'
  },
  input: {
    flexDirection: 'row',
    marginTop: 30,
    padding: 5,
    borderRadius: 10
  },
  inputText: {
    fontSize: 16,
    marginLeft: 10,
    padding: 5,
    flex: 1,
  },
  containerforgotPassword: {
    marginTop: 20,
    paddingLeft: 10,
  },
  containerButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonSubmit: {
    width: '60%',
    marginTop: 20,
    backgroundColor: COLORS.light.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 16,
  },
  containerBoundary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20
  },
  bottom: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center'
  }
})

export default login
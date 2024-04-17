import React from 'react'
import {ScrollView, KeyboardAvoidingView, StyleSheet, Pressable, Platform, Keyboard } from 'react-native'
import { View, Text, TextInput } from '@/components/Themed'
import { COLORS, SIZES } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'

const signup = () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const [data, setData] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
  })

  const [loading, setLoading] = React.useState(false);

  const sendOTP = React.useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/verify/${data.email}`);
    }, 1);
  }, [data.email, router]);

  const handleChangeInput = () => {

  }

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
          Create a new account
        </Text>
        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'First name'}
            placeholderTextColor={'grey'}
          />
        </View>

        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'Last name'}
            placeholderTextColor={'grey'}
          />
        </View>

        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'Username'}
            placeholderTextColor={'grey'}
          />
        </View>

        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'Email'}
            placeholderTextColor={'grey'}
            value={data.email}
            onChangeText={text => setData({...data, email: text})}
          />
        </View>

        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
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

        <View
          style={styles.input}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <TextInput
            style={styles.inputText}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
            placeholder={'Confirm password'}
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

        <View style={styles.containerButton}
          lightColor={COLORS.transparent}
          darkColor={COLORS.transparent}
        >
          <Pressable style={styles.buttonSubmit}
            onPress={sendOTP}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff'
            }}>
              Sign up
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
            Already have an account?
          </Text>
          <Link href={'/verify/login'} style={{ paddingLeft: 10 }}>
            <Text style={{color: COLORS.light.primary}}>
              Login
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
    padding: 20
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
    justifyContent: 'center',
    marginBottom: 40
  }
})

export default signup
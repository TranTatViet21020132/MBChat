import { 
    StyleSheet, 
    Image, 
    KeyboardAvoidingView,
    Platform,
    Linking
  } from 'react-native';
import { Text, View } from '@/components/Themed';

import React, { useState } from 'react';
import { useRouter } from 'expo-router';

import COLORS from '@/constants/Colors';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const router = useRouter();

  const keyoardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

  const openLink = () => {
    Linking.openURL("https://galaxies.dev");
  };

  const sendOTP = async () => {

  };

  const trySignIn = async () => {

  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View 
      style={styles.container}
      lightColor={COLORS.light.background}
      darkColor={COLORS.dark.background}
      >
        <Text 
        style={styles.description}
        lightColor={COLORS.light.text}
        darkColor={COLORS.dark.text}
        >
          MBChat will need to verify your account. Carrier charges may apply.
        </Text>

        <View
        style={styles.list}
        lightColor={COLORS.light.list}
        darkColor={COLORS.dark.list}
        >
          <View style={styles.listItem}>

          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },

  description: {
    fontSize: 14,
  },

  list: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    marginBottom: 10,
  },
})

export default Page;
import { 
    StyleSheet, 
    Image, 
    KeyboardAvoidingView,
    Platform,
    Linking,
    Pressable
  } from 'react-native';
import { Text, View } from '@/components/Themed';

import React, { useState } from 'react';
import { useRouter } from 'expo-router';

import COLORS from '@/constants/Colors';

import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { t } = useTranslation();
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
      lightColor={COLORS.light.otp.background}
      darkColor={COLORS.dark.otp.background}
      >
        <Text 
        style={styles.description}
        lightColor={COLORS.light.otp.description}
        darkColor={COLORS.dark.otp.description}
        >
          {t("otp.content.verify")}
        </Text>

        <View
        style={styles.list}
        lightColor={COLORS.light.otp.list}
        darkColor={COLORS.dark.otp.list}
        >
          <View style={styles.listItem}>
            <Text
            style={styles.listItemText}
            lightColor={COLORS.light.otp.listItemText}
            darkColor={COLORS.dark.otp.listItemText}
            >
              {t("otp.content.country")}
            </Text>
            <Ionicons 
            name="chevron-forward" size={20}
            color={COLORS.light.gray}/>
          </View>
          <View
          style={styles.separator}
          lightColor={COLORS.light.otp.separator}
          darkColor={COLORS.dark.otp.separator}
          >

          </View>
        </View>
        <Text style={styles.legal}>
          You must be{' '}
          <Text
          lightColor={COLORS.light.otp.link}
          darkColor={COLORS.dark.otp.link}
          onPress={openLink}>
            at least 16 years old
          </Text>{' '}
          to register. Learn how WhatsApp works with the{' '}
          <Text
          lightColor={COLORS.light.otp.link}
          darkColor={COLORS.dark.otp.link}
          onPress={openLink}>
            Meta Companies
          </Text>
          .
        </Text>

        <Pressable onPress={sendOTP}>
          <Text>Next</Text>
        </Pressable>
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

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    marginBottom: 10,
  },

  listItemText: {
    fontSize: 18,
  },

  separator: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },

  legal: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
  },

  list: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },

  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.light.lightGray,
    padding: 10,
    borderRadius: 10,
  },

  enabled: {
    backgroundColor: COLORS.light.primary,
    color: '#fff',
  },

  buttonText: {
    color: COLORS.light.gray,
    fontSize: 22,
    fontWeight: '500',
  }
})

export default Page;
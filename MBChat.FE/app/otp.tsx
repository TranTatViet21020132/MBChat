import { 
    StyleSheet, 
    KeyboardAvoidingView,
    Platform,
    Linking,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
  } from 'react-native';
import { Text, View } from '@/components/Themed';
import { COLORS } from '@/constants/Colors';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/components/useColorScheme';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskInput from 'react-native-mask-input';

const OTPPage = () => {
  const VIE_PHONE = [
    /\d/, 
    /\d/, 
    ' ', 
    /\d/, 
    /\d/, 
    /\d/, 
    ' ', 
    /\d/, 
    /\d/, 
    ' ', 
    /\d/, 
    /\d/, 
    /\d/, 
    /\d/
  ];

  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
  const { bottom } = useSafeAreaInsets();

  const openLink = () => {
    Linking.openURL("");
  };

  const sendOTP = useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/verify/${phoneNumber}`);
    }, 1000);
  }, [phoneNumber, router]);

  const trySignIn = useCallback(async () => {

  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
      style={styles.container}
      lightColor={COLORS.light.otp.background}
      darkColor={COLORS.dark.otp.background}
      >
        {loading && (
          <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size='large' color={COLORS.light.primary} />
          <Text 
          style={{ fontSize: 18, 
          padding: 10, 
          marginTop: 10, 
          fontWeight: '500' }}>
            {t("otp.content.sendingCode")}
          </Text>
          </View>
        )}
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
          <View
          style={styles.listItem}
          lightColor={COLORS.light.otp.listItem}
          darkColor={COLORS.dark.otp.listItem}
          >
            <Text
            style={styles.listItemText}
            lightColor={COLORS.light.otp.listItemText}
            darkColor={COLORS.dark.otp.listItemText}
            >
              {t("otp.content.country")}
            </Text>
            <Ionicons 
            name="chevron-forward" size={20}
            color={COLORS.gray}/>
          </View>
          <View
          style={styles.separator}
          lightColor={COLORS.light.otp.separator}
          darkColor={COLORS.dark.otp.separator}
          />
          <View
          style={styles.listItemPhone}
          lightColor={COLORS.light.otp.listItem}
          darkColor={COLORS.dark.otp.listItem}
          >
            <View
            style={styles.phoneCode}
            lightColor={COLORS.light.otp.phoneCode}
            darkColor={COLORS.dark.otp.phoneCode}
            >
              <Text
              style={styles.phoneCodeText}
              lightColor={COLORS.light.otp.phoneCodeText}
              darkColor={COLORS.dark.otp.phoneCodeText}
              >
                +84{'  '}
              </Text>
            </View>
            <MaskInput
            value={phoneNumber}
            keyboardType='numeric'
            style={styles.input}
            placeholder='Enter your phone number'
            onChangeText={(masked, unmasked) => {
              setPhoneNumber(masked);
            }}
            mask={VIE_PHONE}
            />
          </View>
        </View>
        <Text
        style={styles.legal}
        lightColor={COLORS.light.otp.legal}
        darkColor={COLORS.dark.otp.legal}
        >
          {t("otp.content.youMust")}
          <Text
          lightColor={COLORS.light.link}
          darkColor={COLORS.dark.link}
          onPress={openLink}>
            {t("otp.content.atLeast")}
          </Text>{' '}
          {t("otp.content.learnHow")}
          <Text
          lightColor={COLORS.light.link}
          darkColor={COLORS.dark.link}
          onPress={openLink}>
            {t("otp.content.metaCompanies")}
          </Text>
          .
        </Text>

        <View style={{ flex: 1 }} />

        <Pressable
        onPress={sendOTP}
        disabled={phoneNumber === ''}
        style={[styles.button, 
          phoneNumber !== '' ? styles.enabled : null, 
          { marginBottom: bottom }]}
        >
          <Text
          style={[styles.buttonText, 
            phoneNumber !== '' ? styles.enabled : null]}
          >{t("otp.action.next")}</Text>
        </Pressable>
      </View>
      </TouchableWithoutFeedback>
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
    fontSize: 12,
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    marginBottom: 10,
  },

  listItemPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },

  phoneCode: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  phoneCodeText: {
    fontSize: 16,
  },

  listItemText: {
    fontSize: 18,
  },

  separator: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    opacity: 0.4,
  },

  legal: {
    fontSize: 12,
    textAlign: 'center',
  },

  list: {
    width: '100%',
    borderRadius: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 4,
  },

  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.light.otp.button,
    padding: 10,
    borderRadius: 10,
  },

  enabled: {
    backgroundColor: COLORS.light.primary,
    color: '#fff',
  },

  buttonText: {
    color: COLORS.light.text,
    fontSize: 22,
    fontWeight: '500',
  },

  input: {
    fontSize: 16,
    width: '90%',
    paddingTop: 10,
    paddingBottom: 10,
  },

  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: COLORS.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default OTPPage;
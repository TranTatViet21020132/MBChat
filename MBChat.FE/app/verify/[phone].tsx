import { 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { COLORS } from '@/constants/Colors';

import React, { useState, useEffect, useCallback } from 'react';

import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const CELL_COUNT = 6;

const VerifyPage = () => {
  const { t } = useTranslation();

  const { phone, signin } = useLocalSearchParams<{ phone: string; signin: string }>();
  const [code, setCode] = useState('');

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      console.log('verify', code);
      router.replace('/verify/login');
    }
      //TO-DO: implement verify logics
      // if (signin === 'true') {
      //   console.log('signin');
      //   veryifySignIn();
      // } else {
      //   verifyCode();
      // }
  }, [code]);

  const verifyCode = useCallback(async () => {

  }, []);

  const veryifySignIn = useCallback(async () => {

  }, []);

  const resendCode = useCallback(async () => {

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
          <Stack.Screen options={{ title: phone }} />
          <Text
          style={styles.legal}
          lightColor={COLORS.light.verify.legal}
          darkColor={COLORS.dark.verify.legal}
          >{t("verify.content.codeSent")}</Text>
          <Text
          style={styles.legal}
          lightColor={COLORS.light.verify.legal}
          darkColor={COLORS.dark.verify.legal}
          >
            {t("verify.content.codeEnter")}
          </Text>

          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={setCode}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}>
                <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
              </View>
            )}
          />

          <Pressable style={styles.button} onPress={resendCode}>
            <Text
            style={styles.buttonText}
            lightColor={COLORS.light.link}
            darkColor={COLORS.dark.link}
            >
              {t("verify.action.resendCode")}
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },

  legal: {
    fontSize: 14,
    textAlign: 'center',
  },

  button: {
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    marginTop: 4,
    fontSize: 16,
  },

  codeFieldRoot: {
    marginTop: 20,
    width: 260,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 4.5,
  },

  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
  },

  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },

  focusCell: {
    paddingBottom: 4,
    borderBottomColor: '#000',
    borderBottomWidth: 2,
  },
});

export default VerifyPage;
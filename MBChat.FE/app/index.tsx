import { 
  StyleSheet, 
  Image,
  Pressable,
  Linking,
} from 'react-native';
import { 
  Text, 
  View,
} from '@/components/Themed';
import React from 'react';
import { Link } from 'expo-router';
import COLORS from '@/constants/Colors';

import { useTranslation } from 'react-i18next';

import welcomeImage from '@/assets/images/welcome.png';

const Page = () => {
  const { t } = useTranslation();

  const openLink = () => {
    Linking.openURL("https://galaxies.dev");
  };

  return (
    <View 
    style={styles.container}
    lightColor={COLORS.light.background}
    darkColor={COLORS.dark.background}
    >
      <Image source={welcomeImage} style={styles.welcome} />
      <Text 
      style={styles.headline}
      lightColor={COLORS.light.text}
      darkColor={COLORS.dark.text}
      >{t("welcomeMessage")}</Text>
      <Text 
      style={styles.description}
      lightColor={COLORS.light.description}
      darkColor={COLORS.dark.description}
      >
        Read our{' '}
        <Text
        lightColor={COLORS.light.link}
        darkColor={COLORS.dark.link}
        onPress={openLink}>
          Privacy Policy
        </Text>
        . Tap 'Agree & Continue' to accept the{' '}
        <Text
        lightColor={COLORS.light.link}
        darkColor={COLORS.dark.link}
        onPress={openLink}>
          Terms of Service
        </Text>
        .
      </Text>
      <Link href={"/otp"} replace asChild>
        <Pressable style={styles.button}>
          <Text
          style={styles.buttonText}
          lightColor={COLORS.light.link}
          darkColor={COLORS.dark.link}
          >
            Agree & Continue
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    width: '100%',
    height: 300,
    marginBottom: 80,
  },

  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 80,
  },

  button: {
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Page;



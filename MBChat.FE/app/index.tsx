import { 
  StyleSheet, 
  Image,
  Pressable,
  Linking,
  useColorScheme
} from 'react-native';
import { 
  Text, 
  View,
} from '@/components/Themed';
import React from 'react';
import { Link } from 'expo-router';
import { COLORS } from '@/constants/Colors';

import { useTranslation } from 'react-i18next';

import welcomeImage from '@/assets/images/welcome.png';
import welcomeImageDark from '@/assets/images/welcomeDark.png';

const IndexPage = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const openLink = () => {
    Linking.openURL("");
  };

  const selectedWelcomeImage = colorScheme === 'dark' ? welcomeImageDark : welcomeImage;



  return (
    <View 
    style={styles.container}
    lightColor={COLORS.light.welcome.background}
    darkColor={COLORS.dark.welcome.background}
    >
      <Image source={selectedWelcomeImage} style={styles.welcome} />
      <Text 
      style={styles.headline}
      lightColor={COLORS.light.welcome.headline}
      darkColor={COLORS.dark.welcome.headline}
      >{t("welcome.content.welcomeMessage")}</Text>
      <Text 
      style={styles.description}
      lightColor={COLORS.light.welcome.description}
      darkColor={COLORS.dark.welcome.description}
      >
        {t("welcome.content.readOur")}
        <Text
        lightColor={COLORS.light.link}
        darkColor={COLORS.dark.link}
        onPress={openLink}>
          {t("welcome.content.privacyPolicy")}
        </Text>
        {t("welcome.content.agreeAndContinue")}
        <Text
        lightColor={COLORS.light.link}
        darkColor={COLORS.dark.link}
        onPress={openLink}>
          {t("welcome.content.termsOfService")}
        </Text>
        .
      </Text>
      <Link href={"/verify/signup"} replace asChild>
        <Pressable style={styles.button}>
          <Text
          style={styles.buttonText}
          lightColor={COLORS.light.welcome.buttonText}
          darkColor={COLORS.dark.welcome.buttonText}
          >
            {t("welcome.action.agreeAndContinue")}
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

export default IndexPage;

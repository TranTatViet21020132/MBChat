import { 
  StyleSheet, 
  Image,
  Pressable
} from 'react-native';
import { 
  Text, 
  View,
} from '@/components/Themed';
import { ExternalLink } from '@/components/ExternalLink';
import React from 'react';
import COLORS from '@/constants/Colors';

import i18n from "@/utils/i18n";
import welcomeImage from '@/assets/images/welcome.png';
const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const Page = () => {
  const openLink = () => {

  };

  return (
    <View 
    style={styles.container}
    lightColor={COLORS.light.background}
    darkColor={COLORS.dark.background}
    >
      <Image source={{ uri: welcome_image }} style={styles.welcome} />
      <Text 
      style={styles.headline}
      lightColor={COLORS.light.text}
      darkColor={COLORS.dark.text}
      >{i18n.t("welcome.content.title")}</Text>
      <Text 
      style={styles.description}
      lightColor={COLORS.light.description}
      darkColor={COLORS.dark.description}
      >
        {i18n.t("welcome.content.readOur")}{' '}
        <Text
        lightColor={COLORS.light.link}
        darkColor={COLORS.dark.link}
        onPress={openLink}>
          {i18n.t("welcome.content.privacyPolicy")}
        </Text>
        . {i18n.t("welcome.content.agreeAndContinue")}
        <Text
        lightColor={COLORS.light.link}
        darkColor={COLORS.dark.link}
        onPress={openLink}>
          {i18n.t("welcome.content.termsOfService")}
        </Text>
        .
      </Text>
      <ExternalLink href={"/otp"} replace asChild>
        <Pressable style={styles.button}>
          <Text
          style={styles.buttonText}
          lightColor={COLORS.light.link}
          darkColor={COLORS.dark.link}
          >
            {i18n.t("welcome.action.agreeAndContinue")}
          </Text>
        </Pressable>
      </ExternalLink>
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



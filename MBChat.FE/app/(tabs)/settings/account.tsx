import {
  StyleSheet,
  Image,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Text, View, ScrollView, TextInput } from '@/components/Themed';
import { useState }from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useTranslation } from 'react-i18next'
import { COLORS } from '@/constants/Colors'
import {useChat} from '@/context/chatContext';
import { useColorScheme } from '@/components/useColorScheme';

const Account = () => {
  const { t } = useTranslation();

  const [file, setFile] = useState('');

  // Stores any error message 
  const [error, setError] = useState(null);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  const pickImage = async () => {
    const { status } = await ImagePicker.
      requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {

      // If permission is denied, show an alert 
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera  
             roll permission to upload images.`
      );
    } else {

      // Launch the image library and get 
      // the selected image 
      const result =
        await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {

        // If an image is selected (not cancelled),  
        // update the file state variable 
        setFile(result.assets[0].uri);

        // Clear any previous errors 
        setError(null);
      }
    }
  };

  const colorScheme = useColorScheme();

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={keyboardVerticalOffset}
      >
      <ScrollView style={styles.container}>
        <View style={styles.editAvatar}
          lightColor={"transparent"}
          darkColor={"transparent"}
        >
          <Pressable onPress={pickImage}>
            {
              file ? (
                <Image
                  source={{ uri: file }}
                  style={styles.imageAvatarLight}
                />
              ) : (
                <Image
                  source={require('@/assets/images/user-image.jpg')}
                  style={colorScheme === 'light' ? styles.imageAvatarLight : styles.imageAvatarDark}
                />
              )
            }
          </Pressable>
          <Pressable onPress={pickImage}>
            <Text style={{
              color: COLORS.light.primary,
              fontSize: 16
            }}
              lightColor={COLORS.light.verify.legal}
              darkColor={COLORS.dark.verify.legal}
            >
              {t('settings.account.setNewPhoto')}
            </Text>
          </Pressable>
        </View>
        <EditName />
        <Text style={{ color: 'grey', textAlign: 'center', marginBottom: 32 }}>
          {t('settings.account.editname')}
        </Text>
        <View style={styles.editName}>
          <View style={colorScheme === 'light' ? styles.itemsEditNameLight : styles.itemsEditNameDark}
            lightColor={COLORS.light.settings.backgroundInput}
            darkColor={COLORS.dark.settings.backgroundInput}
          >
            <TextInput
              style={styles.inputText}
              lightColor={COLORS.light.settings.text}
              darkColor={COLORS.dark.settings.text}
              placeholder={t('settings.account.bio')}
              placeholderTextColor={'grey'}
            />
          </View>
        </View>
        <Text style={{ color: 'grey', textAlign: 'center', marginBottom: 32 }}>
          {t('settings.account.desBio')}
        </Text>
        <EditPhoneNumer />
        <Pressable style={styles.buttonSubmit}>
          <Text 
            style={{
              color: '#fff'
            }}
          >
            Done
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const EditName = () => {
  const { t } = useTranslation();

  const colorScheme = useColorScheme();

  return (
    <View style={styles.editName}
    lightColor={COLORS.light.settings.backgroundInput}
    darkColor={COLORS.dark.settings.backgroundInput}
    >
      <View style={colorScheme === 'light' ? styles.itemsEditNameLight : styles.itemsEditNameDark}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <TextInput
          style={styles.inputText}
          lightColor={COLORS.light.settings.text}
          darkColor={COLORS.dark.settings.text}
          placeholder={t('settings.account.firstName')}
          placeholderTextColor={'grey'}
        />
      </View>
      <View style={colorScheme === 'light' ? styles.itemsEditNameLight : styles.itemsEditNameDark}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <TextInput
          style={styles.inputText}
          lightColor={COLORS.light.settings.text}
          darkColor={COLORS.dark.settings.text}
          placeholder={t('settings.account.lastName')}
          placeholderTextColor={'grey'}
        />
      </View>
    </View>
  )
}

const EditPhoneNumer = () => {
  const { t } = useTranslation();
const colorScheme = useColorScheme();
  return (
    <View style={styles.editName}>
      <View style={colorScheme === 'light' ? styles.itemsEditNameLight : styles.itemsEditNameDark}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <TextInput
          style={styles.inputText}
          lightColor={COLORS.light.settings.text}
          darkColor={COLORS.dark.settings.text}
          placeholder={t('settings.account.phoneNumber')}
          placeholderTextColor={'grey'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  editAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  imageAvatarLight: {
    backgroundColor: '#d7e2f4',
    height: 100,
    width: 100,
    borderRadius: 9999,
    marginBottom: 10
  },
  imageAvatarDark: {
    backgroundColor: '#1C1C1E',
    height: 100,
    width: 100,
    borderRadius: 9999,
    marginBottom: 10
  },
  editName: {
    borderRadius: 10,
    marginBottom: 5
  },
  itemsEditNameLight: {
    padding: 5,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor
  },
  itemsEditNameDark: {
    padding: 5,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.settings.backgroudColor
  },
  inputText: {
    fontSize: 16,
    marginLeft: 10,
    padding: 5,
  },
  buttonSubmit: {
    marginTop: 20,
    backgroundColor: COLORS.light.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 16,
  }
})

export default Account
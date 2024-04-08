import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useTranslation } from 'react-i18next'
import { COLORS } from '@/constants/Colors'

const Account = () => {
  const { t } = useTranslation();

  const [file, setFile] = useState('');

  // Stores any error message 
  const [error, setError] = useState(null);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editAvatar}>
        <Pressable onPress={pickImage}>
          {
            file ? (
              <Image
                source={{uri: file}}
                style={styles.imageAvatar}
              />
            ) : (
              <Image
                source={require('@/assets/images/user-image.jpg')}
                style={styles.imageAvatar}
              />
            )
          }
        </Pressable>
        <Pressable onPress={pickImage}>
          <Text style={{
            color: COLORS.light.primary,
            fontSize: 16
          }}>
            {t('settings.account.setNewPhoto')}
          </Text>
        </Pressable>
      </View>
      <EditName />
      <Text style={{ color: 'grey', textAlign: 'center', marginBottom: 32 }}>
        {t('settings.account.editname')}
      </Text>
      <View style={styles.editName}>
        <View style={styles.itemsEditName}>
          <TextInput
            style={styles.inputText}
            placeholder={'Bio'}
            placeholderTextColor={'grey'}
          />
        </View>
      </View>
      <Text style={{ color: 'grey', textAlign: 'center', marginBottom: 32 }}>
        {"Any details such as age, occupation or city ..."}
      </Text>
      {/* <EditPhoneNumer /> */}
      <Pressable style={styles.buttonSubmit}>
        Done
      </Pressable>
    </ScrollView>
  )
}

const EditName = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.editName}>
      <View style={styles.itemsEditName}>
        <TextInput
          style={styles.inputText}
          placeholder={t('settings.account.firstName')}
          placeholderTextColor={'grey'}
        />
      </View>
      <View style={styles.itemsEditName}>
        <TextInput
          style={styles.inputText}
          placeholder={t('settings.account.lastName')}
          placeholderTextColor={'grey'}
        />
      </View>
    </View>
  )
}

const EditPhoneNumer = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.editName}>
      <View style={styles.itemsEditName}>
        <TextInput
          style={styles.inputText}
          placeholder={t('settings.account.phoneNumber')}
          placeholderTextColor={'grey'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  editAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  imageAvatar: {
    backgroundColor: '#d7e2f4',
    height: 100,
    width: 100,
    borderRadius: 9999,
    marginBottom: 10
  },
  editName: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 5
  },
  itemsEditName: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor
  },
  inputText: {
    fontSize: 16,
    marginLeft: 10,
    padding: 5,
    // outlineStyle: 'none' // how to remove border:focus ??
  },
  buttonSubmit: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 16,
    color: COLORS.light.primary,
  }

})

export default Account
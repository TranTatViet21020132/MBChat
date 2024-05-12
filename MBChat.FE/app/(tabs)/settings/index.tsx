import { StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native'
import { View, Text, TouchableOpacity } from '@/components/Themed'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import { useState } from 'react'
import { router, Link } from 'expo-router'
import { MaterialCommunityIcons, Ionicons, Fontisto, Octicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useColorScheme } from '@/components/useColorScheme'
import * as SecureStore from 'expo-secure-store';

type Props = {
  t: TFunction<"translation", undefined>;
}

const Settings = () => {

  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('accessToken');

    router.push('/verify/login')
  }

  return (
    <ScrollView
      style={styles.container}
    >
      <Header t={t} />
      <UserItems t={t} />
      <AppItems t={t} />

      
      <TouchableOpacity style={styles.buttonLogout}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Text style={{color: COLORS.white,
          fontWeight: '600'
        }}>
          Log out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const Header: React.FC<Props> = ({ t }) => {

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

  const colorScheme = useColorScheme();

  return (
    <View
      style={styles.header}
      lightColor={COLORS.light.settings.backgroundInput}
      darkColor={COLORS.dark.settings.backgroundInput}
    >
      <View
        style={colorScheme === 'light' ? styles.avatarLight : styles.avatarDark}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        {
          file ? (
            <Image
              source={{ uri: file }}
              style={{
                width: 60,
                height: 60,
                margin: 20,
                borderRadius: 9999,
              }}
            />
          ) : (
            <Image
              source={require('@/assets/images/user-image.jpg')}
              style={{
                width: 60,
                height: 60,
                margin: 20,
                borderRadius: 9999,
              }}
            />
          )
        }
        <View
          style={{
            flex: 1,
          }}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{
            fontSize: 20,
            marginTop: 20,
            fontWeight: '600'
          }}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            Cucululu
          </Text>
          <Text style={{
            fontSize: 16,
            marginTop: 4
          }}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.user.welcome')}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
        onPress={pickImage}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#3d72f6' }} >
          <MaterialCommunityIcons name='camera-plus-outline' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16, color: COLORS.light.primary }}>
            {t('settings.items.photo')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const UserItems: React.FC<Props> = ({ t }) => {

  const colorScheme = useColorScheme();

  return (
    <View style={styles.items}
      lightColor={COLORS.light.settings.backgroundInput}
      darkColor={COLORS.dark.settings.backgroundInput}
    >
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
        onPress={() => router.push('/(tabs)/settings/account')}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#0a79ee' }}>
          <Ionicons name='key-outline' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16 }}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.account')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#0cb0a5' }}>
          <MaterialCommunityIcons name='devices' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16 }}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.devices')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#f23d37' }}>
          <Ionicons name='notifications-outline' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16}}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.notifications')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#5765f2' }}>
          <Fontisto name='world-o' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16}}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.language')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const AppItems: React.FC<Props> = ({ t }) => {

  const colorScheme = useColorScheme();

  return (
    <View style={styles.items}
      lightColor={COLORS.light.settings.backgroundInput}
      darkColor={COLORS.dark.settings.backgroundInput}
    >
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#40a6e0' }}>
          <Ionicons name='lock-closed-outline' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16}}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.privacy')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#28c75c' }}>
          <Octicons name='question' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16}}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.faq')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={colorScheme === 'light' ? styles.itemLight : styles.itemDark}
        activeOpacity={0.8}
        lightColor={COLORS.light.settings.backgroundInput}
        darkColor={COLORS.dark.settings.backgroundInput}
      >
        <View style={{ ...styles.itemIcon, backgroundColor: '#f0c910' }}>
          <MaterialCommunityIcons name='lightbulb-outline' size={24} color={'#fff'} />
        </View>
        <View style={styles.itemTitle}
          lightColor={COLORS.light.settings.backgroundInput}
          darkColor={COLORS.dark.settings.backgroundInput}
        >
          <Text style={{ fontSize: 16}}
            lightColor={COLORS.light.settings.text}
            darkColor={COLORS.dark.settings.text}
          >
            {t('settings.items.features')}
          </Text>
          <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
  header: {
    height: 148,
    borderRadius: 10,
    marginBottom: 28
  },
  avatarLight: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
    flexDirection: 'row',
    borderRadius: 10
  },
  avatarDark: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.settings.backgroudColor,
    flexDirection: 'row',
    borderRadius: 10
  },
  itemLight: {
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
    borderRadius: 10,
  },
  itemDark: {
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.settings.backgroudColor,
    borderRadius: 10,
  },
  itemIcon: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    padding: 2
  },
  itemTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  items: {
    marginBottom: 28,
    borderRadius: 10,
  },
  buttonLogout: {
    height: 40,
    backgroundColor: COLORS.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 40
  }
})

export default Settings
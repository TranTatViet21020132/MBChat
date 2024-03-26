import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { COLORS } from '@/constants/Colors'

const Account = () => {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.editAvatar}>
        <Pressable>
          <Image
            source={require('@/assets/images/user-image.jpg')}
            style={styles.imageAvatar}
          />
        </Pressable>
        <Text style={{
          color: COLORS.light.primary,
          fontSize: 16
        }}>
          {t('settings.account.setNewPhoto')}
        </Text>
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
        Any details such as age, occupation or city ...
      </Text>
      <EditPhoneNumer />
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
    outlineStyle: 'none' // how to remove border:focus ??
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
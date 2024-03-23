import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
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
            source={ require('@/assets/images/user-image.jpg')}
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
      <View>
        
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  editAvatar: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageAvatar: {
    backgroundColor: '#d7e2f4',
    height: 100,
    width: 100,
    borderRadius: 9999,
    marginBottom: 10
  }
})

export default Account
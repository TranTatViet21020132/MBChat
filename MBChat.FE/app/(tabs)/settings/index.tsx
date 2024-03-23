import {View, Text, StyleSheet, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native'
// import { View, Text } from '@/components/Themed'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import { SearchBar } from 'react-native-elements'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons, Ionicons, Fontisto, Octicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

type Props = {
  t: TFunction<"translation", undefined>;
}

const Settings = () => {

  const { t } = useTranslation();

  return (
    <ScrollView
      style={styles.container}
    >
      <Header t={t}/>
      <UserItems t={t}/>
      <AppItems t={t}/>
    </ScrollView>
  )
}

const Header: React.FC<Props> = ({t}) => {

  return (
    <View
      style={styles.header}
    >
      <View
        style={styles.avatar}
      >
        <Image 
          style={{
            width: 60,
            height: 60,
            margin: 20,
            borderRadius: 9999,
          }}
          source={require('@/assets/images/user-image.jpg')}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={{
            fontSize: 20,
            marginTop: 20,
            fontWeight: '600'
          }}>
            Cucululu
          </Text>
          <Text style={{
            fontSize: 16,
            marginTop: 4
          }}>
            {t('settings.user.welcome')}
          </Text>
        </View>
      </View>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#3d72f6'}} >
            <MaterialCommunityIcons name='camera-plus-outline' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.primary}}>,
              Set Profile Photo
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
    </View>
  )
}

const UserItems: React.FC<Props> = ({t}) => {

  const router = useRouter();

  return (
    <View style={styles.items}>
      <Pressable style={styles.item}
        onPress={() => router.push('/(tabs)/settings/account')}
      >
          <View style={{...styles.itemIcon, backgroundColor: '#0a79ee'}}>
            <Ionicons name='key-outline' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}>
              {t('settings.items.account')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#0cb0a5'}}>
            <MaterialCommunityIcons name='devices' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}>
            {t('settings.items.devices')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#f23d37'}}>
            <Ionicons name='notifications-outline' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}>
            {t('settings.items.notifications')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#5765f2'}}>
            <Fontisto name='world-o' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}>
            {t('settings.items.language')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
    </View>
  );
}

const AppItems: React.FC<Props> = ({t}) => {

  return (
    <View style={styles.items}>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#40a6e0'}}>
            <Ionicons name='lock-closed-outline' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}> 
            {t('settings.items.privacy')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#28c75c'}}>
            <Octicons name='question' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}>
            {t('settings.items.faq')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
      <Pressable style={styles.item}>
          <View style={{...styles.itemIcon, backgroundColor: '#f0c910'}}>
            <MaterialCommunityIcons name='lightbulb-outline' size={24} color={'#fff'}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.settings.text}}>
            {t('settings.items.features')}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </Pressable>
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
    backgroundColor: '#fff',
    height: 148,
    borderRadius: 10,
    marginBottom: 28
  },
  avatar: {
    // height: 100,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
    flexDirection: 'row'
  },
  item: {
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
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
    backgroundColor: '#fff'
  }
})

export default Settings
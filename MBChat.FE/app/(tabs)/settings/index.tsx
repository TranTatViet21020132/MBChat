import { View, Text, StyleSheet, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import { SearchBar } from 'react-native-elements'
import { useState } from 'react'
import { MaterialCommunityIcons, Ionicons, Fontisto, Octicons } from '@expo/vector-icons'


const Settings = () => {
  const [searchValue, setSearchValue] = useState('')


  return (
    <ScrollView
      style={styles.container}
    >
      <Header />
      <UserItems />
      <AppItems />
    </ScrollView>
  )
}

const Header = () => {

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
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png'
          }}
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
            Heloo?! I'm using....
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <MaterialCommunityIcons name='camera-plus-outline' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.primary}}>
              Set Profile Photo
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
    </View>
  )
}

const UserItems = () => {

  return (
    <View style={styles.items}>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <Ionicons name='key-outline' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              Account
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <MaterialCommunityIcons name='devices' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              Devices
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <Ionicons name='notifications-outline' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              Notifications
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <Fontisto name='world-o' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              Language
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
    </View>
  );
}

const AppItems = () => {

  return (
    <View style={styles.items}>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <Ionicons name='lock-closed-outline' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              Privacy And Security
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <Octicons name='question' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              App FAQ
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
          <View style={styles.itemIcon}>
            <MaterialCommunityIcons name='lightbulb-outline' size={24} color={COLORS.light.primary}/>
          </View>
          <View style={styles.itemTitle}>
            <Text style={{fontSize: 16, color: COLORS.light.text}}>
              App Features
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text}/>
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
    backgroundColor: '#fff',
    height: 140,
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
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
  },
  itemIcon: {
    marginLeft: 20,
    marginRight: 20
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
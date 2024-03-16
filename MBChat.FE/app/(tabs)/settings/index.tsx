import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import { SearchBar } from 'react-native-elements'
import { useState } from 'react'


const Settings = () => {
  const [searchValue, setSearchValue] = useState('')


  return (
    <ScrollView
      style={styles.container}
    >
      <Header />
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  header: {
    backgroundColor: '#fff',
    height: 140,
    borderRadius: 10
  },
  avatar: {
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
    flexDirection: 'row'
  }
})

export default Settings
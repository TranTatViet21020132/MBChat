import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'

const Layout = () => {
  const router = useRouter()
  return (
    <Stack>
      <Stack.Screen 
        name='index' 
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: 'transparent'
          }
        }}
      />
      <Stack.Screen 
        name='account' 
        options={{
          title: 'Edit account',
          headerStyle: {
            backgroundColor: 'transparent'
          }
        }}
      />
    </Stack>
  )
}

export default Layout
import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import Button from '@/components/VideoCall/Button'
const Calls = () => {
  return (
    <View style={styles.container}>
      <Button iconName="video" backgroundColor="grey" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
})

export default Calls
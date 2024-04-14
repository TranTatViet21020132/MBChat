import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { ChatContext } from '@/context/chatContext';

const ColorDemoPage = () => {
  const chatContext = React.useContext(ChatContext);

  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { bgUrl } = chatContext;

  return (
    <ImageBackground
      source={bgUrl}
      style={{
        flex: 1,
        backgroundColor: COLORS.light.background,
      }}>      
      <View style={styles.container}>
        <View style={[styles.chatBlock1, { backgroundColor: '#fff' }]} />
        <View style={[styles.chatBlock2, { backgroundColor: COLORS.lightGreen }]} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  chatBlock1: {
    padding: 20,
    height: 70,
    borderRadius: 8,
    marginBottom: 20,
    width: '55%',
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  chatBlock2: {
    padding: 20,
    height: 70,
    borderRadius: 8,
    marginBottom: 10,
    width: '60%',
    alignSelf: "flex-end"
  },
});

export default ColorDemoPage;

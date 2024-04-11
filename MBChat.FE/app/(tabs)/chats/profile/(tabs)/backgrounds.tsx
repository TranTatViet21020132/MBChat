import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Alert, ImageBackground, Linking, Platform, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ChatContext } from '@/context/chatContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import messageData from '@/assets/data/messages.json';

const SingleChatPage = () => {
  const insets = useSafeAreaInsets();

  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { bgUrl, setBgUrl } = chatContext;

  return (
    <ImageBackground
    source={require('@/assets/images/pattern.png')}
    style={{
      flex: 1,
      backgroundColor: COLORS.light.background,
      marginBottom: insets.bottom,
    }}>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  composer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
});

export default SingleChatPage
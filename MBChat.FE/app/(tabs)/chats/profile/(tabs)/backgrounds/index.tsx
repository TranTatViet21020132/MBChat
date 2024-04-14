import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { COLORS } from '@/constants/Colors';
import { ChatContext } from '@/context/chatContext';
import { Href, router } from 'expo-router';

const colors = [
  {
    colorCode: '#E5DDD5',
    colorRequire: require("@/assets/images/backgrounds/Default.png"),
    path: "/(tabs)/chats/profile/(tabs)/backgrounds/color"
  },
  {
    colorCode: '#E5E6EB',
    colorRequire: require("@/assets/images/backgrounds/BrightCool.png"),
    path: "/(tabs)/chats/profile/(tabs)/backgrounds/color"
  },
  {
    colorCode: '#E7D8C1',
    colorRequire: require("@/assets/images/backgrounds/DramaticWarm.png"),
    path: "/(tabs)/chats/profile/(tabs)/backgrounds/color"
  }
];

const SingleChatPage = () => {
  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { setBgUrl } = chatContext;

  const handleColorSelect = React.useCallback((color: any, url: Href<string>) => {
    setBgUrl(color.colorRequire);
    router.push(url);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.colorGrid}>
        {colors.map((color, index) => (
          <Pressable
            key={index}
            style={[styles.colorItem, { backgroundColor: color.colorCode }]}
            onPress={() => handleColorSelect(color, color.path as Href<string>)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    width: "100%"
  },
  colorItem: {
    width: '30%',
    height: 110,
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default SingleChatPage
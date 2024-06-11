import React from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Image,
  TouchableHighlight
} from 'react-native'
import { COLORS } from '@/constants/Colors';
import { ChatContext } from '@/context/chatContext';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChatRow from "@/components/chats/ChatRow";
import { defaultStyles } from "@/constants/Styles";
import SwipeableRow from '@/components/SwipeableRow';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { FC, useCallback } from 'react';
import { Avatar } from 'react-native-elements';
import { getInitials, getRandomBackgroundColor } from '@/services/utils';
import { COLORSHADES } from '@/constants/Colors';

export type ChatRowProps = {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
  type: "communities" | "chats";
  channelTitle: Array<string>;
}

type NoDataProps = {
  iconName: 'image' | 'link' | 'document',
  noDataTitle: string,
  noDataGuild: string,
}

interface chatMessageObject {
  _id: number,
  text: string,
  createdAt: Date,
  user: {
    _id: number,
    name: string
  },
  location?: string,
  reactions: {
    value: Array<string>,
    total: number
  }
}

const AvatarRender = (id: number, name: string) => {
  return (
    <Avatar
      size={50}
      rounded
      title={name}
      containerStyle={{ backgroundColor: COLORSHADES[id % 100] }}
    />
  )
}

const SingleChatPage = () => {
  const chatContext = React.useContext(ChatContext);

  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { chats } = chatContext;
  const id = chats.id;

  const [noData, setNoData] = React.useState<NoDataProps>({
    iconName: 'image',
    noDataTitle: 'No message',
    noDataGuild: `Search message`
  });

  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory);
  const messages = String(id) in chatHistory
    ? chatHistory[String(id)]
    : [];

  const [search, setSearch] = React.useState("");

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const [resultSearch, setResultSearch] = React.useState<Array<chatMessageObject>>();


  const isAndroid = Platform.OS === 'android';
  const behavior = isAndroid ? false : 'padding';

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'Search message',
          headerBackVisible: false,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                color={COLORS.light.primary}
                size={30}
              />
            </Pressable>
          ),
          headerSearchBarOptions: {
            placeholder: 'Search messsage here',
            onChangeText: (event) => {
              setSearch(event.nativeEvent.text)
            },
            onSearchButtonPress: (event) => {
              event.defaultPrevented
              Keyboard.dismiss();
              const result = messages.filter((message) => (message.text.includes(search.toLowerCase()) ||  message.text.includes(search.toUpperCase())));
              setResultSearch(result);
            }
          },
          headerStyle: {
            backgroundColor: COLORS.light.background,
          },
        }}
      />
      <ScrollView style={styles.colorGrid}
        contentContainerStyle={{justifyContent: 'space-between'}}
      >
        {(resultSearch) ?
          <View>
            {
              (resultSearch.length !== 0) ?
                resultSearch.map((message, index) =>
                  <View
                    key={index}
                    style={{width: '90%'}}
                  >
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor={COLORS.lightGray}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 14,
                          paddingLeft: 10,
                          paddingVertical: 10,
                        }}>
                        <Avatar
                          size={50}
                          rounded
                          title={getInitials(message.user.name)}
                          containerStyle={{ backgroundColor: COLORSHADES[message.user._id % 100] }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{message.user.name}</Text>
                          <Text style={{ fontSize: 16, color: COLORS.gray }}>
                            {message.text.length > 40 ? `${message.text.substring(0, 40)}...` : message.text}
                          </Text>
                        </View>
                        <Text style={{ color: COLORS.gray, paddingRight: 20, alignSelf: 'flex-start' }}>
                          {format(message.createdAt, 'dd/MM/yy')}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                ) :
                (
                  <Text style={{fontSize: 20, fontWeight: "700", alignContent: 'center'}}>
                    Not found message
                  </Text>
                )
            }
          </View>
          : 
          <View>
            <Text style={{fontSize: 20, fontWeight: "700", alignContent: 'center'}}>
              No Message
            </Text>
          </View>
        }
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchWrapper: {
    flex: 1,
    marginLeft: 20,
    marginRight: 40,
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    fontSize: 16
  }
});

export default SingleChatPage
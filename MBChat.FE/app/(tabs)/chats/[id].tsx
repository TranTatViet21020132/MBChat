import AccessoryBar from '@/components/chats/AccessoryBar'
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Alert, ImageBackground, Linking, Platform, StyleSheet, Text, View } from 'react-native'
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat'
import ChatMessageBox from '@/components/chats/ChatMessageBox';
import ReplyMessageBar from '@/components/chats/ReplyMessageBar';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import messageData from '@/assets/data/messages.json';

import CustomActions from '@/components/chats/CustomActions'
import CustomView from '@/components/chats/CustomView'
import earlierMessages from '@/assets/data/earlierMessages'
import messagesData from '@/assets/data/messages'

const user = {
  _id: 1,
  name: 'Developer',
}

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://facebook.github.io/react/img/logo_og.png',
}

interface IState {
  messages: any[]
  step: number
  loadEarlier?: boolean
  isLoadingEarlier?: boolean
  isTyping: boolean
}

enum ActionKind {
  SEND_MESSAGE = 'SEND_MESSAGE',
  LOAD_EARLIER_MESSAGES = 'LOAD_EARLIER_MESSAGES',
  LOAD_EARLIER_START = 'LOAD_EARLIER_START',
  SET_IS_TYPING = 'SET_IS_TYPING',
  // LOAD_EARLIER_END = 'LOAD_EARLIER_END',
}

// An interface for our actions
interface StateAction {
  type: ActionKind
  payload?: any
}

function reducer(state: IState, action: StateAction) {
  switch (action.type) {
    case ActionKind.SEND_MESSAGE: {
      return {
        ...state,
        step: state.step + 1,
        messages: action.payload,
      }
    }
    case ActionKind.LOAD_EARLIER_MESSAGES: {
      return {
        ...state,
        loadEarlier: true,
        isLoadingEarlier: false,
        messages: action.payload,
      }
    }
    case ActionKind.LOAD_EARLIER_START: {
      return {
        ...state,
        isLoadingEarlier: true,
      }
    }
    case ActionKind.SET_IS_TYPING: {
      return {
        ...state,
        isTyping: action.payload,
      }
    }
  }
}

const App = () => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);

  const [state, dispatch] = useReducer(reducer, {
    messages: messagesData,
    step: 0,
    loadEarlier: true,
    isLoadingEarlier: false,
    isTyping: false,
  })

  const onSend = useCallback(
    (messages: any[]) => {
      const sentMessages = [{ ...messages[0], sent: true, received: true, seen: false }]
      const newMessages = GiftedChat.append(
        state.messages,
        sentMessages,
        Platform.OS !== 'web',
      )

      dispatch({ type: ActionKind.SEND_MESSAGE, payload: newMessages })
    },
    [dispatch, state.messages],
  )

  const onLoadEarlier = useCallback(() => {
    console.log('loading')
    dispatch({ type: ActionKind.LOAD_EARLIER_START })
    setTimeout(() => {
      const newMessages = GiftedChat.prepend(
        state.messages,
        earlierMessages() as IMessage[],
        Platform.OS !== 'web',
      )

      dispatch({ type: ActionKind.LOAD_EARLIER_MESSAGES, payload: newMessages })
    }, 1500) // simulating network
  }, [dispatch, state.messages])

  const onPressAvatar = useCallback(() => {
    Alert.alert('On avatar press')
  }, [])

  const setIsTyping = useCallback(
    (isTyping: boolean) => {
      dispatch({ type: ActionKind.SET_IS_TYPING, payload: isTyping })
    },
    [dispatch],
  )

  const onSendFromUser = useCallback(
    (messages: IMessage[] = []) => {
      const createdAt = new Date()
      const messagesToUpload = messages.map(message => ({
        ...message,
        user,
        createdAt,
        _id: Math.round(Math.random() * 1000000),
      }))

      onSend(messagesToUpload)
    },
    [onSend],
  )

  const renderToolBar = useCallback(() => {
    return (
      <AccessoryBar
        onSend={onSendFromUser}
      />
    )
  }, [onSendFromUser])

  const renderCustomActions = useCallback(
    (props: any) =>
      Platform.OS === 'web' ? null : (
        <CustomActions {...props} onSend={onSendFromUser} />
      ),
    [onSendFromUser],
  );

  const renderCustomView = useCallback((props: any) => {
    return <CustomView {...props} />;
  }, []);

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  const renderMessage = useCallback(
    (props: any) => {
      return (
        <ChatMessageBox
          {...props}
          setReplyOnSwipeOpen={setReplyMessage}
          updateRowRef={updateRowRef}
        />
      )
  },[]);

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  return (
    <ImageBackground
    source={require('@/assets/images/pattern.png')}
    style={{
      flex: 1,
      backgroundColor: COLORS.light.background,
      marginBottom: insets.bottom,
    }}>
      <GiftedChat
        messages={state.messages}
        onSend={onSend}
        onInputTextChanged={setText}
        user={user}
        loadEarlier={state.loadEarlier}
        onLoadEarlier={onLoadEarlier}
        isLoadingEarlier={state.isLoadingEarlier}
        scrollToBottom
        onPressAvatar={onPressAvatar}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: COLORS.gray }} />
        )}
        bottomOffset={insets.bottom}
        maxComposerHeight={100}
        textInputProps={styles.composer}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: '#000',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#fff',
                },
                right: {
                  backgroundColor: COLORS.lightGreen,
                },
              }}
              // tickStyle={{ color: props.currentMessage?.seen ? COLORS.light.primary : COLORS.lightGreen }}
              tickStyle={{ color: COLORS.light.primary }}
            />
          );
        }}
        renderSend={(props) => (
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingHorizontal: 14,
            }}>
            {text === '' && renderToolBar()}
            
            {text !== '' && (
              <Send
                {...props}
                containerStyle={{
                  justifyContent: 'center',
                }}>
                <Ionicons name="send" color={COLORS.light.primary} size={28} />
              </Send>
            )}
          </View>
        )}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderChatFooter={() => (
          <ReplyMessageBar clearReply={() => setReplyMessage(null)} message={replyMessage} />
        )}
        onLongPress={(context, message) => setReplyMessage(message)}
        renderMessage={renderMessage}
        isTyping={state.isTyping}
        inverted={Platform.OS !== 'web'}
        infiniteScroll
        timeTextStyle={{
          left: { color: 'red' },
          right: { color: '#6E6E73' },
        }}
      />
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

export default App
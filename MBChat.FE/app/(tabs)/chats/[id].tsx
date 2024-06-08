import AccessoryBar from "@/components/chats/AccessoryBar";
import React, {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
import {
    Alert,
    findNodeHandle,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    GiftedChat,
    Bubble,
    Send,
    SystemMessage,
    IMessage,
} from "react-native-gifted-chat";
import ChatMessageBox from "@/components/chats/ChatMessageBox";
import ReplyMessageBar from "@/components/chats/ReplyMessageBar";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { ChatContext } from "@/context/chatContext";

import { useSafeAreaInsets } from "react-native-safe-area-context";
// import messageData from '@/assets/data/messages.json';
import { ChatListContext } from "@/context/chatListContext";
import CustomActions from "@/components/chats/CustomActions";
import CustomView from "@/components/chats/CustomView";
import earlierMessages from "@/assets/data/earlierMessages";
import messagesData from "@/assets/data/messages";
import MessageApi from "@/api/MessageApi";
import mime from "mime";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import PortalView from "@/components/chats/PortalView";
import { ChatFooter } from "@/components/chats/ChatFooter";
import { UIManager } from "react-native";
const user = {
    _id: 1,
    name: "Developer",
};

const otherUser = {
    _id: 2,
    name: "React Native",
    avatar: "https://facebook.github.io/react/img/logo_og.png",
};

interface IState {
    messages: any[];
    step: number;
    loadEarlier?: boolean;
    isLoadingEarlier?: boolean;
    isTyping: boolean;
}

enum ActionKind {
    SEND_MESSAGE = "SEND_MESSAGE",
    LOAD_EARLIER_MESSAGES = "LOAD_EARLIER_MESSAGES",
    LOAD_EARLIER_START = "LOAD_EARLIER_START",
    SET_IS_TYPING = "SET_IS_TYPING",
    // LOAD_EARLIER_END = 'LOAD_EARLIER_END',
    LOAD_MESSAGES = "load_messages",
}

// An interface for our actions
interface StateAction {
    type: ActionKind;
    payload?: any;
}

function reducer(state: IState, action: StateAction) {
    switch (action.type) {
        case ActionKind.SEND_MESSAGE: {
            return {
                ...state,
                step: state.step + 1,
                messages: action.payload,
            };
        }
        case ActionKind.LOAD_EARLIER_MESSAGES: {
            return {
                ...state,
                loadEarlier: true,
                isLoadingEarlier: false,
                messages: action.payload,
            };
        }
        case ActionKind.LOAD_EARLIER_START: {
            return {
                ...state,
                isLoadingEarlier: true,
            };
        }
        case ActionKind.SET_IS_TYPING: {
            return {
                ...state,
                isTyping: action.payload,
            };
        }
        case ActionKind.LOAD_MESSAGES:
            return {
                ...state,
                messages: action.payload,
            };
    }
}

function waitForSocketConnection(websocket: WebSocket, id: number) {
    setTimeout(function () {
        if (websocket) {
          if (websocket.readyState === 1) {
                const formData = {
                    action: "get_message_list",
                    targetId: id,
                    target: "channel",
                };
                const formSubmit = JSON.stringify(formData);
                websocket.send(formSubmit);
            } else {
                waitForSocketConnection(websocket, id);
            }
        }
    }, 5);
}

function isOpenWebsocket(WebSocket: { readyState: any; OPEN: any }) {
    return WebSocket.readyState === WebSocket.OPEN;
}

const SingleChatPage = () => {
    // const [messageCordiantes, setMessageCordinates] = useState({
    //     x: 0,
    //     y: 0
    // })
    const chatContext = React.useContext(ChatContext);
    // const onLongPress = (e: any) => {
    //     const {pageY, locationY} = e.nativeEvent;
    //     console.log(e.nativeEvent)
    //     setMessageCordinates({
    //         x: 0,
    //         y: pageY - 2 * locationY
    //     })
    // }

    // console.log("messageCordinates", messageCordiantes)

    if (!chatContext || !chatContext.setChats) {
        return null;
    }

    const { bgUrl } = chatContext;

    const id = useLocalSearchParams();

    console.log(id);
    const socket = useSelector((state: RootState) => state.websocket.socket);
    const chatHistory = useSelector((state: RootState) => state.chat.chatHistory);

    const [text, setText] = useState("");
    const insets = useSafeAreaInsets();

    const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [openReplyMessage, setOpenReplyMessage] = useState<boolean>(false);
    const swipeableRowRef = useRef<Swipeable | null>(null);
    const messageRef = useRef(null);
    const [state, dispatch] = useReducer(reducer, {
        messages:
            String(id["id"]) in chatHistory
                ? chatHistory[String(id["id"])]
                : [],
        step: 0,
        loadEarlier: true,
        isLoadingEarlier: false,
        isTyping: false,
    });

    const onSend = useCallback(
        async (messages: any[], replyMessage: any) => {
            if (messages[0]["image"]) {
                const newImageUri =
                    "file:///" + messages[0]["image"].split("file:/").join("");
                const formData = new FormData();
                formData.append("file", {
                    uri: newImageUri,
                    type: mime.getType(newImageUri),
                    name: newImageUri.split("/").pop(),
                });
                formData.append("channel", String(id["id"]));
                const response = await MessageApi.uploadImage(formData);
            } else if (socket && isOpenWebsocket(socket)) {
                let data = {
                    content: messages[0]["text"] ? messages[0]["text"] : "",
                };
                if (messages[0]["location"]) {
                    //@ts-ignore
                    data[
                        "location"
                    ] = `${messages[0]["location"]["latitude"]} ${messages[0]["location"]["longitude"]}`;
                }
                if (replyMessage && openReplyMessage) {
                    //@ts-ignore
                    data["reply"] = replyMessage["_id"];
                    setReplyMessage(null);
                    setOpenReplyMessage(false);
                }
                console.log(data);
                const formData = {
                    action: "send_message",
                    targetId: Number(id["id"]),
                    target: "channel",
                    data: data,
                };
                const formSubmit = JSON.stringify(formData);
                socket.send(formSubmit);
            }
            // console.log(messages[0])
            // const sentMessages = [{ ...messages[0], sent: true, received: true, seen: false }]
            // const newMessages = GiftedChat.append(
            //   state.messages,
            //   sentMessages,
            //   Platform.OS !== 'web',
            // )

            // dispatch({ type: ActionKind.SEND_MESSAGE, payload: newMessages })
        },
        [dispatch, state.messages]
    );

    const onLoadEarlier = useCallback(() => {
        console.log("loading");
        dispatch({ type: ActionKind.LOAD_EARLIER_START });
        setTimeout(() => {
            const newMessages = GiftedChat.prepend(
                state.messages,
                earlierMessages() as IMessage[],
                Platform.OS !== "web"
            );

            dispatch({
                type: ActionKind.LOAD_EARLIER_MESSAGES,
                payload: newMessages,
            });
        }, 1500); // simulating network
    }, [dispatch, state.messages]);

    const onPressAvatar = useCallback(() => {
        Alert.alert("On avatar press");
    }, []);

    const setIsTyping = useCallback(
        (isTyping: boolean) => {
            dispatch({ type: ActionKind.SET_IS_TYPING, payload: isTyping });
        },
        [dispatch]
    );

    const onSendFromUser = useCallback(
        (messages: IMessage[] = []) => {
            const createdAt = new Date();
            const messagesToUpload = messages.map((message) => ({
                ...message,
                user,
                createdAt,
                _id: Math.round(Math.random() * 1000000),
            }));

            onSend(messagesToUpload, replyMessage);
        },
        [onSend]
    );

    const renderToolBar = useCallback(() => {
        return <AccessoryBar onSend={onSendFromUser} />;
    }, [onSendFromUser]);

    const renderCustomActions = useCallback(
        (props: any) =>
            Platform.OS === "web" ? null : (
                <CustomActions {...props} onSend={onSendFromUser} />
            ),
        [onSendFromUser]
    );

    const renderCustomView = useCallback((props: any) => {
        return <CustomView {...props} />;
    }, []);

    const updateRowRef = useCallback(
        (ref: any) => {
            if (
                ref &&
                replyMessage &&
                ref.props.children.props.currentMessage?._id ===
                    replyMessage._id
            ) {
                swipeableRowRef.current = ref;
            }
        },
        [replyMessage]
    );

    const renderMessage = useCallback((props: any, replyMessage: IMessage | null, openMenu: boolean) => {
        return (
            <ChatMessageBox
                {...props}
                setReplyOnSwipeOpen={setReplyMessage}
                updateRowRef={updateRowRef}
                replyMessage={replyMessage}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
            />
        );
    }, [replyMessage]);


    useEffect(() => {
        if (replyMessage && swipeableRowRef.current) {
            swipeableRowRef.current.close();
            swipeableRowRef.current = null;
        }
        if (!(String(id["id"]) in chatHistory) && socket) {
            waitForSocketConnection(
                socket,
                Number(id["id"])
            );
        } else if (
            state.messages.length < chatHistory[String(id["id"])].length
        ) {
            dispatch({
                type: ActionKind.LOAD_MESSAGES,
                payload: chatHistory[String(id["id"])],
            });
        }
        if (String(id["id"]) != chatContext.chats.id) {
            chatContext.setChats({
                ...chatContext.chats,
                id: String(id["id"]),
            });
        }
    }, [replyMessage, socket, chatHistory, state.messages]);

    return (
        <ImageBackground
            source={bgUrl}
            style={{
                flex: 1,
                backgroundColor: COLORS.light.background,
                marginBottom: insets.bottom,
            }}
        >
            <GiftedChat
                messages={state.messages}
                onSend={(message) => onSend(message, replyMessage)}
                onInputTextChanged={setText}
                user={user}
                loadEarlier={state.loadEarlier}
                onLoadEarlier={onLoadEarlier}
                isLoadingEarlier={state.isLoadingEarlier}
                scrollToBottom
                onPressAvatar={onPressAvatar}
                renderSystemMessage={(props) => (
                    <SystemMessage
                        {...props}
                        textStyle={{ color: COLORS.gray }}
                    />
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
                                    color: "#000",
                                },
                            }}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: "#fff",
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
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 14,
                            paddingHorizontal: 14,
                        }}
                    >
                        {text === "" && renderToolBar()}

                        {text !== "" && (
                            <Send
                                {...props}
                                containerStyle={{
                                    justifyContent: "center",
                                }}
                            >
                                <Ionicons
                                    name="send"
                                    color={COLORS.light.primary}
                                    size={28}
                                />
                            </Send>
                        )}
                    </View>
                )}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                renderChatFooter={() => (
                    // <ReplyMessageBar
                    //     clearReply={() => {setReplyMessage(null)}}
                    //     message={replyMessage}
                    // />

                    openReplyMessage ? (<ReplyMessageBar
                        clearReply={() => {
                            setReplyMessage(null)
                            setOpenReplyMessage(false)
                        }}
                        message={replyMessage}
                    />) 
                    : (openMenu ? 
                        <ChatFooter 
                        setOpenMenu={setOpenMenu} 
                        setOpenReplyMessage={setOpenReplyMessage}
                        currentMessage={replyMessage}
                        
                        />
                        : null)
                )}
                onLongPress={(context, message) => {
                    if (!openMenu) {
                        setOpenMenu(true);
                    }
                    // getElementPosition(messageRef.current, (position: any) => {
                    //     console.log('Position:', position);
                    //     // Ở đây bạn có thể xử lý vị trí nhận được
                    // });
                    setReplyMessage(message);
                }}
                renderMessage={(props) => renderMessage(props, replyMessage, openMenu)}
                isTyping={state.isTyping}
                inverted={Platform.OS !== "web"}
                infiniteScroll
                timeTextStyle={{
                    left: { color: "red" },
                    right: { color: "#6E6E73" },
                }}
            />
            {/* <PortalView messageCordiantes={messageCordiantes}/> */}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    composer: {
        backgroundColor: "#fff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        paddingHorizontal: 10,
        paddingTop: 8,
        fontSize: 16,
        marginVertical: 4,
    },
});

export default SingleChatPage;

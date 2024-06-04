import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import {
    GestureHandlerRootView,
    Swipeable,
    TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { IMessage, Message, MessageProps } from "react-native-gifted-chat";
import { isSameDay, isSameUser } from "react-native-gifted-chat/lib/utils";
import { COLORS } from "@/constants/Colors";
import { TouchableOpacity } from "../Themed";
import PortalView from "./Reaction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ChatContext } from "@/context/chatContext";

type ChatMessageBoxProps = {
    setReplyOnSwipeOpen: (message: IMessage) => void;
    updateRowRef: (ref: any) => void;
    replyMessage: IMessage;
    openMenu: boolean;
    setOpenMenu: (value: boolean) => void;
} & MessageProps<IMessage>;

const ChatMessageBox = ({
    setReplyOnSwipeOpen,
    updateRowRef,
    replyMessage,
    openMenu,
    setOpenMenu,
    ...props
}: ChatMessageBoxProps) => {
    const socket = useSelector((state: RootState) => state.websocket.socket);
    const chatHistory = useSelector(
        (state: RootState) => state.chat.chatHistory
    );
    const chatContext = React.useContext(ChatContext);
    const messageFromChatHistory = chatContext?.chats.id
        ? chatHistory[chatContext?.chats.id].find(
              (item: any) => item._id === props.currentMessage?._id
          )
        : null;
    const isNextMyMessage =
        props.currentMessage &&
        props.nextMessage &&
        isSameUser(props.currentMessage, props.nextMessage) &&
        isSameDay(props.currentMessage, props.nextMessage);
    const isChoosedMessage =
        replyMessage &&
        props.currentMessage &&
        props.currentMessage?._id === replyMessage._id &&
        openMenu;
    const isMyMessage =
        props.currentMessage && props.currentMessage?.user._id === 1;
    const [scaleValue] = useState(new Animated.Value(1));
    // if (props.currentMessage?._id === replyMessage._id) {
    //   console.log("he he extractly")
    // }
    const renderRightAction = (
        progressAnimatedValue: Animated.AnimatedInterpolation<any>
    ) => {
        const size = progressAnimatedValue.interpolate({
            inputRange: [0, 1, 100],
            outputRange: [0, 1, 1],
        });
        const trans = progressAnimatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 12, 20],
        });

        return (
            <Animated.View
                style={[
                    styles.container,
                    { transform: [{ scale: size }, { translateX: trans }] },
                    isNextMyMessage
                        ? styles.defaultBottomOffset
                        : styles.bottomOffsetNext,
                    props.position === "right" && styles.leftOffsetValue,
                ]}
            >
                <View style={styles.replyImageWrapper}>
                    <MaterialCommunityIcons
                        name="reply-circle"
                        size={26}
                        color={COLORS.gray}
                    />
                </View>
            </Animated.View>
        );
    };

    const onSwipeOpenAction = () => {
        if (props.currentMessage) {
            setReplyOnSwipeOpen({ ...props.currentMessage });
        }
    };

    const convertCodeToEmoji = (text: string) => {
        switch (text) {
            case "<3":
                return "❤️";
            case ":D":
                return "😀";
            case ":+1:":
                return "👍";
            case ":joy:":
                return "😂";
            case ":heart_eyes:":
                return "😍";
            case ":rage:":
                return "😡";
        }
        return text;
    };

    const handleLongPress = () => {
        Animated.spring(scaleValue, {
            toValue: 1.5,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const sendReaction = (text: string) => {
        if (socket) {
            const formData = {
                target: "channel",
                targetId: chatContext?.chats.id,
                action: "send_reaction",
                data: {
                    message_id: props.currentMessage?._id,
                    value: text,
                },
            };
            socket.send(JSON.stringify(formData));
        }
    };

    return (
        <GestureHandlerRootView>
            {props.currentMessage?.repliedMessage ? (
                <Swipeable
                    ref={updateRowRef}
                    friction={2}
                    rightThreshold={40}
                    renderLeftActions={renderRightAction}
                    onSwipeableWillOpen={onSwipeOpenAction}
                >
                    <View style={{ marginBottom: isChoosedMessage ? 50 : 0 }}>
                        <View
                            style={{ marginBottom: isChoosedMessage ? 50 : 0 }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    marginBottom:
                                        messageFromChatHistory?.reactions
                                            .total > 0
                                            ? 15
                                            : 0,
                                }}
                            >
                                <Message
                                    {...props}
                                    currentMessage={
                                        props.currentMessage.repliedMessage
                                    }
                                    containerStyle={{
                                        right: {
                                            opacity: 0.3,
                                            marginBottom: -16,
                                        },
                                        left: {
                                            opacity: 0.3,
                                            marginBottom: -16,
                                            marginLeft: 40,
                                        },
                                    }}
                                />
                                <Message
                                    {...props}
                                    containerStyle={{ right: { zIndex: 5 } }}
                                />
                                {messageFromChatHistory?.reactions.total > 0 ? (
                                    <View
                                        style={[
                                            {
                                                display: "flex",
                                                flexDirection: "row",
                                                position: "absolute",

                                                bottom: -10,
                                                backgroundColor: "white",
                                                borderRadius: 50,
                                                paddingHorizontal: 4,
                                                paddingVertical: 1,
                                                zIndex: 10
                                            },
                                            isMyMessage
                                                ? { right: 10 }
                                                : { left: 50 },
                                        ]}
                                    >
                                        {messageFromChatHistory?.reactions.value.map(
                                            (reaction: any, idx: number) => {
                                                return (
                                                    <Text key={idx}>
                                                        {convertCodeToEmoji(
                                                            reaction
                                                        )}
                                                    </Text>
                                                );
                                            }
                                        )}
                                        {
                                            <Text>
                                                {messageFromChatHistory
                                                    ?.reactions.total > 1
                                                    ? messageFromChatHistory
                                                          ?.reactions.total
                                                    : ""}
                                            </Text>
                                        }
                                    </View>
                                ) : null}
                            </View>
                            {isChoosedMessage && (
                                <Animated.View
                                    style={[
                                        styles.generalReaction,
                                        isMyMessage
                                            ? styles.rightReaction
                                            : styles.leftReaction,
                                    ]}
                                >
                                    <Animated.Text
                                        onPress={(e) => {
                                            sendReaction("<3");
                                            setOpenMenu(false);
                                        }}
                                        onPressOut={handlePressOut}
                                        onLongPress={handleLongPress}
                                        style={[
                                            styles.reactionText,
                                            {
                                                transform: [
                                                    { scale: scaleValue },
                                                ],
                                            },
                                        ]}
                                    >
                                        ❤️
                                    </Animated.Text>
                                    <Animated.Text
                                        onPress={(e) => {
                                            sendReaction(":+1:");
                                            setOpenMenu(false);
                                        }}
                                        style={styles.reactionText}
                                    >
                                        👍
                                    </Animated.Text>
                                    <Animated.Text
                                        onPress={(e) => {
                                            sendReaction(":D");
                                            setOpenMenu(false);
                                        }}
                                        style={styles.reactionText}
                                    >
                                        😀
                                    </Animated.Text>
                                    <Animated.Text
                                        onPress={(e) => {
                                            sendReaction(":joy:");
                                            setOpenMenu(false);
                                        }}
                                        style={styles.reactionText}
                                    >
                                        😂
                                    </Animated.Text>
                                    <Animated.Text
                                        onPress={(e) => {
                                            sendReaction(":heart_eyes:");
                                            setOpenMenu(false);
                                        }}
                                        style={styles.reactionText}
                                    >
                                        😍
                                    </Animated.Text>
                                    <Animated.Text
                                        onPress={(e) => {
                                            sendReaction(":rage:");
                                            setOpenMenu(false);
                                        }}
                                        style={styles.reactionText}
                                    >
                                        😡
                                    </Animated.Text>
                                    {/* <Animated.Text style={styles.reactionText}>
                                    ➕
                                </Animated.Text> */}
                                </Animated.View>
                            )}
                        </View>
                    </View>
                </Swipeable>
            ) : (
                <Swipeable
                    ref={updateRowRef}
                    friction={2}
                    rightThreshold={40}
                    renderLeftActions={renderRightAction}
                    onSwipeableWillOpen={onSwipeOpenAction}
                >
                    <View style={{ marginBottom: isChoosedMessage ? 50 : 0 }}>
                        <View
                            style={{
                                display: "flex",
                                marginBottom:
                                    messageFromChatHistory?.reactions.total > 0
                                        ? 15
                                        : 0,
                            }}
                        >
                            <Message {...props}></Message>
                            {messageFromChatHistory?.reactions.total > 0 ? (
                                <View
                                    style={[
                                        {
                                            display: "flex",
                                            flexDirection: "row",
                                            position: "absolute",
                                            bottom: -10,
                                            backgroundColor: "white",
                                            borderRadius: 50,
                                            paddingHorizontal: 4,
                                            paddingVertical: 1,
                                        },
                                        isMyMessage
                                            ? { right: 10 }
                                            : { left: 50 },
                                    ]}
                                >
                                    {messageFromChatHistory?.reactions.value.map(
                                        (reaction: any, idx: number) => {
                                            return (
                                                <Text key={idx}>
                                                    {convertCodeToEmoji(
                                                        reaction
                                                    )}
                                                </Text>
                                            );
                                        }
                                    )}
                                    {
                                        <Text>
                                            {messageFromChatHistory?.reactions
                                                .total > 1
                                                ? messageFromChatHistory
                                                      ?.reactions.total
                                                : ""}
                                        </Text>
                                    }
                                </View>
                            ) : null}
                        </View>
                        {isChoosedMessage && (
                            <Animated.View
                                style={[
                                    styles.generalReaction,
                                    isMyMessage
                                        ? styles.rightReaction
                                        : styles.leftReaction,
                                ]}
                            >
                                <Animated.Text
                                    onPress={(e) => {
                                        sendReaction("<3");
                                        setOpenMenu(false);
                                    }}
                                    onPressOut={handlePressOut}
                                    onLongPress={handleLongPress}
                                    style={[
                                        styles.reactionText,
                                        { transform: [{ scale: scaleValue }] },
                                    ]}
                                >
                                    ❤️
                                </Animated.Text>
                                <Animated.Text
                                    onPress={(e) => {
                                        sendReaction(":+1:");
                                        setOpenMenu(false);
                                    }}
                                    style={styles.reactionText}
                                >
                                    👍
                                </Animated.Text>
                                <Animated.Text
                                    onPress={(e) => {
                                        sendReaction(":D");
                                        setOpenMenu(false);
                                    }}
                                    style={styles.reactionText}
                                >
                                    😀
                                </Animated.Text>
                                <Animated.Text
                                    onPress={(e) => {
                                        sendReaction(":joy:");
                                        setOpenMenu(false);
                                    }}
                                    style={styles.reactionText}
                                >
                                    😂
                                </Animated.Text>
                                <Animated.Text
                                    onPress={(e) => {
                                        sendReaction(":heart_eyes:");
                                        setOpenMenu(false);
                                    }}
                                    style={styles.reactionText}
                                >
                                    😍
                                </Animated.Text>
                                <Animated.Text
                                    onPress={(e) => {
                                        sendReaction(":rage:");
                                        setOpenMenu(false);
                                    }}
                                    style={styles.reactionText}
                                >
                                    😡
                                </Animated.Text>
                                {/* <Animated.Text style={styles.reactionText}>
                                    ➕
                                </Animated.Text> */}
                            </Animated.View>
                        )}
                    </View>
                </Swipeable>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 40,
    },
    replyImageWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    replyImage: {
        width: 20,
        height: 20,
    },
    defaultBottomOffset: {
        marginBottom: 2,
    },
    bottomOffsetNext: {
        marginBottom: 10,
    },
    leftOffsetValue: {
        marginLeft: 16,
    },
    generalReaction: {
        display: "flex",
        flexDirection: "row",
        bottom: -40,
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    rightReaction: {
        right: 30,
    },
    leftReaction: {
        left: 50,
    },
    reactionText: {
        fontSize: 30,
    },
    displayRightReaction: {
        right: 10,
    },
    displayLeftReactTion: {
        left: 50,
    },
});

export default ChatMessageBox;

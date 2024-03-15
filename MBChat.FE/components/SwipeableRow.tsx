import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

interface SwipeableRowProps {
  screen: "Update" | "Calls" | "Communities" | "Chats" | "Settings";
  handleDelete?: () => void;
  handleMore?: () => void;
  handleArchive?: () => void;
  children?: React.ReactNode;
}

export default class SwipeableRow extends Component<SwipeableRowProps> {
  private renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    onPress?: () => void,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {
      if (onPress) {
        onPress();
        this.close();
      }
    };
    
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
          <Ionicons
            name={text === 'More' ? 'ellipsis-horizontal' : 'archive'}
            size={24}
            color={'#fff'}
            style={{ paddingTop: 10 }}
          />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => {
    const { screen, handleDelete, handleMore, handleArchive } = this.props;

    let rightActions: JSX.Element | null = null;

    switch (screen) {
      case 'Calls':
        rightActions = (
          <View
            style={{
              width: 192,
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            }}>
            {this.renderRightAction('Delete', '#dd2c00', 300, progress, handleDelete)}
          </View>
          )
        break;
      case 'Chats':
        rightActions = (
          <View
            style={{
              width: 192,
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            }}>
            {this.renderRightAction('More', '#C8C7CD', 192, progress, handleMore)}
            {this.renderRightAction('Archive', COLORS.light.muted, 128, progress, handleArchive)}
          </View>
          )
        break;
      // Add cases for other screens if needed

      default:
        break;
      }

    return (
      <View
        style={{
          width: 192,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
          {rightActions}
      </View>
    );
  }

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };
  private close = () => {
    this.swipeableRow?.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={this.renderRightActions}
        >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
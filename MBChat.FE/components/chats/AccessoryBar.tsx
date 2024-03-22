import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'

import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from './mediaUtils'
import { COLORS } from '@/constants/Colors';

interface ButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  name?: string;
  props?: any;
}


export default class AccessoryBar extends React.Component<any> {
  render() {
    const { onSend } = this.props

    return (
      <>
        <Button onPress={() => pickImageAsync(onSend)} name='images-outline' />
        <Button onPress={() => takePictureAsync(onSend)} name='camera-outline' />
      </>
    )
  }
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  size = 24,
  color = COLORS.light.primary,
  name,
  ...props
}) => (
  <Pressable onPress={onPress}>
    <Ionicons size={size} color={color} name={name as any} {...props}/>
  </Pressable>
)
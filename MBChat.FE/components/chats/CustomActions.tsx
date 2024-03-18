import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { useActionSheet } from '@expo/react-native-action-sheet'
import {
  getLocationAsync,
  pickImageAsync,
  takePictureAsync,
} from './mediaUtils'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/Colors'

interface Props {
  renderIcon?: () => React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  onSend: (messages: any) => void
}

const CustomActions = ({
  renderIcon,
  containerStyle,
  onSend,
}: Props) => {
  const { showActionSheetWithOptions } = useActionSheet()

  const onActionsPress = useCallback(() => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ]
    const cancelButtonIndex = options.length - 1
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            pickImageAsync(onSend)
            return
          case 1:
            takePictureAsync(onSend)
            return
          case 2:
            getLocationAsync(onSend)
            return
        }
      },
    )
  }, [showActionSheetWithOptions])

  const renderIconComponent = useCallback(() => {
    if (renderIcon) {
      return renderIcon()
    }
    return (
      <View style={{ height: 44, justifyContent: 'center', alignItems: 'center', left: 5 }}>
        <Ionicons name="add" color={COLORS.light.primary} size={28} />
      </View>
    )
  }, [])

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onActionsPress}
    >
      <>{renderIconComponent()}</>
    </TouchableOpacity>
  )
}

export default CustomActions

const styles = StyleSheet.create({
  container: {
    width: 33,
    height: 44,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
}

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  renderIcon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
}

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  renderIcon: PropTypes.func,
  containerStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  iconTextStyle: PropTypes.object,
};

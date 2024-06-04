import { COLORS } from '@/constants/Colors';
import { Stack } from 'expo-router';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import NoDataPage from '@/components/NoData';
import { useCallback, useEffect, useState } from 'react';
import { ChatContext } from '@/context/chatContext';
import { SegmentedControl } from '@/components/SegmentedControl';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import * as Haptics from 'expo-haptics';
import MessageApi from '@/api/MessageApi';

const transition = CurvedTransition.delay(100);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NoDataProps = {
  iconName: 'image' | 'link' | 'document',
  noDataTitle: string,
  noDataGuild: string,
}

type ImageProps = { imageUrl: string };

const Page = () => {
  const chatContext = React.useContext(ChatContext);

  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { chats } = chatContext;

  const [selectedOption, setSelectedOption] = useState('Medias');

  const [noData, setNoData] = useState<NoDataProps>({
    iconName: 'image',
    noDataTitle: 'Không có tệp phương tiện',
    noDataGuild: `Nhấn vào dấu + để chia sẻ tệp phương tiện với ${chats.from}`
  });

  const [isEditing, setIsEditing] = useState(false);
  const editing = useSharedValue(-30);

  const onSegmentChange = useCallback((option: string) => {
    setSelectedOption(option);
    if (option === 'Medias') {
      // TO-DO: show media data

      setNoData(prevNoData => ({
        ...prevNoData,
        iconName: 'image',
        noDataTitle: 'Không có tệp phương tiện',
        noDataGuild: `Nhấn vào dấu + để chia sẻ tệp phương tiện với ${chats.from}`
      }));
    } else if (option === 'Links') {
      // TO-DO: show link data

      setNoData(prevNoData => ({
        ...prevNoData,
        iconName: 'link',
        noDataTitle: 'Không có liên kết',
        noDataGuild: `Liên kết bạn gửi và nhận với ${chats.from} sẽ xuất hiện ở đây`
      }));
    } else {
      // TO-DO: show files data

      setNoData(prevNoData => ({
        ...prevNoData,
        iconName: 'document',
        noDataTitle: 'Không có tài liệu',
        noDataGuild: `Nhấn vào dấu + để chia sẻ tài liệu với ${chats.from}`
      }));
    }
  }, [setSelectedOption, setNoData]);

  const removeCall = (toDelete: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // setItems(items.filter((item) => item.id !== toDelete.id));
  };

  const onEdit = () => {
    let editingNew = !isEditing;
    editing.value = editingNew ? 0 : -30;
    setIsEditing(editingNew);
  };

  const animatedRowStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  const animatedPosition = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(editing.value) }],
  }));

  const [dataImage, setDataImage] = React.useState([]);

  useEffect(() => {
    const getDataImage = async () => {
      const response = (await MessageApi.getImage(1)).data;
      setDataImage(response.data)
    }
    getDataImage();
  }, [])

  const [selectedImage, setSelectedImage] = React.useState('');

  const handlePress = (image: any) => {
    setSelectedImage(image);
  };

  const ImageMedia = ({ imageUrl }: ImageProps) => {
    return (
      <Pressable style={styles.wapperImage} onPress={() => handlePress (imageUrl)}>
        <Image
          style={styles.imageMedia}
          source={{
            uri: imageUrl
          }}
        />
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.light.background }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerTitle: () => (
            <SegmentedControl
              options={['Medias', 'Links', 'Files']}
              selectedOption={selectedOption}
              onOptionPress={onSegmentChange}
            />
          ),
        }}
      />
      <FlatList
        numColumns={3}
        data={dataImage}
        renderItem={({ item }) => <ImageMedia imageUrl={item} />}
      />
      <Modal
        visible={selectedImage !== ''}
        style={{ display: 'flex' }}
      >
        <Pressable
            style={styles.closeButton}
            onPress={() => setSelectedImage('')}
          >
            <Ionicons
              name='close'
              size={30}
              color={'#fff'}
            />
          </Pressable>
        <View style={styles.modalContainer}>
          <Image
            style={styles.fullImage}
            source={{ uri: selectedImage }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  wapperImage: {
    width: '33%',
    height: 160,
    borderWidth: 2,
    borderColor: 'black'
  },
  imageMedia: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  closeButton: {
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: '#000',
    alignItems: 'flex-start',
  },
});
export default Page;
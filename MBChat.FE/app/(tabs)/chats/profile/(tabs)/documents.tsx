import { COLORS } from '@/constants/Colors';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import NoDataPage from '@/components/NoData';
import { useCallback, useState } from 'react';
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

const transition = CurvedTransition.delay(100);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NoDataProps = {
  iconName: 'image' | 'link' | 'document',
  noDataTitle: string,
  noDataGuild: string,
}

const Page = () => {
  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { chats } = chatContext;

  const [selectedOption, setSelectedOption] = useState('Medias');
  const [items, setItems] = useState();
  
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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.light.background }}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SegmentedControl
              options={['Medias', 'Links', 'Files']}
              selectedOption={selectedOption}
              onOptionPress={onSegmentChange}
            />
          ),
        }}
      />
      {items ? 
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 40 }}>
          <Animated.View style={[defaultStyles.block]} layout={transition}>
            <Animated.FlatList
              skipEnteringExitingAnimations
              data={items}
              scrollEnabled={false}
              itemLayoutAnimation={transition}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={defaultStyles.separator} />}
              renderItem={({ item, index }) => (
                <Animated.View
                  entering={FadeInUp.delay(index * 20)}
                  exiting={FadeOutUp}
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AnimatedPressable
                    style={[animatedPosition, { paddingLeft: 8 }]}
                    // onPress={() => removeCall(item)}
                  >
                    <Ionicons name="remove-circle" size={24} color={COLORS.red} />
                  </AnimatedPressable>

                  <Animated.View
                    style={[defaultStyles.item, { paddingLeft: 20 }, animatedRowStyles]}>
                    <Image source={{ uri: item.img }} style={styles.avatar} />

                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={{ fontSize: 18, color: item.missed ? COLORS.red : '#000' }}>
                        {item.name}
                      </Text>

                      <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons
                          name={item.video ? 'videocam' : 'call'}
                          size={16}
                          color={COLORS.gray}
                        />
                        <Text style={{ color: COLORS.gray, flex: 1 }}>
                          {item.incoming ? 'Incoming' : 'Outgoing'}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 6,
                        alignItems: 'center',
                      }}>
                      <Text style={{ color: COLORS.gray }}>{format(item.date, 'MM.dd.yy')}</Text>
                      <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color={COLORS.light.primary}
                      />
                    </View>
                  </Animated.View>
                </Animated.View>
              )}
            />
          </Animated.View>
        </ScrollView>
      :
        <NoDataPage 
        noData={noData}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
export default Page;
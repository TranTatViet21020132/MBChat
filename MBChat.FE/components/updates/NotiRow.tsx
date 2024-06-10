import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { defaultStyles } from '@/constants/Styles';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { Noti, User } from '@/app/(tabs)/updates';

export type NotiRowProps = {
  sender: User;
  notification_type: string;
  status: string;
  create_at: string;
  onAccept: (sender: User) => void;
  onDeny: (sender: User) => void;
  calculateTimeDifference: (createAt: string) => string;
};

const NotiRow: React.FC<NotiRowProps> = (
  { sender,
    create_at,
    onAccept,
    onDeny,
    calculateTimeDifference
  }) => {
  return (
    <>
      <View style={styles.listItemContainer}>
        <View style={styles.leftItem}>
          <Image source={{ uri: sender.avatar_url }} style={styles.listItemImage} />
          <View style={styles.labelTimestamps}>
            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>{sender.fullname}</Text>
            <Text style={{ color: '#aaaaaa', fontSize: 12 }}>
              {calculateTimeDifference(create_at)}
            </Text>
          </View>
        </View>

        <View style={styles.rightItem}>
          <AntDesign
            name="checkcircle"
            style={styles.acpIcon}
            size={22}
            onPress={() => onAccept(sender)}
          />

          <AntDesign
            name="closecircleo"
            size={22}
            onPress={() => onDeny(sender)}
          />
        </View>
      </View>

      <View style={[defaultStyles.separator, { marginLeft: 60 }]} />
    </>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingLeft: 14,
    paddingRight: 64,
    backgroundColor: '#fff',
  },

  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  labelTimestamps: {
    flex: 1,
    flexDirection: "column",
    textAlign: "left",
  },

  rightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  acpIcon: {
    color: COLORS.light.primary,
  },

  listItemImage: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },
});

export default NotiRow;

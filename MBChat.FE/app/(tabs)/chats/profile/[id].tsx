import { StyleSheet, Image, Pressable } from 'react-native'
import { View, Text } from '@/components/Themed'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import { ChatContext } from '@/context/chatContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
 
type DataProps = {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
}

type ChatProfileProps = {
  data: DataProps;
}

type MenuItem = {
  id: string;
  iconName: 'document-outline' | 'image-outline' | 'notifications-outline' 
  | 'search-outline' | 'people-outline' | 'remove-circle-outline'
  | 'warning-outline';
  iconColor: string;
  titleKey: string;
}

const menuItems: MenuItem[] = [
  { id: '1', iconName: 'document-outline', iconColor: '#0a79ee', titleKey: 'profile.menu.documents' },
  { id: '2', iconName: 'image-outline', iconColor: '#0cb0a5', titleKey: 'profile.menu.backgrounds' },
  { id: '3', iconName: 'notifications-outline', iconColor: '#28c75c', titleKey: 'profile.menu.notifications' },
  { id: '4', iconName: 'search-outline', iconColor: '#5765f2', titleKey: 'profile.menu.search' },
  { id: '5', iconName: 'people-outline', iconColor: '#40a6e0', titleKey: 'profile.menu.newGroup' }
]

const supportItems: MenuItem[] = [
  { id: '1', iconName: 'remove-circle-outline', iconColor: '#f23d37', titleKey: 'profile.menu.block' },
  { id: '2', iconName: 'warning-outline', iconColor: '#f0c910', titleKey: 'profile.menu.report' },
]

const ChatProfile = () => {
  const { t } = useTranslation();

  const chatContext = React.useContext(ChatContext);
  
  if (!chatContext || !chatContext.setChats) {
    return null;
  }

  const { chats } = chatContext;

  return (
    <View style={styles.container}>
      <Header data={chats}/>

      <View
      style={styles.items}
      lightColor='#fff'
      >
      {menuItems.map((menuItem) => (
        <Pressable key={menuItem.id} style={styles.item}>
          <View style={{ ...styles.itemIcon, backgroundColor: menuItem.iconColor }}>
            <Ionicons name={menuItem.iconName} size={24} color={'#fff'} />
          </View>
          <View
          style={styles.itemTitle}
          lightColor='#fff'
          >
            <Text style={{ fontSize: 16 }} lightColor='#000'>
              {t(menuItem.titleKey)}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
          </View>
        </Pressable>
      ))}
      </View>

      <View
      style={styles.items}
      lightColor='#fff'
      >
      {supportItems.map((supportItem) => (
        <Pressable key={supportItem.id} style={styles.item}>
          <View style={{ ...styles.itemIcon, backgroundColor: supportItem.iconColor }}>
            <Ionicons name={supportItem.iconName} size={24} color={'#fff'} />
          </View>
          <View
          style={styles.itemTitle}
          lightColor='#fff'
          >
            <Text style={{ fontSize: 16 }} lightColor='#000'>
              {t(supportItem.titleKey)}
            </Text>
            <MaterialCommunityIcons name='chevron-right' size={24} color={COLORS.light.text} />
          </View>
        </Pressable>
      ))}
      </View>
    </View>
  );
}

const Header = ({ data }: ChatProfileProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Image 
          style={{
            width: 120,
            height: 120,
            borderRadius: 9999,
          }}
          source={{
            uri: data.img
          }}
        />
      </View>
      <Text style={styles.phoneNumber} lightColor='#000'>+84 979235038</Text>
      <Text style={styles.userName}>{data.from}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
   paddingRight: 20,
   paddingLeft: 20,
   paddingTop: 20,
   backgroundColor: COLORS.light.background,
   flex: 1
  },
  header: {
    backgroundColor: COLORS.light.background,
    width: '100%',
    height: 200,
    alignItems: 'center',
    marginBottom: 10
  },
  avatar: {
    borderBottomColor: COLORS.light.settings.backgroudColor,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.lightGray
  },
  phoneNumber: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 5
  },
  userName: {
    fontSize: 16,
    color: COLORS.gray,
  },
  item: {
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.settings.backgroudColor,
  },
  itemIcon: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    padding: 2
  },
  itemTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  items: {
    marginBottom: 28,
    borderRadius: 10,
  }
})

export default ChatProfile;
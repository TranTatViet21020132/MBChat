import { View, Text, ScrollView, FlatList } from 'react-native'
import { defaultStyles } from "@/constants/Styles";
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { RootState } from '@/store/store';
import FriendApi from '@/api/FriendApi';
import NotiRow from '@/components/updates/NotiRow';

export type User = {
  id: number,
  username: string,
  avatar_url?: string,
  first_name: string,
  last_name: string,
  fullname: string,
  isFriend?: boolean,
  hasSentFriendRq?: boolean;
}

export type Noti = {
  sender: User;
  notification_type: string;
  status: string,
  create_at: string;
}

const Updates = () => {
  const socket: WebSocket | null = useSelector((state: RootState) => state.websocket.socket);
  
  const [userNoti, setUserNoti] = useState<Noti[]>([]);

  useEffect(() => {
    const getUserNotis = async () => {
      try {
        const userNotiRes = (await FriendApi.getUserNotis()).data.data;
        console.log((await FriendApi.getUserNotis()).data.data);
        const filteredUserNoti = userNotiRes?.filter((noti: Noti) => noti.status === "PENDING");
        setUserNoti(filteredUserNoti);
      } catch (error) {
        console.log(error);
      }
    };

    getUserNotis();

    const handleSocketMessage = (e: MessageEvent) => {
      const serverMessage = JSON.parse(e.data);
      const newFriendRequest = serverMessage.data;

      if (serverMessage.action === "friend_request") {
        if (!userNoti.some((noti) => noti.sender.id === newFriendRequest.sender.id)) {
          setUserNoti((prevNoti) => [newFriendRequest, ...prevNoti]);

          Toast.show({
            type: 'info',
            text1: `${newFriendRequest.sender.username} sent you a friend request!`,
            text2: 'Check for notifications in the update tab',
          });
        }
      }

      if (serverMessage.action === "friend_accept") {
        Toast.show({
          type: 'info',
          text1: `${newFriendRequest.sender.username} has accepted your friend request!`,
          text2: 'Check for notifications in the update tab',
        });
      }

      if (serverMessage.action === "friend_deny") {
      }
    };

    // Add event listener when component mounts
    socket && socket.addEventListener("message", handleSocketMessage);

    // Remove event listener when component unmounts
    return () => {
      socket && socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket]);
  
  const handleAcceptRequest = async (sender: User) => {
    try {
      if (!socket) {
        console.error('WebSocket connection is not available');
        return;
      }

      const friendAcp = {
        action: "friend_accept",
        target: "both",
        targetId: sender.id
      };

      socket.send(JSON.stringify(friendAcp));

      setUserNoti((prevNoti) => prevNoti.filter((noti) => noti.sender.id !== sender.id));

      console.log("You have accepted!");
    } catch (error) {
      console.error("Error sending/canceling accepting friend request:", error);
    }
  };

  const handleDenyRequest = async (sender: User) => {
    try {
      if (!socket) {
        console.error('WebSocket connection is not available');
        return;
      }

      const friendDeny = {
        action: "friend_deny",
        target: "user",
        targetId: sender.id
      };

      socket.send(JSON.stringify(friendDeny));

      setUserNoti((prevNoti) => prevNoti.filter((noti) => noti.sender.id !== sender.id));

      console.log("You have denied!");
    } catch (error) {
      console.error("Error sending/canceling denying friend request:", error);
    }
  };

  const calculateTimeDifference = (createAt: string): string => {
    const currentTime = new Date();
    const requestTime = new Date(createAt);
    const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - requestTime.getTime()) / 1000);
  
    if (timeDifferenceInSeconds < 60) {
      return 'Just now';
    }
  
    const minute = 60;
    const hour = 3600;
    const day = 86400;
  
    if (timeDifferenceInSeconds < minute) {
      return 'Right now';
    } else if (timeDifferenceInSeconds < hour) {
      const minutes = Math.floor(timeDifferenceInSeconds / minute);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (timeDifferenceInSeconds < day) {
      const hours = Math.floor(timeDifferenceInSeconds / hour);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(timeDifferenceInSeconds / day);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: 0,
          flex: 1,
          backgroundColor: "#fff",
      }}
    >
      <FlatList
        data={userNoti}
        renderItem={({ item }) => 
          <NotiRow
            {...item}
            onAccept={()=> {
              if (item.sender) {
                handleAcceptRequest(item.sender)
              }
            }}
            onDeny={() => {
              if(item.sender) {
                handleDenyRequest(item.sender)
              }
            }}
            calculateTimeDifference={calculateTimeDifference}
          />
        }
        keyExtractor={(item) => item.sender.id.toString()}
        ItemSeparatorComponent={() => (
          <View
            style={[defaultStyles.separator, { marginLeft: 90 }]}
          />
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  )
}

export default Updates
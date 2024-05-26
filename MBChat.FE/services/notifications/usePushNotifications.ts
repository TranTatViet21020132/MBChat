import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import messaging from '@react-native-firebase/messaging';
import { Platform } from "react-native";
import { router } from "expo-router";
import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid } from "react-native";
import { useNavigation } from "expo-router";
const options = {
  ios: {
    appName: 'My app name',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    additionalPermissions: [],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.company.my',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    }, 
  }
};

RNCallKeep.setup(options).then(accepted => {});
export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // const { title, body } = remoteMessage.notification;
    Notifications.scheduleNotificationAsync({
        content: {
          title: 'Incoming Call',
          body: 'You have an incoming call.',
          categoryIdentifier: 'call',
        },
        trigger: null,
      });
});

export const usePushNotifications = (): PushNotificationState => {
    const navigation = useNavigation();
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false
        })
    });

    const [expoPushToken, setExpoPushToken] = useState<
        Notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    async function registerForPushNotificationsAsync() {
        let token;

            const {status: existingStatus} = await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token")
            }
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            })

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C"
                })
            }
            console.log(token);
            return token;

    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("response", response);
            const actionIdentifier = response.actionIdentifier;
            setTimeout(() => {
                router.navigate("/verify/login")
            }, 5000);
        });

        const categoryIdentifier = 'call';
        Notifications.setNotificationCategoryAsync(categoryIdentifier, [
            {
            identifier: 'call',
            buttonTitle: '📞 Call',
            options: {
                opensAppToForeground: true,
            },
            },
            {
            identifier: 'cancel',
            buttonTitle: '❌ Cancel',
            options: {
                opensAppToForeground: false,
            },
            },
        ]);

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current!)

            Notifications.removeNotificationSubscription(responseListener.current!);
        }
    }, [])

    return {
        expoPushToken,
        notification
    }
}
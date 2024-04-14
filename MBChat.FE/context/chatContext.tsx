import React, { ReactNode } from 'react';
import { ImageRequireSource, ImageURISource } from 'react-native';

export type ChatContextType = {
  chats: ChatData;
  setChats: React.Dispatch<React.SetStateAction<ChatData>>;
  bgUrl: ImageURISource;
  setBgUrl: React.Dispatch<React.SetStateAction<ImageURISource>>;
};

export interface ChatData {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
}

export const ChatContext = React.createContext<ChatContextType | null>(null);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = React.useState<ChatData>(
    {
      id: "",
      from: "",
      date: "",
      img: "",
      msg: "",
      read: false,
      unreadCount: 0,
    }
  );

  const [bgUrl, setBgUrl] = React.useState<ImageURISource>(require("@/assets/images/backgrounds/Default.png"));

  return (
    <ChatContext.Provider value={{ chats, setChats, bgUrl, setBgUrl }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

import React, { useContext } from 'react';

export type ChatContextType = {
  chats: ChatData;
  setChats: React.Dispatch<React.SetStateAction<ChatData>>;
  chatTheme: string;
  setChatTheme: React.Dispatch<React.SetStateAction<string>>
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

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [chatTheme, setChatTheme] = React.useState('light');

  return (
    <ChatContext.Provider value={{ chats, setChats, chatTheme, setChatTheme }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return React.useContext(ChatContext);
}

import React from 'react';

export type ChatContextType = {
  chats: ChatData;
  setChats: React.Dispatch<React.SetStateAction<ChatData>>;
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

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

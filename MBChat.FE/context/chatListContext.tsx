import React from 'react';
import { WebsocketContext } from './WebsocketContext';

export type ChatListContextType = {
    chatList: Array<ChatData>;
    setChatList: React.Dispatch<React.SetStateAction<Array<ChatData>>>;
}

export interface ChatData {
    id: string;
    from: string;
    date: string;
    img: string;
    msg: string;
    read: boolean;
    unreadCount: number;
}

export const ChatListContext = React.createContext<ChatListContextType | null>(null);

const ChatListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [chatList, setChatList] = React.useState<Array<ChatData>>(
        []
      );
    
    React.useEffect(() => {
    })

    return (
        <ChatListContext.Provider value={{chatList, setChatList}}>
            {children}
        </ChatListContext.Provider>
    )

}

export default ChatListProvider
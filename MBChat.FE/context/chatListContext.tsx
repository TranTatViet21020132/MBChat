import React from 'react';

export type ChatListContextType = {
    chatList: Array<ChatData>;
    setChatList: React.Dispatch<React.SetStateAction<Array<ChatData>>>;
    chatHistory: Record<string, Array<ChatHistoryData>>,
    setChatHistory: React.Dispatch<React.SetStateAction<Record<string, Array<ChatHistoryData>>>>;
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

export interface ChatHistoryData {
    _id: number,
    text: string,
    createdAt: Date,
    user: {
        _id: number,
        name: string
    },
    location?: string
}

export const ChatListContext = React.createContext<ChatListContextType | null>(null);

const ChatListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [chatList, setChatList] = React.useState<Array<ChatData>>(
        []
      );
    const [chatHistory, setChatHistory] = React.useState<Record<string, Array<ChatHistoryData>>>(
        {}
    )
    
    return (
        <ChatListContext.Provider value={{chatList, setChatList, chatHistory, setChatHistory}}>
            {children}
        </ChatListContext.Provider>
    )

}

export default ChatListProvider
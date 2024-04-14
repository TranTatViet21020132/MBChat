import React from 'react';
import { ChatListContext } from './chatListContext';
import { UserContext } from './userContext';
import { ChatHistoryData } from './chatListContext';
export type WebsocketContextType = {
    websocket: WebSocket | null;
    setWebsocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
}

export const WebsocketContext = React.createContext<WebsocketContextType | null>(null);

enum Action {
    GET_CHAT_LIST = 'get_chat_list',
    GET_COMMUNITY_LIST = 'get_community_list',
    GET_PROFILE = 'get_profile',
    GET_MESSAGE_LIST = 'get_message_list',
    SEND_MESSAGE = 'send_message',
}


const WebsocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
    const chatListContext = React.useContext(ChatListContext);
    const userContext = React.useContext(UserContext);
    let new_chat_history ;
    
    const updateChatHistory = React.useCallback((targetId: string, newMessages: any[]) => {
        // Handle potential missing chatListContext
        const currentChatHistory = chatListContext?.chatHistory || {};
    
        const updatedChatHistory = {
          ...currentChatHistory,
          [targetId]: [...(currentChatHistory[targetId] || []), ...newMessages],
        };
    
        if (chatListContext) {
          chatListContext.setChatHistory(updatedChatHistory);
        }
      }, [chatListContext]);
    
    const onmessageFunction = () => {
        return (event: MessageEvent) => {
            const response = JSON.parse(event.data);
            let data;
            if (response.status === 200 || !response.status) {
                switch(response.action) {
                    case Action.GET_CHAT_LIST:
                        data = response.data.map((item: any) => {
                            return {
                                "id": item.id,
                                "from": item.title,
                                "date": "Wed May 20 1998 08:53:35 GMT+0200 (Central European Summer Time)",
                                "img": item.avatar_url,
                                "msg": "empty",
                                "read": false,
                                "unreadCount": 2
                            }
                        })
                        chatListContext?.setChatList([
                            {
                                "id": "16d121b0-bad3-475a-a1d3-57060a25e3ch",
                                "from": "Baxter",
                                "date": "Wed May 20 1998 08:53:35 GMT+0200 (Central European Summer Time)",
                                "img": "https://i.pravatar.cc/150?u=baxterduke@marketoid.com",
                                "msg": "Commodo tempor consequat elit in sit sint cillum magna laborum laborum veniam ea exercitation quis.",
                                "read": false,
                                "unreadCount": 2
                              },
                              ...data
                        ]);
                        break;
                    case Action.GET_COMMUNITY_LIST:
                        break;
                    case Action.GET_PROFILE:
                        data = response.data;
                        if (userContext) {
                            userContext.userInfomation = {
                                "id": data.user.id,
                                "username": data.user.username,
                                "avatarUrl": data.avatar_url,
                                "fullname": data.user.fullname,
                                "verified": true
                            }
                        }
                        userContext?.setUserInformation({
                            "id": data.user.id,
                            "username": data.user.username,
                            "avatarUrl": data.avatar_url,
                            "fullname": data.user.fullname,
                            "verified": true
                        })
                        break;
                    case Action.GET_MESSAGE_LIST:
                        data = response.data;
                        let chat_history_object_array = response.data.map((message: any, idx: number) => {
                            return {
                                "_id": idx + 1,
                                "text": message.content,
                                "createdAt": message.create_at,
                                "user": {
                                    "_id": userContext?.userInfomation.id === message.member.user.id ? 1 : 2,
                                    "name": message.member.user.fullname
                                }
                            }
                        });
                        new_chat_history = {...chatListContext?.chatHistory}
                        new_chat_history[response.targetId] = chat_history_object_array
                        if (chatListContext) {
                            chatListContext.chatHistory = new_chat_history;
                        }
                        chatListContext?.setChatHistory(
                            new_chat_history
                        )
                        
                        break;
                    case Action.SEND_MESSAGE:
                        data = response.data;

                        let chat_history_object = {
                            "_id": data.id,
                            "text": data.content,
                            "createdAt": new Date(),
                            "user": {
                                "_id": userContext?.userInfomation.id === data.member.user.id ? 1 : 2,
                                "name": data.member.user.fullname
                            }
                        }

                        new_chat_history = {...chatListContext?.chatHistory}
                        new_chat_history[response.targetId].unshift(chat_history_object);
                        if (chatListContext) {
                            chatListContext.chatHistory = new_chat_history;
                        }
                        chatListContext?.setChatHistory(
                            new_chat_history
                        )
                            
                        break
                }
            }
        }
    }

    React.useEffect(() => {
        if (websocket) {
            websocket.onmessage = onmessageFunction();
            
            return () => {
                websocket.close();
            }
        }
    }, [websocket])
    return <WebsocketContext.Provider value={{websocket, setWebsocket}}>
        {children}
    </WebsocketContext.Provider>
};

export default WebsocketProvider;
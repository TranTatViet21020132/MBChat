import React from 'react';
import { ChatListContext } from './chatListContext';

export type WebsocketContextType = {
    websocket: WebSocket | null;
    setWebsocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
}

export const WebsocketContext = React.createContext<WebsocketContextType | null>(null);

enum Action {
    GET_CHAT_LIST = 'get_chat_list',
    GET_COMMUNITY_LIST = 'get_community_list',
    GET_PROFILE = 'get_profile',
}


const WebsocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
    const chatListContext = React.useContext(ChatListContext);
    
    
    const onmessageFunction = () => {
        return (event: MessageEvent) => {
            const response = JSON.parse(event.data);
            if (response.status === 200) {
                switch(response.action) {
                    case Action.GET_CHAT_LIST:
                        let data = response.data.map((item: any) => {
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
                        break;
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
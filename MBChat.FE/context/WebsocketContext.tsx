import React from 'react';

export type WebsocketContextType = {
    websocket: WebSocket | null;
    setWebsocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
}

export const WebsocketContext = React.createContext<WebsocketContextType | null>(null);

const WebsocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
    React.useEffect(() => {
        if (websocket) {
            console.log("Open websocket");
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
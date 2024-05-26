import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "@/store/websocket/websocketSlice";
import userReducer from "@/store/user/userSlice";
import chatReducer from "@/store/chat/chatSlice";
import webrtcReducer from "@/store/webrtc/webrtcSlice";
export const store = configureStore({
    reducer: {
        websocket: websocketReducer,
        user: userReducer,
        chat: chatReducer,
        webrtc: webrtcReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

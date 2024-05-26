import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import { BASE_DOMAIN } from '@/constants/ApiUrl';
import onmessageFunction from "./handleOnMessage";
interface WebsocketState {
    socket: WebSocket | null;
}

const initialState: WebsocketState = {
    socket: null
}

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        setWebsocket: (state, action: PayloadAction<WebSocket>) => {
            state.socket = action.payload;
        },
        disconnectWebsocket: (state) => {
            if (state.socket) {
                state.socket.close();
                console.log("Connection is closed");
            }
        },
        sendAction: (state, action: PayloadAction<Object>) => {
            state.socket?.send(JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(connectWebsocket.fulfilled, (state, action) => {
            if (action.payload) {
                state.socket = action.payload;

                console.log("Websocket connection is connected");
            }
        })
    }
})

export const connectWebsocket = createAsyncThunk(
    'websocket/connectWebsocket',
    async (_, {getState, dispatch}) => {
        let token = await SecureStore.getItemAsync('accessToken');
        // @ts-ignore
        const socket = getState().websocket.socket;
        if (token && !socket) {
            const socket = await new WebSocket(`ws://${BASE_DOMAIN}/ws/chat/?token=${token}`);
            socket.onmessage = await onmessageFunction(getState, dispatch);
            return socket;
        }
        return null;
    }
)

export const {disconnectWebsocket} = websocketSlice.actions;

export default websocketSlice.reducer;
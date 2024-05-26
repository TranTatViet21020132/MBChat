import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface chatObject {
    id: string;
    from: string;
    date: string;
    img: string;
    msg: string;
    read: boolean;
    unreadCount: number;
}

interface chatMessageObject {
    _id: number,
    text: string,
    createdAt: Date,
    user: {
        _id: number,
        name: string
    },
    location?: string
}

interface chatState {
    chatList: Array<chatObject>,
    chatHistory: Record<string, Array<chatMessageObject>>
}

const initialState: chatState = {
    chatList: [],
    chatHistory: {}
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Array<chatObject>>) => {
            let data = action.payload;
            state.chatList = data;
        },
        addChatHistory: (state, action: PayloadAction<{targetId: string, chatHistory: Array<chatMessageObject>}>) => {
            state.chatHistory[action.payload.targetId] = action.payload.chatHistory;
        },
        addMessage: (state, action: PayloadAction<{targetId: string, chatMessageObject: chatMessageObject }>) => {
            state.chatHistory[action.payload.targetId].unshift(action.payload.chatMessageObject);
        }
    }
})

export const { setChats, addChatHistory, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
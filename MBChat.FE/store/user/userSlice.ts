import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface UserState {
    id: number;
    fullname: string;
    username: string;
    avatarUrl: string;
    verified: boolean;
};

const initialState: UserState = {
    id: 0,
    fullname: "",
    username: "",
    avatarUrl: "",
    verified: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserProfile: (state, action: PayloadAction<UserState>) => {
            return {
                ...state,
                ...action.payload
            };
        }
    }
})

export const { setUserProfile } = userSlice.actions;

export default userSlice.reducer;
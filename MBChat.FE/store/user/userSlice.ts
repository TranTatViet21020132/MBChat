import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface UserState {
    id: number;
    fullname: string;
    username: string;
    avatarUrl: string;
    verified: boolean;
    bio: string;
    firstName: string;
    lastName: string;
};

const initialState: UserState = {
    id: 0,
    fullname: "",
    username: "",
    avatarUrl: "",
    verified: false,
    bio: "",
    firstName: "",
    lastName: ""
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
        },
        setFirstName: (state, action: PayloadAction<string>) => {
            state.firstName = action.payload
        },
        setLastName: (state, action: PayloadAction<string>) => {
            state.lastName = action.payload
        },
        setAvatarUrl: (state, action: PayloadAction<string>) => {
            state.avatarUrl = action.payload
        },
        setBio: (state, action: PayloadAction<string>) => {
            state.bio = action.payload
        }
    }
})

export const { setUserProfile, setFirstName, setLastName,
    setAvatarUrl, setBio} = userSlice.actions;

export default userSlice.reducer;
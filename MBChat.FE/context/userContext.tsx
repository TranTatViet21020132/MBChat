import React from "react";

export type UserContextType = {
    userInfomation:  UserInformationData;
    setUserInformation: React.Dispatch<React.SetStateAction<UserInformationData>>;

}
export interface UserInformationData {
    id: number;
    username: string;
    fullname: string;
    avatarUrl: string;
    verified: boolean;
    offerDescription?: RTCSessionDescriptionInit | null;
    offerAnswer?: RTCSessionDescriptionInit | null;
}

export const UserContext = React.createContext<UserContextType | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [userInfomation, setUserInformation] = React.useState<UserInformationData>(
        {
            "id": 0,
            "username": "",
            "fullname": "",
            "avatarUrl": "",
            verified: false
        }
    )
    
    return (
        <UserContext.Provider value={{ userInfomation, setUserInformation }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;
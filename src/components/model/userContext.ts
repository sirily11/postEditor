import React from "react";


interface User {
    userID?: string,
    userName?: string,
    password?: string,
    isLogin: boolean
}


export const userInfo: User = {
    isLogin: false
}

export const UserContext = React.createContext(userInfo);
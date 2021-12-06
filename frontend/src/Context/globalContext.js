import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [isloggedIn, setIsLoggedIn] = useState();
    const [CurrentUser, setCurrentUser] = useState();
    const [accessKey, setAccessKey] = useState();
    const [editId, setEditId] = useState(null);
    const signIn = (key) => {
        setIsLoggedIn(true);
        localStorage.setItem("key", key)
        setAccessKey(key);
    };

    const signOut = () => {
        <Navigate to="/login" />
        setIsLoggedIn(false);
        setAccessKey("");
        localStorage.clear()
    };

    return (
        <UserContext.Provider
            value={{
                isloggedIn,
                accessKey,
                CurrentUser,
                editId,
                setCurrentUser,
                signIn,
                signOut,
                setEditId,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(UserContext);
};

export { UserContext, UserProvider };
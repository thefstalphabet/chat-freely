import React, { createContext, useState } from "react";

export const UserContext = createContext();

export default function Context({ children }) {
  const [userInfo, setUserInfo] = useState();
  const [myChats, setMyChats] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        myChats,
        setMyChats,
        searchResult,
        setSearchResult,
        selectedChat,
        setSelectedChat,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

import React, { useContext, useState } from "react";
import Styled from "styled-components";
import { UserContext } from "../context/Context";
import axios from "axios";
import { GroupModal, Notifications } from "../components";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Avatar,
  Box,
} from "@chakra-ui/react";
import {
  ProfileModal,
  DummyUsersLoading,
  SpinnerLoading,
  Card,
} from "../components";
import { IoPersonAdd } from 'react-icons/io5';

export default function Chats() {
  const toast = useToast();
  const {
    userInfo,
    searchResult,
    setSearchResult,
    selectedChat,
    setSelectedChat,
    myChats,
    setMyChats,
  } = useContext(UserContext);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      description: "Logout sucessfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
    window.location.href = "/login";
  };

  const handleSearchUsers = async (event) => {
    setQuery(event.target.value);
    setLoading(true);
    if (!query) {
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = `/api/user/users/?search=${query}`;
      const { data } = await axios.get(URL, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      return toast({
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const acessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/chat";
      const { data } = await axios.post(URL, { userId }, config);
      if (!myChats.find((ele) => ele._id === data.chat._id)) {
        setMyChats([data.chat, ...myChats]);
      }
      setQuery("");
      setSelectedChat(data.chat);
      setLoadingChat(false);
    } catch (error) {
      setLoading(false);
      return toast({
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  return (
    <Container value={selectedChat}>
      <Header>
        <h2>Chats</h2>
        <Options>
          <GroupModal type="create" />
          <Notifications />
          <Menu>
            <MenuButton>
              <Avatar size="sm" src={userInfo.avatar} name={userInfo.name} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={userInfo} />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Options>
      </Header>
      <Body>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={
              <IoPersonAdd color="#636c72"/>
            }
          />
          <Input
            type="text"
            placeholder="Search user"
            onChange={handleSearchUsers}
            focusBorderColor="#319694"
            value={query}
          />
        </InputGroup>
        <Listing>
          {loading && <DummyUsersLoading />}
          {loadingChat && <SpinnerLoading />}
          {query && !loading ? (
            <>
              {searchResult.length > 0 &&
                searchResult.map((user, index) => {
                  return (
                    <Card
                      key={index}
                      user={user}
                      action={() => {
                        acessChat(user._id);
                      }}
                    />
                  );
                })}
              {searchResult.length <= 0 && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="100%"
                >
                  <h2>User not exists 🙅‍♂️</h2>
                </Box>
              )}
            </>
          ) : (
            <>
              {myChats.length > 0 &&
                !loading &&
                myChats.map((chat, index) => {
                  return (
                    <Card
                      key={index}
                      chat={chat}
                      action={() => {
                        setSelectedChat(chat);
                      }}
                    />
                  );
                })}
              {myChats.length <= 0 && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="100%"
                >
                  <h2>You have no chats 😥</h2>
                </Box>
              )}
            </>
          )}
        </Listing>
      </Body>
    </Container>
  );
}
const Container = Styled.div`
  border-right: 1px solid #DCDCDC;
  min-width: 350px;
  @media (max-width: 768px) {
    ${({ value }) => (value.length <= 0 ? "display: block" : "display: none")}
  }
`;
const Header = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--gray);
  h2 {
    font-size: 20px;
    font-weight: 600;
  }
  `;
const Options = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
`;
const Body = Styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const Listing = Styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-Y: scroll;
  margin-top: 10px;
`;

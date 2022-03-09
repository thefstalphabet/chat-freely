import {
  Avatar,
  Box,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Styled from "styled-components";
import { frontUser } from "../config/chat-logics";
import { UserContext } from "../context/Context";
import ProfileModal from "./ProfileModal";
import { GroupUsersModal, SpinnerLoading } from "./index";
import GroupModal from "./GroupModal";
import axios from "axios";
import { YourMsg, SomeoneMsg, TypingIndicator } from "./index";
import io from "socket.io-client";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { MdArrowBackIosNew } from "react-icons/md";
import { IoSend } from "react-icons/io5";

// socket stuff
const URL = "https://chat-freely-app.herokuapp.com";
var socket, selectedChatCompare;

export default function Room() {
  const {
    selectedChat,
    setSelectedChat,
    userInfo,
    fetchAgain,
    setFetchAgain,
    notification,
    setNotification,
  } = useContext(UserContext);
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMesage] = useState("");

  //socket stuff
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleDeleteGroup = async (chatId) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = `/api/chat/group?chatId=${chatId}`;
      await axios.delete(URL, config);
      toast({
        description: "Group delete sucessfully",
        status: "success",
        duration: 5000,
        position: "bottom-left",
      });
      setLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat([]);
    } catch (error) {
      setLoading(false);
      return toast({
        description: error.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };
  const handleLeaveGroup = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/chat/groupremove";
      await axios.put(
        URL,
        {
          chatId: selectedChat._id,
          userId: userInfo._id,
        },
        config
      );
      toast({
        description: "Group left sucessfully",
        status: "success",
        duration: 5000,
        position: "bottom-left",
      });
      setLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat([]);
    } catch (error) {
      setLoading(false);
      return toast({
        description: error.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage) {
      return;
    }

    setLoading(true);
    socket.emit("stop typing", selectedChat._id); //socket stuff
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/message";
      const { data } = await axios.post(
        URL,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
      setNewMesage("");
      setLoading(false);
      setMessages([...messages, data.message]);

      // socket stuff
      socket.emit("new message", data.message);
    } catch (error) {
      setLoading(false);
      return toast({
        description: error.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleTyping = async (event) => {
    setNewMesage(event.target.value);

    // socket stuff
    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchAllMessages = async () => {
    if (selectedChat.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = `/api/message/${selectedChat._id}`;
      const { data } = await axios.get(URL, config);
      setLoading(false);
      setMessages(data.messages);

      // socket stuff
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      return toast({
        description: error.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    socket = io(URL);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (
          !notification.find(
            (noti) => noti.chat._id === newMessageRecieved.chat._id
          )
        ) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchAllMessages();
    // socket stuff
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <>
      {loading && <SpinnerLoading />}
      <Container value={selectedChat}>
        {selectedChat.length !== 0 ? (
          <>
            <Header>
              {/* <img
                src="assets/icons/back-arrow.svg"
                alt="back-arrow"
                className="back-arrow"
                onClick={() => {
                  setSelectedChat([]);
                }} */}
              <MdArrowBackIosNew
                size={30}
                cursor="pointer"
                onClick={() => {
                  setSelectedChat([]);
                }}
                className="arrow"
              />
              <h2>
                {selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : frontUser(userInfo, selectedChat).name}
              </h2>
              {selectedChat.isGroupChat ? (
                <Menu>
                  <MenuButton>
                    <HiDotsCircleHorizontal size={36} cursor="pointer" />
                  </MenuButton>
                  <MenuList>
                    {selectedChat.groupAdmin._id === userInfo._id && (
                      <GroupModal type="update" />
                    )}
                    <GroupUsersModal />
                    {selectedChat.groupAdmin._id === userInfo._id ? (
                      <MenuItem
                        onClick={() => {
                          handleDeleteGroup(selectedChat._id);
                        }}
                      >
                        Delete Group
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={handleLeaveGroup}>
                        Leave Group
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              ) : (
                <Menu>
                  <MenuButton>
                    <Avatar
                      size="sm"
                      src={frontUser(userInfo, selectedChat).avatar}
                      name={frontUser(userInfo, selectedChat).name}
                    />
                  </MenuButton>
                  <MenuList>
                    <ProfileModal
                      frontUser={frontUser(userInfo, selectedChat)}
                    />
                  </MenuList>
                </Menu>
              )}
            </Header>
            <Body>
              <RoomMessages>
                {messages.map((message, index) =>
                  message.sender._id === userInfo._id ? (
                    <YourMsg key={index} message={message} />
                  ) : (
                    <SomeoneMsg key={index} message={message} />
                  )
                )}
                {isTyping && <TypingIndicator />}
              </RoomMessages>
              <form>
                <Input
                  placeholder="Message.."
                  size="md"
                  focusBorderColor="#319694"
                  onChange={handleTyping}
                  value={newMessage}
                />
                <IoSend
                  size={30}
                  cursor="pointer"
                  onClick={handleSendMessage}
                  style={{ marginLeft: "10px" }}
                />
              </form>
            </Body>
          </>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <h2>Click on user to start chatting</h2>
          </Box>
        )}
      </Container>
    </>
  );
}
const Container = Styled.div`
  @media (max-width: 768px) {
    display: none;
    ${({ value }) => (value.length >= 0 ? "display: none" : "display: block")}
  }
`;
const Header = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: var(--gray) ;
    h2{
        font-size: 20px;
        font-weight: 600;
    }
    .arrow{
      display: none;
    }
    @media (max-width: 768px) {
      .arrow{
        display: block;
      }
    }
`;
const Body = Styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: end;
  gap: 10px;
  form{
    display: flex;
    align-items: center;
  }
`;
const RoomMessages = Styled.div`
  overflow-y: scroll;
  display: grid;
  grid-gap: 10px;
`;

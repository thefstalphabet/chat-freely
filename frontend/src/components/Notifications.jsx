import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { useContext } from "react";
import Styled from "styled-components";
import { frontUser } from "../config/chat-logics";
import { UserContext } from "../context/Context";

export default function Notifications() {
  const { notification, setNotification, userInfo, setSelectedChat } =
    useContext(UserContext);
  return (
    <Container>
      <Menu>
        <MenuButton>
          {!notification.length ? (
            <img src="assets/icons/bell.svg" alt="bell-icon" />
          ) : (
            <img src="assets/icons/ringed-bell.svg" alt="ringed-bell-icon" />
          )}
        </MenuButton>
        <MenuList>
          {!notification.length ? (
            <MenuItem>Empty</MenuItem>
          ) : (
            notification.map((ele, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  setSelectedChat(ele.chat);
                  setNotification(notification.filter((ping) => ping !== ele));
                }}
              >
                {ele.chat.isGroupChat
                  ? `New messaage in ${ele.chat.chatName}`
                  : `New message from ${frontUser(userInfo, ele.chat).name}`}
              </MenuItem>
            ))
          )}
        </MenuList>
      </Menu>
    </Container>
  );
}
const Container = Styled.div`
    line-height: 0;
    button{
        line-height: initial;
    }
`;

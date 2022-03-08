import { Avatar } from "@chakra-ui/react";
import React, { useContext } from "react";
import Styled from "styled-components";
import { isLastMessage, isSameSender } from "../config/chat-logics";
import { UserContext } from "../context/Context";

export default function SomeoneMsg({ message }) {
  const { selectedChat } = useContext(UserContext);
  return (
    <>
      <Container>
        {selectedChat.isGroupChat && (
          <Avatar
            size="sm"
            name={message.sender.name}
            src={message.sender.avatar}
          />
        )}
        <h2>{message.content}</h2>
      </Container>
    </>
  );
}
const Container = Styled.div`
    display: flex;
    align-items: center;
    text-align: left;
    h2{
      color: var(--black);
      padding: 10px;
      background-color: var(--gray);
      display: inline-block;
      border-radius: 10px;
      margin-left: 10px;
    }
`;

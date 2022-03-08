import React, { useContext } from "react";
import Styled from "styled-components";
import { Avatar, AvatarGroup } from "@chakra-ui/react";
import { UserContext } from "../context/Context";
import { frontUser } from "../config/chat-logics";

export default function Card({ user, chat, action }) {
  const { selectedChat, userInfo } = useContext(UserContext);

  return (
    <>
      {user && (
        <Container onClick={action}>
          <Avatar size="md" src={user.avatar} name={user.name} />
          <Info>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </Info>
        </Container>
      )}

      {chat && (
        <Container
          onClick={action}
          style={{
            backgroundColor: selectedChat._id === chat._id && "var(--main)",
          }}
        >
          {!chat.isGroupChat ? (
            <>
              <Avatar
                size="md"
                src={frontUser(userInfo, chat).avatar}
                name={frontUser(userInfo, chat).name}
              />
              <Info
                style={{
                  color: selectedChat._id === chat._id && "var(--white)",
                }}
              >
                <h3>{frontUser(userInfo, chat).name}</h3>
              </Info>
            </>
          ) : (
            <>
              <AvatarGroup size="xs" max={2}>
                {chat.users.map((ele, idx) => (
                  <Avatar key={idx} name={ele.name} src={ele.avatar} />
                ))}
              </AvatarGroup>
              <Info style={{ color: selectedChat === chat && "var(--white)" }}>
                <h3>{chat.chatName}</h3>
                <p>Look, what peeps are taking</p>
              </Info>
            </>
          )}
        </Container>
      )}
    </>
  );
}
const Container = Styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: var(--gray);
    border-radius: 7px;
    cursor: pointer;
    h3{
      font-size: 18px;
      font-weight: 600;
    }
`;
const Info = Styled.div`
    margin-left: 10px;
`;

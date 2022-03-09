import React, { useContext } from "react";
import Styled from "styled-components";
import { Chats, Room } from "../components";
import { UserContext } from "../context/Context";

export default function Dashboard() {
  const { userInfo } = useContext(UserContext);
  return (
    <>
      {userInfo && (
        <Container>
          <Chats />
          <Room />
        </Container>
      )}
    </>
  );
}
const Container = Styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

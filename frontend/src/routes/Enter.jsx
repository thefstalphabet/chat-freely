import React from "react";
import Styled from "styled-components";
import { LogIn } from "../components";

export default function Enter() {
  return (
    <Container>
      <LogIn />
    </Container>
  );
}
const Container = Styled.div`
  display: flex;
  height: 100vh;
`;

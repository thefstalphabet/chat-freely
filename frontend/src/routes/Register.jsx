import React from "react";
import Styled from "styled-components";
import { SignUp } from "../components";

export default function Register() {
  return (
    <Container>
      <SignUp />
    </Container>
  );
}
const Container = Styled.div`
  display: flex;
  height: 100vh;
`;

import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import Styled from "styled-components";

export default function Hero() {
  return (
    <Container>
      <h1>Welcome to Chat Freely</h1>
      <Options>
        <Link to="/login">
          <Button mr={5} colorScheme="teal" variant="solid">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button colorScheme="teal" variant="outline">
            Register
          </Button>
        </Link>
      </Options>
    </Container>
  );
}
const Container = Styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
  h1{
    font-size: 25px;
  }
`;
const Options = Styled.div`
    margin-top: 20px;
`;

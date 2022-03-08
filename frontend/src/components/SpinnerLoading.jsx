import { Spinner } from "@chakra-ui/react";
import React from "react";
import Styled from "styled-components";

export default function Dashboard() {
  return (
    <Container>
      <Circle>
        <Spinner size="xl" />
      </Circle>
    </Container>
  );
}
const Container = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
`;
const Circle = Styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

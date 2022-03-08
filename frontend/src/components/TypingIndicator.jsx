import React from "react";
import Styled from "styled-components";
import Lottie from "lottie-react";
import animationData from "../animations/typing-loading.json";

export default function TypingIndicator() {
  return (
    <Container>
      <Lottie style={{ width: "50px" }} animationData={animationData} />
    </Container>
  );
}
const Container = Styled.div`
    margin-left: 10px;
`;

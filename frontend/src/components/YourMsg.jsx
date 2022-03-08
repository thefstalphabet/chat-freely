import React from "react";
import Styled from "styled-components";

export default function YourMsg({ message }) {
  return (
    <>
      <Container>
        <h2>{message.content}</h2>
      </Container>
    </>
  );
}
const Container = Styled.div`
    text-align: right;
    h2{
        color: var(--white);
        padding: 10px;
        background-color: var(--main);
        display: inline-block;
        border-radius: 10px 0 10px 10px;
        margin-right: 10px;
    }
`;

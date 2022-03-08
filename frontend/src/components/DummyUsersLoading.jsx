import React from "react";
import Styled from "styled-components";
import { Skeleton, Stack } from "@chakra-ui/react";

export default function DummyUsersLoading() {
  return (
    <Container>
      <Stack>
        <Skeleton height="60px" />
        <Skeleton height="60px" />
        <Skeleton height="60px" />
        <Skeleton height="60px" />
        <Skeleton height="60px" />
        <Skeleton height="60px" />
        <Skeleton height="60px" />
      </Stack>
    </Container>
  );
}
const Container = Styled.div`
    margin-top: 10px;
`;

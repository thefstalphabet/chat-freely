import styled from "styled-components";

export default function Page404() {
  return (
    <Container>
      <h1>Opps!! Page Not Found</h1>
    </Container>
  );
}
// Styling
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  h1 {
    font-size: 25px;
  }
`;

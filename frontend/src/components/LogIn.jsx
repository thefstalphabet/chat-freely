import React, { useContext, useState } from "react";
import Styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  useToast,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/Context";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";


const initialInputData = {
  name: "",
  email: "",
};

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const { fetchAgain, setFetchAgain, userInfo } = useContext(UserContext);

  const [inputData, setInputData] = useState(initialInputData);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const { email, password } = inputData;
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const URL = "/api/user/signin";
      const { data } = await axios.post(
        URL,
        {
          email,
          password,
        },
        config
      );
      // console.log(data.user);
      localStorage.setItem("token", data.token);
      toast({
        description: "Login sucessfully",
        status: "success",
        duration: 5000,
        position: "bottom-left",
      });
      setLoading(false);
      setFetchAgain(!fetchAgain);
      navigate("/dashboard");
    } catch (error) {
      const { status } = error.response;
      if (status === 401) {
        setLoading(false);
        return toast({
          description: "Invalid login or password. Please try again",
          status: "error",
          duration: 5000,
          position: "bottom-left",
        });
      } else if (status === 400) {
        setLoading(false);
        return toast({
          description: "All inputs are required",
          status: "warning",
          duration: 5000,
          position: "bottom-left",
        });
      } else if (status === 403) {
        setLoading(false);
        return toast({
          description: "Email not registered yet",
          status: "info",
          duration: 5000,
          position: "bottom-left",
        });
      } else {
        setLoading(false);
        return toast({
          description: error.message,
          status: "error",
          duration: 5000,
          position: "bottom-left",
        });
      }
    }
  };

  return (
    <>
      {userInfo && navigate("/dashboard")}
      <Container>
        <Header>
          <img className="key" src="assets/icons/key.svg" alt="key" />
          <h2>LogIn</h2>
        </Header>
        <Body>
          <Input
            name="email"
            type="email"
            onChange={handleInputChange}
            placeholder="Email*"
            size="lg"
            focusBorderColor="#319694"
          />
          <InputGroup size="lg">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleInputChange}
              placeholder="Password*"
              size="lg"
              focusBorderColor="#319694"
            />
            <InputRightElement width="4.5rem">
              {showPassword ? (
                <BsEyeFill
                  onClick={() => {
                    showPassword
                      ? setShowPassword(false)
                      : setShowPassword(true);
                  }}
                  size={20}
                  color="#A0AEC0"
                />
              ) : (
                <BsEyeSlashFill
                  onClick={() => {
                    showPassword
                      ? setShowPassword(false)
                      : setShowPassword(true);
                  }}
                  size={20}
                  color="#A0AEC0"
                />
              )}
            </InputRightElement>
          </InputGroup>
          <h5>
            Not registered yet? <Link to="/register">Register</Link>
          </h5>
          <Button
            isFullWidth={true}
            colorScheme="teal"
            size="lg"
            onClick={handleFormSubmit}
            isLoading={loading}
            loadingText="Submitting"
          >
            Login
          </Button>
        </Body>
        <Footer>
          <h5>Copyright © Chat Freely 2022</h5>
        </Footer>
      </Container>
    </>
  );
}
const Container = Styled.div`
  text-align: center;
  width: 450px;
  margin: auto;
  padding: 20px;
  .key{
    display: initial;
    width: 45px;
  }
`;
const Header = Styled.div`
  h2{
    font-size: 25px;
    font-weight: 600;
  }
`;
const Body = Styled.div`
  margin-top: 20px;
  input{
    margin-bottom: 20px;
  }
  h5{
    line-height: 3;
    text-align: left;
    a{
      color: var(--main);
    }
  }
  button{
    margin-top: 20px;
  }
  img{
    cursor: pointer;
  }
  `;
const Footer = Styled.div`
  h5{
    margin-top: 40px;
  }
`;

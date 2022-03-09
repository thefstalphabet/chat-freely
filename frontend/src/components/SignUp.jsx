import React, { useContext, useState } from "react";
import Styled from "styled-components";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../context/Context";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const initialInputData = {
  name: "",
  email: "",
  password: "",
};

export default function SignUp() {
  const navigate = useNavigate();
  const toast = useToast();
  const { userInfo } = useContext(UserContext);

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

  const { name, email, password } = inputData;
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const URL = "/api/user";
      const { data } = await axios.post(
        URL,
        {
          name,
          email,
          password,
        },
        config
      );
      console.log(data.token);
      toast({
        description: "Registered sucessfully",
        status: "success",
        duration: 5000,
        position: "bottom-left",
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      const { status } = error.response;
      if (status === 409) {
        setLoading(false);
        return toast({
          description: "Already registered",
          status: "info",
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
          <img className="lock" src="assets/icons/lock.svg" alt="lock" />
          <h2>Register</h2>
        </Header>
        <Body>
          <Input
            name="name"
            type="text"
            onChange={handleInputChange}
            placeholder="Name*"
            size="lg"
            focusBorderColor="#319694"
          />
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
            Already have an account? <Link to="/login">login</Link>
          </h5>
          <Button
            isFullWidth={true}
            colorScheme="teal"
            size="lg"
            onClick={handleFormSubmit}
            isLoading={loading}
            loadingText="Submitting"
          >
            Register
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
  .lock{
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

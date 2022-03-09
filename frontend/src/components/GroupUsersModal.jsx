import {
  Avatar,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import Styled from "styled-components";
import { UserContext } from "../context/Context";
import { SpinnerLoading } from "./index";
import { ImCross } from "react-icons/im";

export default function UpdateGroupModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, userInfo, fetchAgain, setFetchAgain } =
    useContext(UserContext);
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const handleRemoveUser = async (user) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/chat/groupremove";
      const { data } = await axios.put(
        URL,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );
      console.log(data);
      toast({
        description: "User removed sucessfully",
        status: "success",
        duration: 5000,
        position: "bottom-left",
      });
      setLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat(data.remove);
    } catch (error) {
      setLoading(false);
      return toast({
        description: error.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  return (
    <Container>
      {loading && <SpinnerLoading />}
      <MenuItem onClick={onOpen}>Members</MenuItem>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Group Members
            <ImCross size={20} onClick={onClose} cursor="pointer" />
          </ModalHeader>
          <ModalBody pb={7}>
            <Users>
              {selectedChat.users.map((user, index) => (
                <Tag
                  size="sm"
                  key={index}
                  variant="solid"
                  backgroundColor={
                    userInfo._id === user._id ? "var(--main)" : "var(--gray)"
                  }
                  margin="5px 5px 0 0"
                  padding="5px 10px"
                  color={
                    userInfo._id === user._id ? "var(--white)" : "var(--black)"
                  }
                >
                  <Avatar
                    src={user.avatar}
                    size="sm"
                    name={user.name}
                    ml={-1}
                    mr={2}
                  />
                  <TagLabel mr={2}>
                    {userInfo._id === user._id ? "You" : user.name}
                    <br />
                    {selectedChat.groupAdmin._id === user._id && (
                      <h2 style={{ fontWeight: "800" }}>Admin</h2>
                    )}
                  </TagLabel>
                  {selectedChat.groupAdmin._id === userInfo._id &&
                    selectedChat.groupAdmin._id !== user._id && (
                      <ImCross
                        onClick={() => {
                          handleRemoveUser(user);
                        }}
                        size={9}
                        cursor="pointer"
                      />
                    )}
                </Tag>
              ))}
            </Users>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
const Container = Styled.div``;
const Users = Styled.div`
  overflow-y: scroll;
  max-height: 430px;
`;

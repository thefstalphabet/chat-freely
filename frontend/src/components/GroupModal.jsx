import React, { useContext, useState } from "react";
import Styled from "styled-components";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
  Tag,
  TagLabel,
  MenuItem,
} from "@chakra-ui/react";
import { UserContext } from "../context/Context";
import axios from "axios";
import { DummyUsersLoading, Card, SpinnerLoading } from "../components";

export default function GroupModal({ type }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { myChats, setMyChats, selectedChat, setSelectedChat } =
    useContext(UserContext);
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const handleSearchUsers = async (event) => {
    setQuery(event.target.value);
    setLoadingUsers(true);
    if (!query) {
      setLoadingUsers(false);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = `/api/user/users/?search=${query}`;
      const { data } = await axios.get(URL, config);
      setLoadingUsers(false);
      setSearchResult(data);
    } catch (error) {
      setLoadingUsers(false);
      return toast({
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleAddUser = async (user) => {
    if (selectedUsers.includes(user)) {
      return toast({
        description: "User already added",
        status: "info",
        duration: 5000,
        position: "bottom-left",
      });
    }
    setSelectedUsers([user, ...selectedUsers]);
  };

  const handleAddNewUser = async (user) => {
    if (selectedChat.users.find((ele) => ele._id === user._id)) {
      return toast({
        description: "User already added in this group",
        status: "info",
        duration: 5000,
        position: "bottom-left",
      });
    }
    setSelectedUsers([user, ...selectedUsers]);
  };

  const handleRemoveUser = async (user) => {
    setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id));
  };

  const handleCreateGroupChat = async () => {
    setLoading(true);
    if (!groupName || !selectedUsers) {
      setLoading(false);
      return toast({
        description: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        position: "bottom-left",
      });
    }

    if (selectedUsers.length < 2) {
      setLoading(false);
      return toast({
        description: "Please select two user to create",
        status: "warning",
        duration: 5000,
        position: "bottom-left",
      });
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/chat/group";
      const { data } = await axios.post(
        URL,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setMyChats([data.fullGroupChat, ...myChats]);
      setSelectedChat(data.fullGroupChat);
      setQuery("");
      setGroupName("");
      setSelectedUsers([]);
      setSearchResult([]);
      toast({
        description: "Created sucessfully",
        status: "success",
        duration: 5000,
        position: "bottom-left",
      });
      setLoading(false);
      onClose();
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

  const handleUpdateGroupChat = async () => {};

  return (
    <Container>
      {type === "create" ? (
        <img src="assets/icons/add.svg" onClick={onOpen} alt="add-icon" />
      ) : (
        <MenuItem onClick={onOpen}>Update</MenuItem>
      )}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between">
            {type === "create" ? "Create New Group Chat" : "Update"}
            <img
              width="17px"
              src="assets/icons/cross.svg"
              onClick={onClose}
              alt="cross-icon"
            />
          </ModalHeader>
          <ModalBody pb={1}>
            <Input
              type="text"
              placeholder={type === "create" ? "Group name" : "New group name"}
              onChange={(e) => setGroupName(e.target.value)}
              focusBorderColor="#319694"
              value={groupName}
              size="sm"
            />
            <InputGroup mt={3}>
              <InputLeftElement
                height={8}
                width={8}
                pointerEvents="none"
                children={
                  <img
                    width="17px"
                    id="search-icon"
                    src="assets/icons/search.svg"
                    alt="user"
                  />
                }
              />
              <Input
                type="text"
                placeholder={type === "create" ? "Add users" : "Add new users"}
                focusBorderColor="#319694"
                onChange={handleSearchUsers}
                value={query}
                size="sm"
              />
            </InputGroup>
            <Users>
              {selectedUsers.map((user, index) => (
                <Tag
                  size="sm"
                  key={index}
                  variant="solid"
                  backgroundColor="var(--main)"
                  margin="5px 5px 0 0"
                >
                  <TagLabel mr={2}> {user.name}</TagLabel>
                  <img
                    width="10px"
                    src="assets/icons/cross.svg"
                    alt="cross-icon"
                    onClick={() => {
                      handleRemoveUser(user);
                    }}
                  />
                </Tag>
              ))}
            </Users>
            <Listing>
              {loadingUsers && <DummyUsersLoading />}
              {loading && <SpinnerLoading />}
              {searchResult.length > 0 ? (
                <>
                  {searchResult.map((user, index) => (
                    <Card
                      key={index}
                      user={user}
                      action={() => {
                        type === "create"
                          ? handleAddUser(user)
                          : handleAddNewUser(user);
                      }}
                    />
                  ))}
                </>
              ) : (
                searchResult.length <= 0 && query && <h2>User not exists 🙅‍♂️</h2>
              )}
            </Listing>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={
                type === "create"
                  ? handleCreateGroupChat
                  : handleUpdateGroupChat
              }
            >
              {type === "create" ? "Create" : "Update"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
const Container = Styled.div``;
const Users = Styled.div`
  margin-top: 5px;
  max-height: 100px;
  overflow-Y: scroll;
`;
const Listing = Styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-Y: scroll;
  height: 250px;
  margin-top: 10px;
  h2{
    text-align: center;
    margin-bottom: 10px;
    font-weight: 600;
    line-height: 15;
  }
`;

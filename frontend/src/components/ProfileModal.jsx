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
} from "@chakra-ui/react";
import { MenuItem, Avatar } from "@chakra-ui/react";

export default function ProfileModal({ user, frontUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container>
      <MenuItem onClick={onOpen}>{user ? "My profile" : "Profile"}</MenuItem>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between">
            {user ? "My profile" : "Profile"}
            <img
              width="17px"
              src="assets/icons/cross.svg"
              onClick={onClose}
              alt="cross-icon"
            />
          </ModalHeader>
          <ModalBody pb={4}>
            <Avatar
              size="2xl"
              name={user ? user.name : frontUser.name}
              src={user ? user.avatar : frontUser.avatar}
              marginBottom={6}
            />
            <h2>{user ? user.name : frontUser.name}</h2>
            <h4>{user ? user.email : frontUser.email}</h4>
          </ModalBody>
          {user && (
            <ModalFooter>
              <Button colorScheme="blue">Edit</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}
const Container = Styled.div``;

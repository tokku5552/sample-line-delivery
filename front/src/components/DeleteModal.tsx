import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

interface DeleteModalProps {
  isLoading: boolean;
  onDelete: () => void;
}

export default function DeleteModal({ isLoading, onDelete }: DeleteModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        削除
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>アイテムを削除しますか？</ModalHeader>
          <ModalCloseButton />
          <ModalBody>この操作は取り消せません。本当に削除しますか？</ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                いいえ
              </Button>
              <Button
                colorScheme="red"
                onClick={onDelete}
                isLoading={isLoading}
              >
                はい
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>

        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
        )}
        <Modal size="lg" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
            >Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between">
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    mb={5}
                    src={user.pic}
                    alt={user.name}
                >
                </Image>
                <Text>
                    Name: {user.name}
                </Text>
                <Text>
                    Email: {user.email}
                </Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default ProfileModal
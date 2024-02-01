import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Spinner,
    Box,
  } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import { set } from 'mongoose'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
  

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    
    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if(!query){
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to search users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            setLoading(false)
        }
    }
    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "Error",
                description: "User already added",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            return
        }

        setSelectedUsers([...selectedUsers, userToAdd])

    }

    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Error",
                description: "Please fill all the fields",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            return
        }

        try {
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.post(`/api/chat/group`, 
            { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) }, config)

            setChats([data, ...chats])
            onClose()
            toast({
                title: "Success",
                description: "Group chat created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create group chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }

    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id))
    }

    return (
        <>
          <Button onClick={onOpen}>{children}</Button>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                Create group chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDir="column" alignItems="center">
                <FormControl>
                    <Input placeholder='Chat name' mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder='Add users' mb={1} onChange={(e) => handleSearch(e.target.value)}/>
                </FormControl>
                <Box w="100%" d="flex" flexWrap="wrap">
                    {selectedUsers.map((u) => (
                    <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                    />
                    ))}
                </Box>
                
                {loading
                ?<Spinner />
                :(searchResult?.slice(0,4).map((user => <UserListItem user={user} key={user._id} handleFunction={() => handleGroup(user)}/>))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }

export default GroupChatModal
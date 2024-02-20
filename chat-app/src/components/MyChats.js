import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import toast, { Toaster } from 'react-hot-toast';
import { getSender } from '../config/ChatLogic';
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";


const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    // console.log(data);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data)
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats(fetchAgain);
  }, []);
  return (
    <div className="flex flex-col items-center p-3 bg-white w-full md:w-96 rounded-lg border border-gray-300">
      <div className="pb-3 px-3 flex justify-between items-center w-full">
        <span className="font-semibold text-lg md:text-xl">My Chats</span>
        <GroupChatModal>
          <button className="flex items-center text-sm md:text-base" onClick={() => {}}>
            New Group Chat
          </button>
        </GroupChatModal>
      </div>
      <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-scroll">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer bg-${selectedChat === chat ? 'teal-500' : 'gray-300'} text-${
                  selectedChat === chat ? 'white' : 'black'
                } px-3 py-2 rounded-lg mb-2`}
              >
                <p>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</p>
                {chat.latestMessage && (
                  <p className="text-xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  )
}

export default MyChats
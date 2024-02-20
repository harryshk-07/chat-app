import React from 'react'
import axios from "axios";
import { useState } from "react";
import { ChatState } from '../Context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";
import toast, { Toaster } from 'react-hot-toast';
import UserListItem from './UserListItem';


const UpdateGroupChatModel = ({ fetchMessages, fetchAgain, setFetchAgain }) => {

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
  
    const { selectedChat, setSelectedChat, user } = ChatState();


    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/api/user?search=${search}`, config);
          console.log(data);
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
            toast.error('Error Occured', {
                position: "bottom-center"
              })
          setLoading(false);
        }
      };
    
      const handleRename = async () => {
        if (!groupChatName) return;
    
        try {
          setRenameLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `/api/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
    
          console.log(data._id);
          // setSelectedChat("");
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        } catch (error) {
            toast.error('Error Occured', {
                position: "bottom-center"
              })
          setRenameLoading(false);
        }
        setGroupChatName("");
      };
    
      const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.success('User Already in group', {
                position: "bottom-center",
                "icon":'⚠'
              })
          return;
        }
    
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.success('Only admins can add someone!', {
                position: "bottom-center",
                "icon":'⚠'
              })
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `/api/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        } catch (error) {
            toast.success('Error Occured', {
                position: "bottom-center"
              })
          setLoading(false);
        }
        setGroupChatName("");
      };
    
      const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.success('Only admins can remove someone!', {
                position: "bottom-center",
                "icon":'⚠'
              })
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
        } catch (error) {
            toast.error('Error Occured', {
                position: "bottom-center"
              })
          setLoading(false);
        }
        setGroupChatName("");
      };
  

  return (
    <div><label className='bg-gray-500 text-white rounded-xl p-1' for="modal-4">Info</label>
     <input class="modal-state" id="modal-4" type="checkbox" />
            <div class="modal">
	<label class="modal-overlay" for="modal-4"></label>
	<div class="modal-content flex flex-col w-[400px] h-[300px] gap-5">
		<label for="modal-4" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
    <div className='flex justify-center'>
    <h1 className='text-2xl font-bold'>{selectedChat.chatName}</h1>
    </div>
    <div className='w-full flex flex-wrap'>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>
            <div className="flex">
              <input
                placeholder="Chat Name"
                className="mr-1"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button
                className="bg-teal-500 text-white px-2 py-1"
                disabled={!groupChatName}
                onClick={handleRename}
              >
                Update
              </button>
            </div>
            <div className="flex">
              <input
                placeholder="Add User to group"
                className="mb-1"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {loading ? (
            <div class="spinner-simple"></div>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
            <div>
            <button onClick={() => handleRemove(user)} className="bg-red-500 text-white float-end px-2 rounded-xl">
              Leave Group
            </button>
            </div>
	</div>
    
</div>
<Toaster/>
    </div>
  )
}

export default UpdateGroupChatModel
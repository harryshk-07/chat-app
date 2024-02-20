import axios from "axios";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import UserListItem from "./UserListItem";
import toast, { Toaster } from 'react-hot-toast';
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({children}) => {

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

  
    const { user, chats, setChats } = ChatState();

    const onOpen = () => {
        setIsOpen(true);
      };
    
      const onClose = () => {
        setIsOpen(false);
      };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.success('User already added.', {
                position: "bottom-center",
                "icon":'⚠'
              })
          return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);
      };

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
        }
      };
      const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
      };
    
      const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.success('Please fill all the fields.', {
                position: "top-center",
                "icon":'⚠'
              })
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            `/api/chat/group`,
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);
          onClose();
          toast.success('New group chat created.', {
            position: "bottom-center"
          })
        } catch (error) {
            toast.error('Failed to create the chat!', {
                position: "bottom-center"
              })
        }
      };

  return (
    <div>
        <label class="btn bg-black text-white" for="modal-2">{children} <span className='ml-4 text-xl'>➕</span></label>
<input class="modal-state" id="modal-2" type="checkbox" />
<div class="modal">
	<label class="modal-overlay" for="modal-2"></label>
	<div class="modal-content w-80 flex flex-col gap-3">
		<label for="modal-2" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
		<h2 class="text-xl text-center">Create Group Chat</h2>
		<input class="input w-full" onChange={(e)=>{setGroupChatName(e.target.value)}} placeholder="Chat Name" />
		<input class="input" onChange={(e)=>{handleSearch(e.target.value)}} placeholder="Add Users eg: Haris, Rafay, Wajid" />
        <div className="w-full flex flex-wrap">
        {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
        </div>
        <div className="-mt-5">
        {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
            </div>
		<div class="flex justify-end gap-3">

			<button onClick={handleSubmit} class="btn bg-black text-white">Create Chat</button>
		</div>
	</div>
</div>
<Toaster/>
    </div>
  )
}

export default GroupChatModal
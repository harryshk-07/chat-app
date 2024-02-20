import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ChatState } from '../Context/ChatProvider';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';


const SideDrawer = () => {
    const { user ,setSelectedChat, chats, setChats } = ChatState()
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

  
    const history = useHistory()


  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };
  
    const logoutHandler = () => {
      localStorage.removeItem("userInfo")
      history.push("/")
    }

    const handleSearch = async () => {
        if (!search) {
            toast.success('Please Enter Something in Search!', {
                position: "top-center",
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
    
          const { data } = await axios.get(`/api/user?search=${search}`, config);
    
           setTimeout(()=>{
        setLoading(false)
      },1000)
          setSearchResult(data);
        } catch (error) {
            toast.error('Error Occured!', {
                position: "top-center"
              })
        }
      };

      const accessChat =  async(userId) => {
        console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
        toast.error('Error fetching the chat!', {
            position: "bottom-center"
          })
    }
      }

  return (
    <div>
        <Toaster/>
        <div class="navbar">
	<div class="navbar-start">
		<a class="navbar-item"><input type="checkbox" id="drawer-left" className="drawer-toggle" />

<label htmlFor="drawer-left" className="btn btn-outline font-bold">Search User</label>
<label className="overlay" htmlFor="drawer-left"></label>
<div className="drawer">
    <div className="drawer-content pt-10 flex flex-col h-full">
        <label htmlFor="drawer-left" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
        <div>
            <h2 className="text-xl font-medium">Search User</h2>
            <input className="input py-1.5 my-3" placeholder="Search by name or email" value={search} onChange={(e)=> setSearch(e.target.value)} />
            <button onClick={handleSearch} className="py-1.5 px-4 rounded-md bg-black text-white">
                Go
            </button>
            <div>
                {
                    loading ? (<ChatLoading/>) : (
                        searchResult?.map((user) => (
                          <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => accessChat(user._id)}
                          />
                        ))
                      )
                }
                {loadingChat && <div className="spinner-simple"></div>
}
            </div>
        </div>
    </div>
</div></a>
	</div>
	<div class="navbar-center">
		<a class="navbar-item">CHAT-APP</a>
	</div>
	<div class="navbar-end">
		<a class="navbar-item text-2xl">🔔</a>
		<a class="navbar-item"><div class="avatar avatar-ring avatar-md">
			<div class="dropdown-container">
				<div class="dropdown">
					<label class="btn btn-ghost flex cursor-pointer px-0" tabindex="0">
						<img 
             src={user.pic} 
             alt="avatar" 
             />
					</label>
					<div class="dropdown-menu dropdown-menu-bottom-left">
						<label class="dropdown-item text-sm" for="modal-1">My Profile</label>
						<a tabindex="-1" onClick={logoutHandler} class="dropdown-item text-sm">Logout</a>
					</div>
				</div>
			</div>
		</div></a>
	</div>
</div>

<input class="modal-state" id="modal-1" type="checkbox" />
            <div class="modal">
	<label class="modal-overlay" for="modal-1"></label>
	<div class="modal-content flex flex-col gap-5">
		<label for="modal-1" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
    <div className='flex justify-center'>
    <img src={user.pic} className='avatar avatar-ring avatar-md' alt="profile" />
    </div>
		<h2 class="text-xl font-bold">{user.name}</h2>
		<h3>{user.email}</h3>
	</div>
</div>

        </div>
  )
}

export default SideDrawer
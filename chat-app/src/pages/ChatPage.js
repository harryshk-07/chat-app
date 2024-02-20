import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage = () => {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div className='w-100'>
   {user && <SideDrawer/>}
<div className='flex justify-between w-100 h-[91.5vh] p-10'>
	{user && <MyChats fetchAgain={fetchAgain} />}
  {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
  </div>

</div>
  )
}

export default ChatPage
import React from 'react';
import SingleChat from './SingleChat';
import { ChatState } from '../Context/ChatProvider';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  console.log(selectedChat)
  return (
    <div
      className={`md:flex items-center flex-col p-3 bg-white w-full md:w-[780px] rounded-lg border-2 border-gray-300`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
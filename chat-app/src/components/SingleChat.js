import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';


const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [fileInput, setFileInput] = useState(null); // Track the selected file
  const [istyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

    const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          setLoading(true);
    
          const { data } = await axios.get(
            `/api/message/${selectedChat._id}`,
            config
          );
          setMessages(data);
          setLoading(false);
    
          socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast.error('Error Occured', {
                position: "bottom-center"
              })
            }
        };
        

        const sendMessage = async () => {
          socket.emit("stop typing",selectedChat._id)
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const formData = new FormData();
            formData.append('chatId', selectedChat._id);
            formData.append('content', newMessage);
            console.log("fileInput")
            console.log(fileInput)
            if (fileInput) {
              formData.append('file', fileInput);
              // console.log(a)
            }
        
            setNewMessage(''); // Clear the input field
            setFileInput(null); // Clear the file input
        
            const { data } = await axios.post('/api/message', formData, config);
            socket.emit('new message', data);
            setMessages([...messages, data]);
          } catch (error) {
            toast.error('Error Occurred', {
              position: 'bottom-center',
            });
          }
        };
        
        const deleteMessage = async (messageId) => {
          try {
            await axios.delete(`/api/message/${messageId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            socket.emit('delete message', messageId);

            // Refresh messages after deleting
            fetchMessages();
          } catch (error) {
            console.error('Error deleting message:', error);
          }
        };
      
        const editMessage = async (messageId, newContent) => {
          try {
            await axios.put(`/api/message/${messageId}`, { content: newContent }, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const updatedMessages = messages.map((msg) => (msg._id === messageId ? { ...msg, content: newContent } : msg));
      setMessages(updatedMessages);
            socket.emit('edit message', { messageId, newContent });
            // Refresh messages after editing
            fetchMessages();
          } catch (error) {
            console.error('Error editing message:', error);
          }
        };

       
      
        const handleKeyPress = (event) => {
          if (event.key === 'Enter') {
            sendMessage();
          }
        };
        const handleHere = (e) => {
          e.preventDefault()
          console.log(e.target.files[0])
          setFileInput(e.target.files[0])
        };

      useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    
        // eslint-disable-next-line
      }, []);
    
      useEffect(() => {
        fetchMessages();
    
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
      }, [selectedChat]);
    
      useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
          if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare._id !== newMessageRecieved.chat._id
          ) {
            if (!notification.includes(newMessageRecieved)) {
              setNotification([newMessageRecieved, ...notification]);
              setFetchAgain(!fetchAgain);
            }
          } else {
            setMessages([...messages, newMessageRecieved]);
          }
        });

        socket.on('delete message', (deletedMessageId) => {
          setMessages(messages.filter((msg) => msg._id !== deletedMessageId));
        });

        socket.on('edit message', ({ messageId, newContent }) => {
          const updatedMessages = messages.map((msg) => (msg._id === messageId ? { ...msg, content: newContent } : msg));
          setMessages(updatedMessages);
        });
      });

      

      const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
      };
    

  return (
    <div>
        {
            selectedChat ? (
                <>
                <div>
                    {
                        !selectedChat.isGroupChat ? (
                            <div className='flex flex-row gap-96'>
                                <div>{getSender(user,selectedChat.users).toUpperCase()}</div>
                            <div> <ProfileModal user={getSenderFull(user, selectedChat.users)} /></div>
                            </div>                            
                        ):
                        (<div className='flex flex-row gap-96'>
                            <div>{selectedChat.chatName.toUpperCase()}</div>
                            <div><UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /></div>
                            </div>)
                    }
                </div>
                <div className="flex flex-col justify-end p-3 bg-gray-300 w-full h-full rounded-lg overflow-hidden">
                {loading ? (
              <div className="spinner-simple xl:w-20 xl:h-20 self-center mx-auto"></div>

            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} deleteMessage={deleteMessage} editMessage={editMessage} />
              </div>
            )}
            <div className="form-control mt-3">
  {istyping ? (
    <div>
    <div class="spinner-dot-pulse mt-3">
    <div class="spinner-pulse-dot"></div>
  </div>
  </div>
  ):<></>}
  <input
                type='text'
                className='input-filled bg-gray-300 text-lg w-[400px] rounded-3xl border-2 border-black'
                placeholder='Enter a message..'
                value={newMessage}
                onChange={typingHandler}
                onKeyPress={handleKeyPress}
                id='first-name'
                required
              />
              <input type='file' onChange={(e) => handleHere(e)} />
              <button
                type='button'
                onClick={sendMessage}
                className='bg-black hover:bg-gray-400 hover:text-black text-white font-bold py-2 px-4 ml-2 rounded'
              >
                Send
              </button>
</div>

                </div>
                </>
            ) :
            <div className='flex items-center justify-center h-full'>
                <h1>CLICK ON A USER TO START CHATTING</h1>
            </div>
        }
       <Toaster/>
    </div>
  )
}

export default SingleChat
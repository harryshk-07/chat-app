import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogic';
import axios from "axios";
import { ChatState } from '../Context/ChatProvider';
import { useState } from 'react';

const ScrollableChat = ({ messages, deleteMessage, editMessage }) => {
  const { user } = ChatState();
  const [editMode, setEditMode] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEditClick = (messageId, content) => {
    setEditMode(messageId);
    setEditedContent(content);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedContent('');
  };

  const handleSaveEdit = (messageId) => {
    editMessage(messageId, editedContent);
    handleCancelEdit();
  };

  const downloadFile = async (fileName) => {
    try {
      const result = await axios.get(`http://localhost:4000/download/${fileName}`, {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (

    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className={`flex ${m.sender._id === user._id ? 'justify-start' : 'justify-end'}`} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <span class="tooltip tooltip-top" data-tooltip={m.sender.name}>
                  <span className="text-gray-600 font-bold mr-2">{m.sender.name}</span>
                  <div className="avatar">
                    <img src={m.sender.pic} name={m.sender.name} alt="avatar" />
                  </div>
                </span>
            )}
            <span
              className={`${
                m.sender._id === user._id ? 'bg-blue-200' : 'bg-green-200'
              } ml-${isSameSenderMargin(messages, m, i, user._id)} mt-${
                isSameUser(messages, m, i, user._id) ? 3 : 10
              } rounded-lg px-5 py-2 max-w-3/4`}
            >
              {editMode === m._id ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(m._id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  {m.content && <p>{m.content}</p>}
                  {m.file && (
                    <div>
                      <p>File: {m.file}</p>
                      {/* <a href={m.file.path} download={m.file.filename}>
                        Download File
                      </a> */}
                    </div>
                  )}
                  {m.sender._id === user._id && ( // Conditionally render delete and edit buttons for messages sent by the current user
                    <div className='space-x-2'>
                      <button className='bg-red-400 p-1 rounded-md' onClick={() => deleteMessage(m._id)}>Delete</button>
                      {/* <button className='bg-green-400 p-1 rounded-md' onClick={() => handleEditClick(m._id, m.content)}>Edit</button> */}
                      {!m.file && m.sender._id === user._id && (
                        <button className='bg-green-400 p-1 rounded-md' onClick={() => handleEditClick(m._id, m.content)}>Edit</button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>

  );
};

export default ScrollableChat;


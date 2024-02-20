const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, file } = req.body;

  // if (!content || !chatId) {
  //   console.log("Invalid data passed into request");
  //   return res.sendStatus(400);
  // }

  // console.log(file)
  
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    file:file
  };

  if (req.file) {
    newMessage.file = req.file.path.replace(/\\/g, '/');
  }

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied');
    }

    // Use deleteOne or findByIdAndDelete instead of remove
    await Message.deleteOne({ _id: messageId });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const editMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Invalid data passed into request');
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Permission denied');
    }

    message.content = content;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


module.exports = { allMessages, sendMessage, deleteMessage, editMessage };


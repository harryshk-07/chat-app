// const express = require("express");
// const {
//   allMessages,
//   sendMessage,
// } = require("../controllers/messageControllers");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.route("/:chatId").get(protect, allMessages);
// router.route("/").post(protect, sendMessage);

// module.exports = router;

const express = require("express");
const { allMessages, sendMessage, editMessage, deleteMessage } = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage });

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, upload.single('file'), sendMessage); // Add 'upload.single('file')'
router.route("/:messageId").delete(protect, deleteMessage);
router.route("/:messageId").put(protect, editMessage);

module.exports = router;

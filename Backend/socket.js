import jwt from "jsonwebtoken";
import User from "./src/Models/User.js";
import Message from "./src/Models/Message.js";
import Group from "./src/Models/Group.js";

const connectedUsers = new Map();
const messageRateLimiter = new Map();

const MESSAGE_LIMIT = 15;
const RATE_LIMIT_INTERVAL = 10000;

export const socketHandler = (io) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  // auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = user;
      next();
    });
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.user.email}`);

    connectedUsers.set(socket.user.email, { socketId: socket.id, isTabVisible: true });
    await User.findOneAndUpdate({ email: socket.user.email }, { isOnline: true, isTabVisible: true });

    socket.broadcast.emit("userStatusUpdate", {
      email: socket.user.email,
      isOnline: true,
      isTabVisible: true,
      lastSeen: new Date()
    });

    // join groups
    const userGroups = await Group.find({ members: socket.user.email });
    userGroups.forEach(group => socket.join(group._id.toString()));

    // tab visibility
    socket.on("tabVisibility", async ({ isVisible }) => {
      const userConn = connectedUsers.get(socket.user.email);
      if (userConn) {
        userConn.isTabVisible = isVisible;
        connectedUsers.set(socket.user.email, userConn);
      }
      await User.findOneAndUpdate({ email: socket.user.email }, { isTabVisible: isVisible });

      socket.broadcast.emit("userStatusUpdate", {
        email: socket.user.email,
        isOnline: true,
        isTabVisible: isVisible,
        lastSeen: new Date()
      });
    });

    // rate limiting helper
    const canSendMessage = (email) => {
      const now = Date.now();
      let record = messageRateLimiter.get(email);

      if (!record || now - record.lastResetTimestamp > RATE_LIMIT_INTERVAL) {
        record = { count: 1, lastResetTimestamp: now };
        messageRateLimiter.set(email, record);
        return true;
      } else if (record.count < MESSAGE_LIMIT) {
        record.count++;
        messageRateLimiter.set(email, record);
        return true;
      }
      return false;
    };

    // direct message
    socket.on("sendDirectMessage", async ({ to, content }) => {
      try {
        if (!canSendMessage(socket.user.email)) {
          return socket.emit("messageError", { error: "Too many messages. Please slow down." });
        }

        const message = new Message({ from: socket.user.email, to, content, type: "direct", status: "sent" });
        await message.save();

        socket.emit("newMessage", message);

        const receiverConn = connectedUsers.get(to);
        if (receiverConn) {
          message.status = "delivered";
          message.save().catch(console.error);
          io.to(receiverConn.socketId).emit("newMessage", message);
          socket.emit("messageStatusUpdate", { messageId: message._id, status: "delivered" });
        }
      } catch (error) {
        console.error("Direct message error:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    // group message
    socket.on("sendGroupMessage", async ({ groupId, content }) => {
      try {
        if (!canSendMessage(socket.user.email)) {
          return socket.emit("messageError", { error: "Too many messages. Please slow down." });
        }

        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(socket.user.email)) {
          return socket.emit("messageError", { error: "Access denied" });
        }

        const message = new Message({ from: socket.user.email, to: groupId, content, type: "group", status: "delivered" });
        await message.save();

        io.to(groupId).emit("newMessage", message);
      } catch (error) {
        console.error("Group message error:", error);
        socket.emit("messageError", { error: "Failed to send group message" });
      }
    });

    // typing indicator
    socket.on("typing", ({ to, type, isTyping }) => {
      if (type === "direct") {
        const receiverConn = connectedUsers.get(to);
        if (receiverConn) {
          io.to(receiverConn.socketId).emit("userTyping", { user: socket.user.email, isTyping, chatId: to });
        }
      } else if (type === "group") {
        socket.to(to).emit("userTyping", { user: socket.user.email, isTyping, chatId: to });
      }
    });

    // mark as read
    socket.on("markAsRead", async ({ chatId, type }) => {
      try {
        if (type === "direct") {
          await Message.updateMany(
            { from: chatId, to: socket.user.email, type: "direct", status: { $in: ["sent", "delivered"] } },
            { status: "read" }
          );

          const senderConn = connectedUsers.get(chatId);
          if (senderConn) {
            io.to(senderConn.socketId).emit("messagesRead", { reader: socket.user.email });
          }
        }
      } catch (error) {
        console.error("Mark as read error:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.user.email}`);
      connectedUsers.delete(socket.user.email);

      const updatedUser = await User.findOneAndUpdate(
        { email: socket.user.email },
        { isOnline: false, isTabVisible: false, lastSeen: new Date() },
        { new: true }
      );

      socket.broadcast.emit("userStatusUpdate", {
        email: socket.user.email,
        isOnline: false,
        isTabVisible: false,
        lastSeen: updatedUser.lastSeen
      });
    });
  });

  // cleanup task
  setInterval(async () => {
    try {
      const thresholdDate = new Date(Date.now() - 30000);
      await User.updateMany({ isOnline: true, lastSeen: { $lt: thresholdDate } }, { isOnline: false, isTabVisible: false });
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, 30000);
};

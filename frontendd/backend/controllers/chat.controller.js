// import Chat from "../models/Chat.model.js";

// import { Server } from "socket.io";
// // import Chat from "../models/Chat.model.js";

// export let ioInstance; // Store the Socket.io instance

// // Get chat history for a course
// export const getChatHistory = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const chat = await Chat.findOne({ course: courseId }).populate("messages.sender", "name email");

//     if (!chat) {
//       return res.status(404).json({ message: "No chat found for this course" });
//     }

//     res.status(200).json(chat.messages);
//   } catch (error) {
//     console.error("Error fetching chat history:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Send a message via REST API (fallback if WebSockets are not available)
// export const sendMessage = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { userId, message } = req.body;
//     console.log(courseId, message,userId);

//     if (!userId || !message) {
//       return res.status(400).json({ message: "User ID and message are required" });
//     }

//     let chat = await Chat.findOne({ course: courseId });

//     // Create chat if it doesn't exist
//     if (!chat) {
//       chat = new Chat({ course: courseId, messages: [] });
//     }

//     const newMessage = {
//       sender: userId,
//       message,
//       timestamp: new Date(),
//     };

//     chat.messages.push(newMessage);
//     await chat.save();

//     res.status(201).json({ message: "Message sent successfully", newMessage });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// export const initializeChat = (server) => {
//   ioInstance = new Server(server, {
//     cors: { origin: "*" },
//   });

//   ioInstance.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     socket.on("joinCourse", (courseId) => {
//       socket.join(courseId);
//       console.log(`User joined course chat: ${courseId}`);
//     });

//     socket.on("sendMessage", async ({ courseId, userId, message }) => {
//       try {
//         let chat = await Chat.findOne({ course: courseId });

//         if (!chat) {
//           chat = new Chat({ course: courseId, messages: [] });
//         }

//         const newMessage = {
//           sender: userId,
//           message,
//           timestamp: new Date(),
//         };

//         chat.messages.push(newMessage);
//         await chat.save();

//         ioInstance.to(courseId).emit("newMessage", newMessage);
//       } catch (error) {
//         console.error("Error handling socket message:", error);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };




import Chat from "../models/Chat.model.js";
import { Server } from "socket.io";

export let ioInstance; // Store the Socket.io instance

// Get chat history for a course
export const getChatHistory = async (req, res) => {
  try {
    const { courseId } = req.params;
    const chat = await Chat.findOne({ course: courseId }).populate("messages.sender", "name email");

   

    if (!chat) {
      return res.status(404).json({ message: "No chat found for this course" });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send a message via REST API (also triggers WebSocket broadcast)
export const sendMessage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "User ID and message are required" });
    }

    let chat = await Chat.findOne({ course: courseId });

    // Create chat if it doesn't exist
    if (!chat) {
      chat = new Chat({ course: courseId, messages: [] });
    }

    const newMessage = {
      sender: userId,
      message,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Emit the message using WebSockets
    if (ioInstance) {
      ioInstance.to(courseId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Initialize Socket.io
export const initializeChat = (server) => {
  ioInstance = new Server(server, {
    cors: { origin: "*" },
  });

  ioInstance.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinCourse", (courseId) => {
      socket.join(courseId);
      console.log(`User joined course chat: ${courseId}`);
    });

    socket.on("sendMessage", async ({ courseId, userId, message }) => {
      try {
        let chat = await Chat.findOne({ course: courseId });

        if (!chat) {
          chat = new Chat({ course: courseId, messages: [] });
        }

        const newMessage = {
          sender: userId,
          message,
          timestamp: new Date(),
        };

        chat.messages.push(newMessage);
        await chat.save();

        ioInstance.to(courseId).emit("newMessage", newMessage);
      } catch (error) {
        console.error("Error handling socket message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

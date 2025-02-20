import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const ChatComponent = ({ courseId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = io("https://lms4-7d49.onrender.com"); // Replace with your backend URL

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    socket.emit("joinCourse", courseId);

    // Fetch previous chat messages
    axios
      .get(`https://lms4-7d49.onrender.com/api/v1/chat/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Chat History Response:", response.data); // Log chat history response
        setMessages(response.data);
      })
      .catch((error) => console.error("Error fetching chat:", error));

    // Listen for real-time messages
    socket.on("newMessage", (newMessage) => {
      console.log("New Message Received:", newMessage); // Log received messages
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [courseId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      courseId,
      message,
      sender: { _id: userId }, // Ensure sender object is included
    };

    // Optimistically update UI before sending to the backend
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await axios.post(
        `https://lms4-7d49.onrender.com/api/v1/chat/${courseId}`,
        { 
          message, 
          userId  // Ensure userId is sent to the backend
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Message Sent Response:", response.data); // Log response from sending message

      // Emit message to socket server
      socket.emit("sendMessage", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-gray-100 rounded-lg shadow-lg">
      <div className="px-4 py-3 font-semibold text-center text-white bg-blue-600">
        Course Chat
      </div>

      <div className="p-4 space-y-2 overflow-y-auto h-80">
        {messages.map((msg, index) => {
          // Ensure correct sender check
          const isSender = msg?.sender?._id === userId || msg?.sender === userId;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                  isSender
                    ? "bg-blue-500 self-end"
                    : "bg-gray-300 text-black self-start"
                }`}
              >
                <strong className="block text-xs text-gray-200">
                  {isSender ? "You" : msg?.sender?.name || "Unknown"}
                </strong>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center p-3 border-t border-gray-300">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 ml-2 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

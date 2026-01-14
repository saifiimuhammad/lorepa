import React, { useState, useRef, useEffect } from "react";
import { IoSearch, IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import io from "socket.io-client";
import { buyerMessagingTranslations } from "./translation/buyerMessagingTranslations";

const socket = io(config.baseUrl.replace("/api/v1", ""));

// Avatar component
const Avatar = ({ initials, isOnline }) => {
  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-purple-500",
  ];
  let hash = 0;
  for (let i = 0; i < initials.length; i++)
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  const color = colors[Math.abs(hash) % colors.length];
  return (
    <div
      className={`relative w-10 h-10 flex items-center justify-center rounded-full font-bold text-white text-sm ${color}`}
    >
      {initials}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
      )}
    </div>
  );
};

// Conversation Item
const ConversationItem = ({ conv, isActive, onClick }) => (
  <div
    onClick={() => onClick(conv._id)}
    className={`flex items-start p-3 cursor-pointer rounded-lg transition-colors duration-150 ${
      isActive ? "bg-indigo-50" : "hover:bg-gray-50"
    }`}
  >
    <Avatar initials={conv.participants[1].name[0]} isOnline={conv.isOnline} />
    <div className="ml-3 flex-1 overflow-hidden">
      <div className="flex justify-between items-center">
        <p
          className={`text-sm font-semibold truncate ${
            isActive ? "text-indigo-800" : "text-gray-900"
          }`}
        >
          {conv.participants[1].name}
        </p>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(conv.updatedAt).toLocaleTimeString()}
        </span>
      </div>
      <p
        className={`text-sm mt-1 truncate ${
          isActive ? "text-indigo-600 font-medium" : "text-gray-500"
        }`}
      >
        {conv.lastMessage || ""}
      </p>
    </div>
  </div>
);

// Chat Message
const ChatMessage = ({ message, currentUserId }) => {
  const isBuyer = message.sender._id === currentUserId;
  const align = isBuyer ? "justify-end" : "justify-start";
  const bubble = isBuyer
    ? "bg-indigo-600 text-white rounded-tr-xl rounded-b-xl"
    : "bg-gray-100 text-gray-800 rounded-tl-xl rounded-b-xl";
  return (
    <div className={`flex ${align} my-2`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-4 shadow-md ${bubble}`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <span
          className={`text-xs mt-1 ${
            isBuyer ? "text-indigo-200" : "text-gray-500"
          } self-end`}
        >
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// Main Component
const BuyerMessaging = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  // Translations based on localStorage
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return (
      buyerMessagingTranslations[storedLang] || buyerMessagingTranslations.fr
    );
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem("lang");
      setTranslations(
        buyerMessagingTranslations[storedLang] || buyerMessagingTranslations.fr
      );
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetchChats();
    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === activeConversationId)
        setMessages((prev) => [...prev, msg]);
      fetchChats();
    });
    return () => socket.off("receiveMessage");
  }, [activeConversationId]);

  useEffect(() => scrollToBottom(), [messages]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `${config.baseUrl}/chat/user/${currentUserId}`
      );
      setConversations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSingleChatMessage = async (chatId) => {
    setActiveConversationId(chatId);
    try {
      const res = await axios.get(`${config.baseUrl}/chat/messages/${chatId}`);
      setMessages(res.data.data);
      socket.emit("joinChat", chatId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const payload = {
        chatId: activeConversationId,
        sender: currentUserId,
        content: newMessage.trim(),
      };
      const res = await axios.post(`${config.baseUrl}/chat/send`, payload);
      socket.emit("sendMessage", res.data.data);
      setNewMessage("");
      fetchChats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[85vh] flex-col md:flex-row font-inter bg-gray-50">
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200 flex space-x-3">
          {/* <button className="flex items-center justify-center w-full px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
            <FaPlus className="w-4 h-4 mr-2" /> {translations.newMessage}
          </button> */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={translations.searchPlaceholder}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              isActive={conv._id === activeConversationId}
              onClick={fetchSingleChatMessage}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {activeConversationId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg._id}
                    message={msg}
                    currentUserId={currentUserId}
                  />
                ))
              ) : (
                <p className="text-gray-400">{translations.noMessages}</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={translations.typeMessage}
                  className="flex-1 p-3 border border-gray-300 rounded-full outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full transition duration-150 ${
                    !newMessage.trim()
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                  }`}
                >
                  <IoSend className="w-6 h-6 text-white" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {translations.selectConversation}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerMessaging;

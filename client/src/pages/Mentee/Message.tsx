import React, { useState, useRef, useEffect, useCallback } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Search, Send, Paperclip, X, Smile, Clock } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import moment from "moment";
import { Socket } from "socket.io-client";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { connectToChat } from "../../Socket/connect";
import { uploadFile } from "../../Utils/Reusable/cloudinary";
import chatBg from "../../Asset/mpchatbg.png";
import { fetchChats } from "../../service/commonApi";
import profileImg from "../../Asset/user.png";
import { HttpStatusCode } from "axios";
import Spinner from "../../components/Common/common4All/Spinner";
import { toast } from "react-toastify";
import ImageModal from "../../components/Common/common4All/ImageModal";
const Message: React.FC = () => {
  // const [selectedUser, setSelectedUser] = useState<Ichat | null>(null);
  const selectedUserRef = useRef<Ichat | null>(null);
  const [users, setUsers] = useState<Ichat[] | []>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [btnDisable, setBtnDisable] = useState(false);
  const [messages, setMessages] = useState<Imessage[] | []>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useRef<string>("");
  const chatSocket = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
   const [selectedImage, setSelectedImage] = useState<string | null>(null);

  dayjs.extend(utc);
const [currentTime, setCurrentTime] = useState(dayjs().utc().format("YYYY-MM-DD HH:mm:ss"));
  const usr = location.pathname.split("/")![1];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().utc().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading((pre)=>!pre)
        const response = await fetchChats(usr);
        setLoading((pre)=>!pre)
        if (flag && response?.status == HttpStatusCode?.Ok && response?.data) {
          setUsers([...response.data.result]);
          userId.current = response?.data?.userId;
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    }; 
    setCurrentUser(usr);
    let flag = true;
    if (flag) {
      fetchChat();
    }

    return () => {
      flag = false;
    };
  }, [usr]);

  useEffect(() => {
    if (userId.current && !chatSocket.current) {
      chatSocket.current = connectToChat(userId.current) as Socket;
    }

    if (!chatSocket.current) return;

    chatSocket.current.on("connect", () => {
      console.log(''
        // "Connected to chat namespace with ID:",
        // chatSocket.current?.id
      );
    });

    chatSocket.current.on("disconnect", () => {
      console.log(''
        // "Disconnected from chat namespace"
      );
    });

    chatSocket.current.on("userOnline", (data) => {

      setUsers((pre) =>
        pre.map((usr) =>
          data.includes(usr.users?._id)
            ? { ...usr, users: { ...usr.users, online: true } }
            : usr
        )
      );
    });

    chatSocket.current.on("userOffline", (data) => {
   
      setUsers((pre) =>
        pre.map((usr) =>
          data.includes(usr.users?._id)
            ? { ...usr, users: { ...usr.users, online: false } }
            : usr
        )
      );
    });

    chatSocket.current.on("receive-message", (data) => {
      console.error(data.result, data.roomId, "messagerecieved");
      setMessages((prevMessages) => [...prevMessages, data.result]);

      setUsers((prevUsers) => {
        //update the lastMessage
        let updatedUsers = prevUsers.map((usr) =>
          usr?._id === data?.result?.chatId
            ? {
                ...usr,
                lastMessage:
                  data?.result?.messageType === "text"
                    ? data?.result?.content
                    :  data?.result?.messageType,
              }
            : usr
        );
    
        // Find the updated user
        const updatedUser = updatedUsers.find((usr) => usr._id === data?.result?.chatId);
    
        // Remove the user from the list and place them at the top
        updatedUsers = updatedUsers.filter((usr) => usr._id !== data?.result?.chatId);
    
        return updatedUser ? [updatedUser, ...updatedUsers] : updatedUsers;
      });
    });

    chatSocket.current.on("all-message", ({ result, roomId }) => {
      // if (selectedUser?._id == roomId) {
        if (selectedUserRef.current?._id == roomId) {
        setMessages(result);
  
      }
    });

    chatSocket.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      if (!chatSocket.current) return;
      chatSocket.current.off("userOnline");
      chatSocket.current.off("userOffline");
      chatSocket.current.off("connect");
      chatSocket.current.off("disconnect");
      chatSocket.current.off("connect_error");
      chatSocket.current.off("receive-message");
      chatSocket.current.off("all-message");
    };
  }, [selectedUserRef.current?._id, users]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const filteredUsers = users.filter((user) =>
    user?.users?.name.toLowerCase?.().includes(searchQuery?.toLowerCase())
  );


  const handleSelectedUser = useCallback(async (user: Ichat) => {
    setMessages([]);
    if(inputRef?.current){
      inputRef?.current.focus();
    }
    // setSelectedUser(user);
    selectedUserRef.current =user;

    if (!user?._id) return;
    if (chatSocket.current) {
      chatSocket.current.emit("join-room", { roomId: user["_id"] });
    }
   
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileSelect = useCallback((e: any) => {
    const file: File | null = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    setBtnDisable(true);

    if (!selectedFile && !messageInput.trim()) {
      return;
    }
    let senderId: string;
    let receiverId: string;
    if (currentUser == "mentee") {
      // senderId = selectedUser?.menteeId as string;
      // receiverId = selectedUser?.mentorId as string;
      senderId = selectedUserRef.current?.menteeId as string;
      receiverId = selectedUserRef.current?.mentorId as string;
    } else {
      // senderId = selectedUser?.mentorId as string;
      // receiverId = selectedUser?.menteeId as string;
       senderId = selectedUserRef.current?.mentorId as string;
      receiverId = selectedUserRef.current?.menteeId as string;
    }

    const newMessage: Imessage = {
      chatId: selectedUserRef.current?._id as string,
      senderId,
      receiverId,
      content: messageInput.trim(),
      senderType: currentUser,
      messageType: "text",
    };

    if (selectedFile) {
      newMessage.messageType = selectedFile.type.startsWith("image/")
        ? "image"
        : "document";
        const res = await uploadFile(selectedFile);
        if(!res?.success){
          toast.error(res?.url);
          setSelectedFile(null);
          setBtnDisable((pre)=>!pre);
          return 
        }
      newMessage.content = res?.url; 
    }

  

    if (chatSocket.current) {
      chatSocket.current?.emit("new-message", {
        roomId: selectedUserRef.current?._id,
        message: newMessage,
      });
    }

    setMessageInput("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setBtnDisable(false);
  }, [currentUser, messageInput, selectedFile]);

  const handleEmojiClick = useCallback((emojiObject: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
    setShowPicker((pre) => !pre);
  }, []);

 
  return (
    
     <div className="h-[calc(100vh-3rem)] pt-14 flex flex-col md:flex-row bg-gray-50">
      {/* Current UTC Time Display */}
      <div className="absolute top-0 right-0 m-4 flex items-center space-x-2 text-gray-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">{currentTime} UTC</span>
      </div>

      {loading && <Spinner />}

      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage || ''}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Users List Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col 
                    md:h-full h-[50vh] transition-all duration-300">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user?.users?._id} className="animate-fadeIn">
              <button
                onClick={() => handleSelectedUser(user)}
                className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 
                         transition-colors ${
                           selectedUserRef.current?.users?._id === user?.users?._id
                             ? "bg-orange-50 border-l-4 border-orange-500"
                             : "border-l-4 border-transparent"
                         }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user?.users?.profileUrl ?? profileImg}
                    alt={user?.users?.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  {user?.users?.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 
                                   bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 truncate">
                      {user?.users?.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {dayjs(user?.updatedAt).format("HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {user?.lastMessage?.slice(0, 30)}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
        {selectedUserRef.current ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center 
                          space-x-4 sticky top-0 z-10 shadow-sm">
              <div className="relative">
                <img
                  src={selectedUserRef.current?.users?.profileUrl ?? profileImg}
                  alt={selectedUserRef.current?.users?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                />
                {selectedUserRef.current?.users?.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 
                                 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-gray-900 truncate">
                  {selectedUserRef.current?.users?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedUserRef.current?.users?.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4"
                 style={{
                   backgroundImage: `url(${chatBg})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundAttachment: 'fixed'
                 }}>
              {messages.map((message, index) => (
                <div key={message?._id || index}
                     className={`flex ${
                       message.senderId === userId.current ? "justify-end" : "justify-start"
                     } animate-slideIn`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 shadow-sm relative
                                 ${message.senderId === userId.current
                                   ? "bg-orange-500 text-white rounded-br-none"
                                   : "bg-white text-gray-800 rounded-bl-none"}`}>
                    {/* Message Content */}
                    {message.messageType === "text" && (
                      <p className="break-words mb-2">{message.content}</p>
                    )}

                    {/* Image Message */}
                    {message.messageType === "image" && message.content && (
                      <div className="relative group">
                        <div className="max-w-[200px] max-h-[200px] overflow-hidden rounded-lg">
                          <img
                            src={message.content}
                            alt="Shared image"
                            className="w-full h-full object-cover cursor-pointer 
                                     transition transform hover:scale-105"
                                     />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                                        transition-all rounded-lg flex items-center justify-center">
                            <span
                                          onClick={() => setSelectedImage(message?.content)}
                             className="opacity-0 group-hover:opacity-100 text-white 
                                           text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                              View Image
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Document Message */}
                    {message.messageType === "document" && message.content && (
                      <div onClick={() => window.open(message.content)}
                           className={`flex items-center space-x-3 rounded-lg cursor-pointer
                                     ${message.senderId === userId.current
                                       ? "bg-white/10 hover:bg-white/20"
                                       : "bg-gray-50 hover:bg-gray-100"
                                     } transition-colors p-3`}>
                        <div className={`p-2 rounded-full
                                       ${message.senderId === userId.current
                                         ? "bg-white/20"
                                         : "bg-orange-100"}`}>
                          <Paperclip className={`h-5 w-5
                                               ${message.senderId === userId.current
                                                 ? "text-white"
                                                 : "text-orange-500"}`} />
                        </div>
                        <span className="flex-1 truncate font-medium">
                          {decodeURIComponent(message.content.split("/").pop() || "")}
                        </span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className={`text-xs absolute bottom-1 right-2
                                    ${message.senderId === userId.current
                                      ? "text-white/70"
                                      : "text-gray-400"}`}>
                      {moment(message.createdAt).format("HH:mm")}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* File Preview */}
              {selectedFile && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {previewUrl ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Paperclip className="h-6 w-6 text-orange-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowPicker(prev => !prev)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Smile className="h-6 w-6 text-gray-500" />
                  </button>
                  {showPicker && (
                    <div className="absolute bottom-12 left-0 z-20 shadow-xl">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        skinTonesDisabled={false}
                        previewConfig={{ showPreview: false }}
                        searchDisabled={false}
                      />
                    </div>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  disabled={selectedFile ? true : false}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-orange-500 focus:border-transparent
                           disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Paperclip className="h-6 w-6 text-gray-500" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={(!messageInput && !selectedFile) || btnDisable}
                  className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {btnDisable ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent
                                  rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="p-6 bg-gray-100 rounded-full mb-4">
              <Send className="w-12 h-12" />
            </div>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm mt-2">Choose from your existing conversations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

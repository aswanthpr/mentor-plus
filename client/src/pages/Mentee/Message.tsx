import React, { useState, useRef, useEffect, useCallback } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Search, Send, Paperclip, X, Smile } from "lucide-react";
import dayjs from "dayjs";
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
const Message: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Ichat | null>(null);
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

  const usr = location.pathname.split("/")![1];
  useEffect(() => {
    setCurrentUser(usr);
    let flag = true;
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
      if (selectedUser?._id == roomId) {
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
  }, [selectedUser?._id, users]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const filteredUsers = users.filter((user) =>
    user?.users?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSelectedUser = useCallback(async (user: Ichat) => {
    setMessages([]);
    if(inputRef?.current){
      inputRef?.current.focus();
    }
    setSelectedUser(user);

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
      senderId = selectedUser?.menteeId as string;
      receiverId = selectedUser?.mentorId as string;
    } else {
      senderId = selectedUser?.mentorId as string;
      receiverId = selectedUser?.menteeId as string;
    }

    const newMessage: Imessage = {
      chatId: selectedUser?._id as string,
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
        roomId: selectedUser?._id,
        message: newMessage,
      });
    }

    setMessageInput("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setBtnDisable(false);
  }, [
    currentUser,
    messageInput,
    selectedFile,
    selectedUser?._id,
    selectedUser?.menteeId,
    selectedUser?.mentorId,
  ]);

  const handleEmojiClick = useCallback((emojiObject: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
    setShowPicker((pre) => !pre);
  }, []);

 
  return (
    <div className="h-[calc(100vh-3rem)] pt-14 flex">
        {loading && <Spinner />}
      {/* Users List */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
            />
          </div>
        </div>
        <div className="h-0.5 bg-gray-100 w-full " />
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredUsers.map((user) => (
            <div  key={user?.users?._id}>
              <button
               
                onClick={() => handleSelectedUser(user as Ichat)}
                className={`w-full p-4 flex items-center gap-4 hover:bg-gray-100 ${
                  (usr == "mentee"
                    ? selectedUser?.mentorId
                    : selectedUser?.menteeId) == user?.users?._id
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={user?.users?.profileUrl ?? profileImg}
                    alt={user?.users?.name}
                    className="w-12 h-12 rounded-full"
                  />

                  {user?.users?.online && (
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white`}
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0 ">
                    <p className=" font-medium text-gray-900 truncate self-start">
                      {user?.users?.name}
                    </p>
                  <div className="flex justify-between items-end">
                  <p className="text-sm text-gray-500 truncate  ">
                    {user?.lastMessage?.slice(0, 10)}
                  </p>
                    <span className="text-xs text-gray-600 justify-end ">
                      {dayjs(user?.updatedAt).format("HH:mm")}
                    </span>
                  </div>
                </div>
              </button>
              <div className="h-0.5 bg-gray-100 w-full " />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div
              className="p-4 bg-white border-b border-gray-200 flex items-center gap-4"
              key={selectedUser?._id}
            >
              <img
                src={selectedUser?.users?.profileUrl ?? profileImg}
                alt={selectedUser?.users?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-medium text-gray-900">
                  {selectedUser?.users?.name}
                </h2>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-1 break-words overflow-hidden bg-[url('../../Asset/background.jpg')] bg-cover bg-center"
              style={{
                backgroundImage: `url(${chatBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {messages?.map((message, index) => (
                <div className="space-y-2" key={message?._id || index}>
                  <div
                    className={`flex ${
                      message.receiverId ==
                      (currentUser === "mentee"
                        ? selectedUser?.menteeId
                        : selectedUser?.mentorId)
                        ? "justify-start"
                        : "justify-end "
                    }`}
                  >
                    <div
                      className={`max-w-[100%] rounded-lg p-4 space-x-2 relative ${
                        message?.receiverId ===
                        (currentUser === "mentee"
                          ? selectedUser?.menteeId
                          : selectedUser?.mentorId)
                          ? "bg-white border border-gray-200"
                          : "bg-[#a0a0a0] text-white"
                      } `}
                    >
                      {message?.messageType === "text" && (
                        <p>{message?.content}</p>
                      )}
                      {message?.messageType === "image" && message?.content && (
                        <img 
                          src={message?.content}
                          alt="image"
                          className="rounded-lg max-w-sm "
                        />
                      )}
                      {message?.messageType === "document" &&
                        message?.content &&
                        (() => {
                          const decoded = decodeURIComponent(
                            message?.content.split("/").pop() || ""
                          );
                          return (
                            <div
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                message?.receiverId ===
                                (currentUser === "mentee"
                                  ? selectedUser?.menteeId
                                  : selectedUser?.mentorId)
                                  ? "border-[#a3a3a3] text-gray-400 "
                                  : " border-gray-300  text-white-400"
                              }`}
                            >
                              <span
                                onClick={() =>
                                  (window.location.href = message?.content)
                                }
                                // target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <div className="p-2 bg-teal-100 text-teal-600 rounded-full">
                                  <Paperclip className="h-5 w-5" />
                                </div>
                                <span className="truncate max-w-[200px] font-medium">
                                  {decoded}
                                </span>
                              </span>
                            </div>
                          );
                        })()}

                      <span
                        className={`text-xs flex absolute right-3 bottom-0 ${
                          message.receiverId ===
                          (currentUser === "mentee"
                            ? selectedUser?.menteeId
                            : selectedUser?.mentorId)
                            ? "text-gray-400 justify-start items-end"
                            : "text-gray-200 justify-end items-end"
                        } block mt-1`}
                      >
                        {moment(message?.createdAt).format("HH-mm")}
                      </span>
                    </div>
                  </div>
                  <div ref={messagesEndRef} />
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              {selectedFile && (
                <div className="mb-4 relative">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-32 rounded-lg"
                    />
                  )}
                  {!previewUrl && selectedFile?.name}
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4">
                <button onClick={() => setShowPicker((pre) => !pre)}>
                  <Smile />
                </button>
                {showPicker && (
                  <div className="absolute bottom-32  z-10">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      skinTonesDisabled={false}
                      previewConfig={{ showPreview: false }}
                      searchDisabled={false}
                    />
                  </div>
                )}

                <input
                ref={inputRef}
                  type="text"
                  value={messageInput}
                  disabled={selectedFile ? true : false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessageInput(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
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
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={(!messageInput && !selectedFile) || btnDisable} //&& !audioBlob
                  className="p-2 text-white bg-[#ff8800] rounded-lg hover:bg-[#ff9900] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {btnDisable ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex-col flex items-center justify-center text-gray-500 text-lg">
            <Send className="mb-3 w-14 h-14  " /> Select a user to start
            chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, Send, Paperclip, X, Smile } from "lucide-react";
import dayjs  from "dayjs"
import moment from "moment";
import { Socket } from "socket.io-client";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { connectToChat } from "../../Socket/connect";
import { uploadFile } from "../../Utils/Reusable/cloudinary";
import chatBg from "../../Asset/mpchatbg.png";
import { fetchChats } from "../../service/commonApi";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
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
  const [showPicker,setShowPicker] =useState<boolean>(false)
  // const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useRef<string>("");
  const chatSocket = useRef<Socket | null>(null);


  const usr = location.pathname.split("/")![1];
  useEffect(() => {
    setCurrentUser(usr);
    let flag = true;
    const fetchChat = async () => {
      try {
        const response = await fetchChats(usr);

        if (flag && response?.status == 200 && response?.data) {
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
      console.log(
        "Connected to chat namespace with ID:",
        chatSocket.current?.id
      );
    });

    chatSocket.current.on("disconnect", () => {
      console.log("Disconnected from chat namespace");
    });

    chatSocket.current.on("userOnline", (data) => {
      console.log(userId.current, data.userId, "User Online:", data);
      setUsers((pre) =>
        pre.map((usr) =>
          data.includes(usr.users?._id)
            ? { ...usr, users: { ...usr.users, online: true } }
            : usr
        )
      );
    });

    chatSocket.current.on("userOffline", (data) => {
      console.log(data, "this ios data");
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
      setUsers((pre) =>
        pre.map((usr) =>
          usr?._id == data?.result?.chatId
            ? {
                ...usr,
                lastMessage:
                  data?.result?.messageType == "text"
                    ? data?.result?.content
                    : decodeURIComponent(
                        data?.result?.content.split("/").pop()
                      ),
              }
            : usr
        )
      );
    });

    chatSocket.current.on("all-message", ({ result, roomId }) => {
      if (selectedUser?._id == roomId) {
        setMessages(result);
        console.log(roomId, `full messages ${result} `, result);
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
  console.log(currentUser, "currentUser");

  const handleSelectedUser = useCallback(async (user: Ichat) => {
    setMessages([]);

    setSelectedUser(user); // save the selected User
    console.log(user, "thsi si the seledted user");
    if (!user?._id) return;
    if (chatSocket.current) {
      chatSocket.current.emit("join-room", { roomId: user["_id"] });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileSelect = (e: any) => {
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
  };

  const handleSendMessage = useCallback(async () => {
    setBtnDisable(true);

    if (!selectedFile && !messageInput.trim()) {
      //|| audioBlob
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

      newMessage.content = await uploadFile(selectedFile);
    }
    //  else if (audioBlob) {
    //   newMessage.messageType = "audio";
    //   newMessage.mediaUrl = URL.createObjectURL(audioBlob);
    // }

    console.log(newMessage, "thsi si the new mewsage");

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
    // setAudioBlob(null);
  }, [
    currentUser,
    messageInput,
    selectedFile,
    selectedUser?._id,
    selectedUser?.menteeId,
    selectedUser?.mentorId,
  ]);

  // const handleStartRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     chunksRef.current = [];

  //     mediaRecorder.ondataavailable = (e) => {
  //       chunksRef.current.push(e.data);
  //     };

  //     mediaRecorder.onstop = () => {
  //       const blob = new Blob(chunksRef.current, { type: "audio/webm" });
  //       setAudioBlob(blob);
  //       stream.getTracks().forEach((track) => track.stop());
  //     };

  //     mediaRecorder.start();
  //     setIsRecording(true);

  //     // Start timer
  //     const startTime = Date.now();
  //     const timerInterval = setInterval(() => {
  //       setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
  //     }, 1000);

  //     mediaRecorder.addEventListener("stop", () => {
  //       clearInterval(timerInterval);
  //       setRecordingTime(0);
  //     });
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //   }
  // };

  // const handleStopRecording = () => {
  //   if (mediaRecorderRef.current && isRecording) {
  //     mediaRecorderRef.current.stop();
  //     setIsRecording(false);
  //   }
  // };

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, "0")}`;
  // };
  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
    setShowPicker((pre)=>!pre)
  };

  console.log(users?.[0]?.updatedAt)
  return (
    <div className="h-[calc(100vh-3rem)] pt-14 flex">
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
            <>
              <button
                key={user?.users?._id}
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
                    src={user?.users?.profileUrl}
                    alt={user?.users?.name}
                    className="w-12 h-12 rounded-full"
                  />

                  {user?.users?.online && (
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 ">
                  <div className="flex justify-between items-end">
                    <p className="font-medium text-gray-900 truncate">
                      {user?.users?.name}
                    </p>
                    <span className="text-xs text-gray-600 justify-end ">
                      {dayjs( user?.updatedAt).format("HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate  ">
                    {user?.lastMessage?.slice(0, 10)}
                  </p>
                </div>
                {/* {user.unreadCount > 0 && (
                <span className="bg-[#ff8800] text-white text-xs font-medium px-2 py-1 rounded-full">
                  {user.unreadCount}
                </span>
              )} */}
              </button>
              <div className="h-0.5 bg-gray-100 w-full " />
            </>
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
                src={selectedUser?.users?.profileUrl}
                alt={selectedUser?.users?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-medium text-gray-900">
                  {selectedUser?.users?.name}
                </h2>
                {/* <p className="text-sm text-gray-500">
                  {selectedUser.online ? 'Online' : 'Offline'}
                </p> */}
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 break-words overflow-hidden bg-[url('../../Asset/background.jpg')] bg-cover bg-center"
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
                      className={`max-w-[100%] rounded-lg p-3  flex space-x-2 ${
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
                          alt="Shared image"
                          className="rounded-lg max-w-sm"
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

                      {/* {message.messageType === "audio" && message?.mediaUrl && (
                        <audio
                          src={message?.mediaUrl}
                          controls
                          className="w-full"
                        />
                      )} */}
                      <span
                        className={`text-xs flex ${
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

              {/* {audioBlob && !isRecording && (
                <div className="mb-4 flex items-center gap-4">
                  <audio
                    src={URL.createObjectURL(audioBlob)}
                    controls
                    className="flex-1"
                  />
                  <button
                    onClick={() => setAudioBlob(null)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )} */}

              {/* {isRecording && (
                <div className="mb-4 flex items-center gap-4 text-red-500">
                  <span className="animate-pulse">●</span>
                  <span>Recording {formatTime(recordingTime)}</span>
                  <button
                    onClick={handleStopRecording}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )} */}

              <div className="flex items-center gap-4" >
                <button
                onClick={()=>setShowPicker((pre)=>!pre)}
                >
                  <Smile/>
                </button>
                {
                  showPicker&&(
                    <div className="absolute bottom-32  z-10">
                      <EmojiPicker
                   onEmojiClick={handleEmojiClick}
                   skinTonesDisabled={false}
                   previewConfig={{ showPreview: false }}
                   searchDisabled={false}
                   
                   
                 />

                    </div>
                  )
                }
               
                <input
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

                {/* <button
                  onClick={() => {
                    if (isRecording) {
                      handleStopRecording();
                    } else {
                      handleStartRecording();
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Mic className="h-5 w-5" />
                </button> */}

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

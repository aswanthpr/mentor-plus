import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Paperclip, Mic, X } from "lucide-react";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { axiosInstance } from "../../Config/mentorAxios";
import {
  checkOnline,
  disconnect,
  joinRoom,
  listenOnline,
  registerUser,
  sendMessage,
} from "../../Socket/socketService";
import { connectToChat } from "../../Socket/connect";

// interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   lastMessageTime: string;
//   unreadCount: number;
//   online: boolean;
// }

// interface Message {
//   id: string;
//   senderId: string;
//   content: string;
//   timestamp: string;
//   type: "text" | "image" | "document" | "audio";
//   fileUrl?: string;
//   fileName?: string;
// }

// Mock data
// const mockUsers: User[] = [
//   {
//     id: '1',
//     name: 'John Doe',
//     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
//     lastMessage: 'Thanks for the session!',
//     lastMessageTime: '10:30 AM',
//     unreadCount: 2,
//     online: true,
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
//     lastMessage: 'See you tomorrow',
//     lastMessageTime: 'Yesterday',
//     unreadCount: 0,
//     online: false,
//   },
// ];

// const mockMessages: Message[] = [
//   {
//     id: "1",
//     senderId: "1",
//     content: "Hi, how are you?",
//     timestamp: "10:30 AM",
//     type: "text",
//   },
//   {
//     id: "2",
//     senderId: "me",
//     content: "I'm good, thanks! How about you?",
//     timestamp: "10:31 AM",
//     type: "text",
//   },
// ];

const Chat: React.FC = () => {
  const chatSocket = connectToChat();
  const [selectedUser, setSelectedUser] = useState<Ichat | null>(null);
  const [users, setUsers] = useState<Ichat[] | []>([]);
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<Imessage[]|[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    let flag = true;
    const fetchChat = async () => {
      try {
        const { status, data } = await axiosInstance(`/mentor/chats`, {
          params: { role: "mentor" },
        });
        if (flag && status == 200 && data) {
          setUsers(data.result);
          setUserId(data?.userId);
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    };
    if (flag) {
      fetchChat();
    }
    if (userId) {
      registerUser(userId);
    }

    return () => {
      flag = false;

      disconnect("register");
    };
  }, [chatSocket, userId]);

  const handleSelectedUser = (user: Ichat) => {
    setSelectedUser(user);
    checkOnline(user?.menteeId as string);
    joinRoom(user?._id, userId);
  };

  useEffect(() => {
    listenOnline((data) => {
      console.log(data.online, "this is data");
      setSelectedUser((prev) => {
        if (prev && prev.users?._id === data?.userId) {
          return { ...prev, online: data.online };
        }
        return prev;
      });
    });
  
    return () => {
      disconnect("userOnline");
    };
  }, [chatSocket]);
  const filteredUsers = users.filter((user) =>
    user.users?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim() || selectedFile || audioBlob) {
      const newMessage:Imessage = {
        chatId: selectedUser?._id as string,
        senderId: selectedUser?.mentorId as string,
        receiverId: selectedUser?.menteeId as string,
        content: messageInput.trim(),
        senderType: "mentor",

      };
   

      if (selectedFile) {
        newMessage.messageType = selectedFile.type.startsWith("image/")
          ? "image"
          : "document";
        newMessage.mediaUrl = previewUrl || "";
        // newMessage.fileName = selectedFile.name;
      } else if (audioBlob) {
        newMessage.messageType = "audio";
        newMessage.mediaUrl = URL.createObjectURL(audioBlob);
      }
     
      setMessages([...messages, newMessage]);
      setMessageInput("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setAudioBlob(null);
      sendMessage(
        newMessage?.chatId,
        newMessage?.senderId,
        newMessage.receiverId,
        newMessage.senderType,
        newMessage?.content,
       newMessage?.messageType,
        newMessage?.mediaUrl,
      )//socket send message
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      mediaRecorder.addEventListener("stop", () => {
        clearInterval(timerInterval);
        setRecordingTime(0);
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  

  return (
    <div className=" mt-16 h-[calc(100vh-7rem)] flex">
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

        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredUsers.map((user) => (
            <button
              key={user.users?._id}
              onClick={() => handleSelectedUser(user as Ichat)}
              className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 ${
                selectedUser?._id === user.users?._id ? "bg-gray-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={user.users?.profileUrl}
                  alt={user.users?.name}
                  className="w-12 h-12 rounded-full"
                />
                {/* {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )} */}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.users?.name}
                  </p>
                  {/* <span className="text-xs text-gray-500">{user.lastMessageTime}</span> */}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {user.lastMessage}
                </p>
              </div>
              {/* {user.unreadCount > 0 && (
                <span className="bg-[#ff8800] text-white text-xs font-medium px-2 py-1 rounded-full">
                  {user.unreadCount}
                </span>
              )} */}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-4">
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message?._id}
                    className={`flex ${
                      message?.senderId === "me"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === "me"
                          ? "bg-[#ff8800] text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {message?.messageType === "text" && <p>{message?.content}</p>}
                      {message?.messageType === "image" && message?.mediaUrl && (
                        <img
                          src={message.mediaUrl}
                          alt="Shared image"
                          className="rounded-lg max-w-full"
                        />
                      )}
                      {message.messageType === "document" && message.mediaUrl && (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          {/* <span>{message.fileName}</span> */}
                        </div>
                      )}
                      {message.messageType === "audio" && message.mediaUrl && (
                        <audio
                          src={message.mediaUrl}
                          controls
                          className="w-full"
                        />
                      )}
                      <span
                        className={`text-xs ${
                          message.senderId === "me"
                            ? "text-white/80"
                            : "text-gray-500"
                        } block mt-1`}
                      >
                        {message?.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
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
                  {!previewUrl && selectedFile.name}
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

              {audioBlob && !isRecording && (
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
              )}

              {isRecording && (
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
              )}

              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
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
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput && !selectedFile && !audioBlob}
                  className="p-2 text-white bg-[#ff8800] rounded-lg hover:bg-[#ff9900] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

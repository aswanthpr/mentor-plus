import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SessionLobby: React.FC = () => {
  const navigate = useNavigate();
  
  const [roomId, setRoomId] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [stream, setStream] = useState<MediaStream | null>(null);

  const role = location.pathname.split("/")[1];
  useEffect(() => {
    
    const getUserVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
  
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
  
    getUserVideo();
  
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (videoRef?.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [role]); 
  

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (roomId.trim() !== "") {
        navigate(`/${role}/${role=="mentor"?"session":"bookings"}/${roomId}`);
      }
    },
    [roomId, navigate, role]
  );

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col md:flex-row overflow-hidden mt-12">

      <div className="md:w-2/3 w-full bg-gray-100  flex items-center justify-center">
        <video
          ref={videoRef}
          style={{ transform: "scaleX(-1)" }}
          autoPlay
          playsInline
          muted
          className="w-full  object-cover"
        />
      </div>
      <div className="md:w-1/3  bg-gray-100 flex flex-col justify-center items-center p-6 space-y-6 shadow-md mt-4 h-full">
        <h2 className="text-xl font-bold text-gray-700 text-center">
          Enter Room ID
        </h2>

        {/* Room ID Form */}
        <form onSubmit={handleSubmit} className="w-full  space-y-4">
          <input
            type="text"
            placeholder="Enter room code"
            className="w-full px-3 py-2  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-300 transition"
          >
            Join Room
          </button>
        </form>

        {/* Opponent Placeholder */}
      </div>
    </div>
  );
};

export default SessionLobby;

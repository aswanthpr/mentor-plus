import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { constraints } from "../../../Constants/const Values";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const SIGNALING_SERVER_URL = `${import.meta.env?.VITE_SERVER_URL}/webrtc`;

const VideoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId: string | null = location.state?.sessionId;
  const userId: string | null = location.state?.userId;
  const role = location.pathname.split("/")?.[1];
  const { roomId } = useParams<{ roomId: string }>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const signalingSocket = useRef<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    const initCall = async () => {
      try {
        if (peerConnection.current || signalingSocket.current) {
          return; // Prevent duplicate connections
        }

        // Get local stream only once
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream); // Update state but DO NOT add localStream to dependencies
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Set up peer connection
        peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
        stream
          .getTracks()
          .forEach((track) => peerConnection.current?.addTrack(track, stream));

        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams.length > 0) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            signalingSocket.current?.emit(
              "ice-candidate",
              event.candidate,
              roomId
            );
          }
        };

        //  Initialize signaling socket
        signalingSocket.current = io(SIGNALING_SERVER_URL);
        if (!roomId || !sessionId || !userId) {
          navigate(-1);
        }
        signalingSocket.current.on("connect", () => {
          signalingSocket.current?.emit("join-call", {
            roomId,
            sessionId,
            userId,
          });
        });

        signalingSocket.current.on("offer", async (offer, senderId) => {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(offer)
            );
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            signalingSocket.current?.emit("answer", answer, roomId, senderId);
          }
        });

        signalingSocket.current.on("answer", async (answer) => {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          }
        });

        signalingSocket.current.on("ice-candidate", async (candidate) => {
          if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
        });

        signalingSocket.current.on("user-joined", async (senderId) => {
          if (peerConnection.current) {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            signalingSocket.current?.emit("offer", offer, roomId, senderId);
          }
        });
        signalingSocket.current.on("join-fail", (message) => {
          toast.error(message);
          navigate(-1);
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initCall();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (signalingSocket.current) {
        signalingSocket.current.disconnect();
        signalingSocket.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };
  const endCall = () => {
    // Close Peer Connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Stop Local Stream Tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    navigator.mediaDevices.getUserMedia({ video: false, audio: false });
    // Disconnect from Signaling Server
    if (signalingSocket.current) {
      signalingSocket.current.disconnect();
      signalingSocket.current = null;
    }

    // Redirect to Home Page
    navigate(`/${role}/${role == "mentor" ? "session" : "bookings"}`);
  };
  return (
    <div className="fixed  lg:ml-64  mt-32   mb-2  inset-0 flex items-center justify-center">
      <video
        ref={remoteVideoRef}
        style={{ transform: "scaleX(-1)" }}
        autoPlay
        className=" w-[calc(100vw-0px)] h-[calc(100vh-1px)] object-cover bg-[#000000] p-3 border-black rounded-3xl rounded-b-sm"
      />
      <video
        style={{ transform: "scaleX(-1)" }}
        ref={localVideoRef}
        autoPlay
        muted
        className="absolute bottom-5 right-5 w-96 h-64 object-cover bg-gray-900 rounded-lg"
      />
      <div className="absolute bottom-5 flex space-x-4 bg-gray-900 p-3 rounded-full">
        <button onClick={toggleAudio}>
          {isAudioOn ? (
            <Mic className="text-green-200" />
          ) : (
            <MicOff className="text-red-200" />
          )}
        </button>
        <button onClick={toggleVideo}>
          {isVideoOn ? (
            <Video className="text-green-200" />
          ) : (
            <VideoOff className="text-red-200" />
          )}
        </button>
        <button onClick={endCall}>
          <PhoneOff className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default VideoPage;

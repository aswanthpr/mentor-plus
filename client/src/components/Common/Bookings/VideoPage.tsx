import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { constraints } from "../../../Constants/constValues";
import useTurn from "../../../Hooks/useturn";

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
  const [remoteStreamStarted, setRemoteStreamStarted] = useState(false);

  const { iceServers, turnErr, loading } = useTurn();

  const ICE_SERVERS: TurnCredentials | null = iceServers || null;

  const mergedIceServers: RTCConfiguration = {
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] },
      ...(ICE_SERVERS?.iceServers || []),
    ],
  };

  useEffect(() => {
    const initCall = async () => {
      try {
        if (
          peerConnection.current ||
          signalingSocket.current ||
          !iceServers ||
          loading
        ) {
          return; // Prevent duplicate connections
        }

        // Get local stream only once
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream); // Update state but DO NOT add localStream to dependencies

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Set up peer connection
        peerConnection.current = new RTCPeerConnection(mergedIceServers);
        stream
          .getTracks()
          .forEach((track) => peerConnection.current?.addTrack(track, stream));

        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams.length > 0) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setRemoteStreamStarted(true);
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
            const offer = await peerConnection.current.createOffer({
              iceRestart: true,
            });
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
        if (turnErr) toast.error(turnErr);
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
      setRemoteStreamStarted(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, iceServers, loading]);

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
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{
          transform: "scaleX(-1)",
          // display: remoteStreamStarted ? "block" : "none",
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Show message when remote stream not started */}
      {!remoteStreamStarted && (
        <div className="text-xl font-semibold animate-pulse absolute z-50">
          Waiting for other participant to join... {remoteStreamStarted}
        </div>
      )}

      {/* Local video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        // playsInline
        style={{ transform: "scaleX(-1)" }}
        className="absolute bottom-24 right-6 w-64 h-40 md:w-80 md:h-52 rounded-xl border-2 border-white shadow-lg object-cover z-40"
      />

      {/* Control Buttons */}
      <div className="absolute bottom-6 flex space-x-5 items-center justify-center bg-black/50 px-6 py-4 rounded-full shadow-xl backdrop-blur-sm z-50">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition duration-200 ${
            isAudioOn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isAudioOn ? (
            <Mic className="text-white" />
          ) : (
            <MicOff className="text-white" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition duration-200 ${
            isVideoOn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isVideoOn ? (
            <Video className="text-white" />
          ) : (
            <VideoOff className="text-white" />
          )}
        </button>

        <button
          onClick={endCall}
          className="p-3 bg-red-700 hover:bg-red-800 rounded-full transition duration-200"
        >
          <PhoneOff className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoPage;

import { io, Socket } from "socket.io-client";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private signalingSocket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private constraints: MediaStreamConstraints;

  constructor(
    remoteVideoRef: React.RefObject<HTMLVideoElement>,
    localVideoRef: React.RefObject<HTMLVideoElement>,
    constraints: MediaStreamConstraints
  ) {
    this.remoteVideoRef = remoteVideoRef;
    this.localVideoRef = localVideoRef;
    this.constraints = constraints;
  }

  async initCall(roomId: string, sessionId: string, userId: string, signalingUrl: string, onFail: (msg: string) => void) {
    try {
      if (this.peerConnection || this.signalingSocket) return; // Prevent duplicates

      this.localStream = await navigator.mediaDevices.getUserMedia(this.constraints);
      if (this.localVideoRef.current) this.localVideoRef.current.srcObject = this.localStream;

      this.peerConnection = new RTCPeerConnection(ICE_SERVERS);
      this.localStream.getTracks().forEach((track) => this.peerConnection?.addTrack(track, this.localStream!));

      this.peerConnection.ontrack = (event) => {
        if (this.remoteVideoRef.current && event.streams.length > 0) {
          this.remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.signalingSocket?.emit("ice-candidate", event.candidate, roomId);
        }
      };

      this.setupSocket(signalingUrl, roomId, sessionId, userId, onFail);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  private setupSocket(signalingUrl: string, roomId: string, sessionId: string, userId: string, onFail: (msg: string) => void) {
    this.signalingSocket = io(signalingUrl);

    this.signalingSocket.on("connect", () => {
      this.signalingSocket?.emit("join-call", { roomId, sessionId, userId });
    });

    this.signalingSocket.on("join-fail", (message) => {
      onFail(message);
    });

    this.signalingSocket.on("offer", async (offer, senderId) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.signalingSocket?.emit("answer", answer, roomId, senderId);
      }
    });

    this.signalingSocket.on("answer", async (answer) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    this.signalingSocket.on("ice-candidate", async (candidate) => {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    this.signalingSocket.on("user-joined", async (senderId) => {
      if (this.peerConnection) {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.signalingSocket?.emit("offer", offer, roomId, senderId);
      }
    });
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    }
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  }

  endCall(navigate: (path: string) => void, role: string) {
    this.peerConnection?.close();
    this.peerConnection = null;

    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;

    this.signalingSocket?.disconnect();
    this.signalingSocket = null;

    navigate(`/${role}/${role === "mentor" ? "session" : "bookings"}`);
  }
}

// // src/services/webrtcService.ts
// import { io, Socket } from "socket.io-client";

// const ICE_SERVERS = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// const SIGNALING_SERVER_URL = import.meta.env?.VITE_SERVER_URL + "/webrtc";

// export class WebRTCService {
//   private peerConnection: RTCPeerConnection;
//   private socket: Socket | null = null;
//   private localStream: MediaStream | null = null;

//   constructor() {
//     this.peerConnection = new RTCPeerConnection(ICE_SERVERS);
//   }

//   async initLocalStream(constraints: MediaStreamConstraints) {
//     this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
//     this.localStream.getTracks().forEach((track) =>
//       this.peerConnection.addTrack(track, this.localStream!)
//     );
//     return this.localStream;
//   }

//   connectSocket(roomId: string, onTrack: (stream: MediaStream) => void) {
//     if (this.socket) return;

//     this.socket = io(SIGNALING_SERVER_URL);
    
//     this.socket.on("connect", () => {
//       this.socket?.emit("join-call", roomId);
//     });

//     this.peerConnection.ontrack = (event) => {
//       if (event.streams.length > 0) {
//         onTrack(event.streams[0]); // Call the provided function
//       }
//     };

//     this.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.socket?.emit("ice-candidate", event.candidate, roomId);
//       }
//     };

//     this.socket.on("offer", async (offer, senderId) => {
//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await this.peerConnection.createAnswer();
//       await this.peerConnection.setLocalDescription(answer);
//       this.socket?.emit("answer", answer, roomId, senderId);
//     });

//     this.socket.on("answer", async (answer) => {
//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//     });

//     this.socket.on("ice-candidate", async (candidate) => {
//       await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     this.socket.on("user-joined", async (senderId) => {
//       const offer = await this.peerConnection.createOffer();
//       await this.peerConnection.setLocalDescription(offer);
//       this.socket?.emit("offer", offer, roomId, senderId);
//     });
//   }

//   toggleVideo(isEnabled: boolean) {
//     if (this.localStream) {
//       const videoTrack = this.localStream.getVideoTracks()[0];
//       if (videoTrack) videoTrack.enabled = isEnabled;
//     }
//   }

//   toggleAudio(isEnabled: boolean) {
//     if (this.localStream) {
//       const audioTrack = this.localStream.getAudioTracks()[0];
//       if (audioTrack) audioTrack.enabled = isEnabled;
//     }
//   }

//   endCall() {
//     this.peerConnection.close();
//     this.socket?.disconnect();
//     this.localStream?.getTracks().forEach((track) => track.stop());
//   }
// }

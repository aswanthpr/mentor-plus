import { MicOff } from "lucide-react";

interface ParticipantVideoProps {
  participant: {
    id: string;
    name: string;
    avatar: string;
    isMuted: boolean;
    isVideoOff: boolean;
  };
  isLocal: boolean;
  className?: string;
}

const VideoContainer: React.FC<ParticipantVideoProps> = ({
  participant,
  isLocal,
  className = "",
}) => (
  <div
    key={participant.id}
    className={`relative bg-gray-800 rounded-lg overflow-hidden ${className}`}
  >
    {participant.isVideoOff ? (
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={participant.avatar}
          alt={participant.name}
          className="w-20 h-20 rounded-full"
        />
      </div>
    ) : (
      <video
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={participant.isMuted || isLocal}
      />
    )}
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      <span className="text-white bg-black/50 px-2 py-1 rounded-lg text-sm">
        {participant.name} {isLocal && "(You)"}
      </span>
      {participant.isMuted && (
        <span className="bg-red-500 p-1 rounded-full">
          <MicOff className="h-4 w-4 text-white" />
        </span>
      )}
    </div>
  </div>
);

export default VideoContainer;

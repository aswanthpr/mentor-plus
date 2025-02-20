import { X } from "lucide-react";

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoinCall: () => void;
    sessionDetails: {
      mentor: string;
      topic: string;
      duration: string;
    };
  }


const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, onJoinCall, sessionDetails }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Join Video Session</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
  
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mentor</label>
              <p className="mt-1 text-lg">{sessionDetails.mentor}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Topic</label>
              <p className="mt-1 text-lg">{sessionDetails.topic}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <p className="mt-1 text-lg">{sessionDetails.duration}</p>
            </div>
          </div>
  
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onJoinCall}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
            >
              Join Session
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default VideoCallModal
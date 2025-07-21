
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import profileImg from "../../../Asset/user.png"
const MentorCard: React.FC<SessionCardProps> = ({ session, handleCancelSession }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <img
         loading="lazy"
          src={session?.mentorAvatar??profileImg}
          alt={session?.mentorName}
          className="w-12 h-12 rounded-full"
          />
        <div>
          <h3 className="font-medium text-gray-900">{session?.mentorName}</h3>
          <p className="text-sm text-gray-500">{session?.topic}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          session.status === 'scheduled'
          ? 'bg-green-100 text-green-800'
          : session.status === 'completed'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-red-100 text-red-800'
        }`}>
        {session.status.charAt(0).toUpperCase() + session?.status?.slice(1)}
      </span>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {format(new Date(session?.date), 'MMM d, yyyy')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {session?.time} ({session?.duration} min)
        </span>
      </div>
      <div className="flex justify-end">
        {session.status === 'scheduled' && (
            <div className="flex gap-2">
            <button 
              onClick={() => handleCancelSession(session.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
              Cancel
            </button>
            <button className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium">
              Join session
            </button>
          </div>
        )}
         
      </div>
    </div>

  </div>
);

export default MentorCard
import React from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
// import { Session } from './types';
interface Session {
    id: string;
    mentorName: string;
    mentorAvatar: string;
    date: string;
    time: string;
    duration: number;
    topic: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    rating?: number;
    review?: string;
  }
interface SessionCardProps {
  session: Session;
  handleCancelSession: (sessionId: string) => void;
  handleRating: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, handleCancelSession, handleRating }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <img
          src={session.mentorAvatar}
          alt={session.mentorName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-medium text-gray-900">{session.mentorName}</h3>
          <p className="text-sm text-gray-500">{session.topic}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        session.status === 'scheduled'
          ? 'bg-green-100 text-green-800'
          : session.status === 'completed'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
      </span>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {format(new Date(session.date), 'MMM d, yyyy')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {session.time} ({session.duration} min)
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
              Join
            </button>
          </div>
        )}
        {session.status === 'completed' && !session.rating && (
          <button
            onClick={() => handleRating(session.id)}
            className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium"
          >
            Rate Session
          </button>
        )}
        {session.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{session.rating}/5</span>
          </div>
        )}
      </div>
    </div>

    {session.review && (
      <div className="mt-4 text-sm text-gray-600 border-t pt-4">
        <p className="italic">"{session.review}"</p>
      </div>
    )}
  </div>
);

export default SessionCard;

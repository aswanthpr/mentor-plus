import React from 'react';
import SessionCard from './SessionCard';
import { Search } from 'lucide-react';

interface SessionListProps {
    sessions: ISession[];
    searchQuery: string;
    handleCancelSession: (sessionId: string) => void;
    handleRating: (session: ISession) => void;
    handleSearchQueryChange: (query: string) => void;
}
// interface Session {
//     id: string;
//     mentorName: string;
//     mentorAvatar: string;
//     date: string;
//     time: string;
//     duration: number;
//     topic: string;
//     status: 'scheduled' | 'completed' | 'cancelled';
//     rating?: number;
//     review?: string;
// }

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  searchQuery,
  handleCancelSession,
  handleRating,
  handleSearchQueryChange
}) => {


  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by mentor or topic..."
          value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
        />
      </div>
      
      <div className="space-y-4">
        {sessions.map(session => (
          <SessionCard 
         
            key={session?._id} 
            session={session} 
            handleCancelSession={handleCancelSession} 
            handleRating={handleRating} 
          />
        ))}
      </div>
    </div>
  );
};

export default SessionList;
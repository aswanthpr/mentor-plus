import React, { useState } from 'react'
import RatingModal from '../../components/Common/Bookings/RatingModal'
import { Search, User } from 'lucide-react';
import SessionCard from '../../components/Common/Bookings/SessionCard';
import { Pagination } from '../../components/Common/common4All/Pagination';
import TabNavigation from '../../components/Common/Bookings/TabNavigation';
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
  const mockSessions: Session[] = [
    {
      id: '1',
      mentorName: 'John Doe',
      mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      date: '2024-03-25',
      time: '10:00',
      duration: 60,
      topic: 'React Performance Optimization',
      status: 'scheduled',
    },
    {
      id: '2',
      mentorName: 'Jane Smith',
      mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      date: '2024-03-20',
      time: '15:00',
      duration: 45,
      topic: 'TypeScript Best Practices',
      status: 'completed',
      rating: 4,
      review: 'Great session! Learned a lot about TypeScript best practices.',
    },
  ];
  

const Boooking: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [sessions, setSessions] = useState<Session[]>(mockSessions);
    const sessionsPerPage = 5;

    const handleCancelSession = (sessionId: string) => {
        if (window.confirm('Are you sure you want to cancel this session?')) {
            setSessions(sessions.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'cancelled' }
                    : session
            ));
        }
    };

    const handleRating = (sessionId: string) => {
        setSelectedSession(sessionId);
        setShowRatingModal(true);
    };

    const handleSubmitRating = (rating: number, review: string) => {
        setSessions(sessions.map(session =>
            session.id === selectedSession
                ? { ...session, rating, review }
                : session
        ));
    };

    const filteredSessions = sessions.filter(session => {
        const isUpcoming = session.status === 'scheduled';
        const matchesSearch = session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
        return (activeTab === 'upcoming' ? isUpcoming : !isUpcoming) && matchesSearch;
    });

    const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * sessionsPerPage,
        currentPage * sessionsPerPage
    );

    return (

    <div className="space-y-6 mt-10">
      <div className="bg- p-6 round ">
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>
        
        <TabNavigation

       activeTab={activeTab}
       firstTab='upcoming'
       secondTab='history'
       onTabChange={(tab) => setActiveTab(tab as 'upcoming' | 'history')}

       
       />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6 flex">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 " />
            <input
              type="search"
              placeholder="Search by mentor or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent "
            />
          </div>
        </div>

        <div className="space-y-4">
          {paginatedSessions.map(session => (
            <SessionCard
             handleCancelSession={handleCancelSession} 
            handleRating={handleRating}
            key={session.id} 
            session={session} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-[#ff8800] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        {paginatedSessions.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming sessions"
                : "You don't have any past sessions"}
            </p>
          </div>
        )}
      </div>
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleSubmitRating}
                sessionId={selectedSession}
            />
            {/* <Pagination
            currentPage={1}
            onPageChange={}
            totalPages={10}/> */}
        </div>
    )
}

export default Boooking
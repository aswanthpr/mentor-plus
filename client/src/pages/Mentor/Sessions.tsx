import React, { useState } from 'react'
import TabNavigation from '../../components/Common/Bookings/TabNavigation'
import { Search } from 'lucide-react'
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
const Sessions = () => {
    const [activeTab,setActiveTab]=useState<"upcoming"|"history">('upcoming');
    const [searchQuery,setSearchQuery] = useState<string>('')

  return (
    <div>
        <div className="bg- p-6 mt-10 ">
        <h1 className="text-2xl font-bold mb-6">Sessions</h1>
        
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
        </div>
    </div>
  )
}

export default Sessions
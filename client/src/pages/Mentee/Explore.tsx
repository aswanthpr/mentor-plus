import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import SearchBar from '../../components/Mentee/SearchBar'; '../../components/dashboard/explore/SearchBar';
import Filters from '../../components/Mentee/Filters';
import MentorCard from '../../components/Mentee/MentorCard';
import { Mentor } from '../../components/Mentee/MentorCard';
import { MentorFilters } from '../../components/Mentee/Filters';
import { protectedAPI } from '../../Config/Axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/Common/Spinner';
import { errorHandler } from '../../Utils/Reusable/Reusable';

// Mock data - Replace with API calls
// const mockMentors: Mentor[] = [
//     {
//         id: '1',
//         name: 'John Doe',
//         avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//         title: 'Senior Full Stack Developer',
//         expertise: ['React', 'Node.js', 'TypeScript'],
//         rating: 4.8,
//         reviewCount: 124,
//         hourlyRate: 75,
//         availability: 'available',
//         bio: 'Experienced developer specializing in React and Node.js. Passionate about teaching and helping others grow in their career.',
//     },
//     {
//         id: '2',
//         name: 'Jane Smith',
//         avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//         title: 'DevOps Engineer',
//         expertise: ['AWS', 'Docker', 'Kubernetes'],
//         rating: 4.9,
//         reviewCount: 89,
//         hourlyRate: 90,
//         availability: 'busy',
//         bio: 'Cloud infrastructure expert with a focus on AWS and containerization. Love sharing knowledge about modern DevOps practices.',
//     },
// ];

const ExplorePage: React.FC = () => {
    const [loading,setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<MentorFilters>({
        expertise: [],
        priceRange: [0, 200],
        availability: [],
        rating: 0,
    });
    const [mentors, setMentors] = useState<IMentor[]>([{
        _id: '',
        bio: '',
        name: '',
        email: '',
        phone: '',
        githubUrl: '',
        linkedinUrl: '',
        verified: true,
        isBlocked:false,
        profileUrl: '',
        jobTitle: '',
        category: '',
        skills: [],
        resume: '',
      }]);
      
    const [categories,setCategories]=useState<ICategory[]>([])

    const handleBook = (mentorId: string) => {
        console.log('Booking session with mentor:', mentorId);
        // Implement booking logic
    };

    useEffect(() => {

        const fetchMentor = async () => {

            try {
                setLoading(true)
                const response = await protectedAPI.get(`/mentee/explore`);
                console.log(response.config, '444444444444444444444444444444444');
                setMentors(response.data.mentor);
                setCategories(response.data.category)
            } catch (error: any) {
                errorHandler(error)
            }finally{
                setTimeout(()=>{
                    setLoading(false)
                },500)
            }

        }
        fetchMentor()
        console.log(categories,mentors)
    },[])
    return (
        <div className="relative mx-20 mt-20 ">
            {loading && <Spinner/>}
            {/* Mobile Filters Modal */}
            {showFilters && (
                <div className=" fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden ">
                    <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-400 hover:text-gray-600 "
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <Filters filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar - Desktop */}
                <div className="hidden lg:block w-64 ml-8 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
                        <Filters filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 ">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 smr-6">
                        <div className="flex-1 z-0">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>

                        <button
                            onClick={() => setShowFilters(true)}
                            className="lg:hidden px-4 mt-6 flex items-center justify-center gap-2 mx-8 border border-gray-300 rounded-lg hover:bg-gray-50 py-2 "
                        >
                            <Filter className="h-5 w-5 mx-" />
                            <span>Filters</span>
                        </button>

                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {mentors.map((mentor) => (
                            <MentorCard
                                key={mentor._id}
                                mentor={mentor}
                                onBook={handleBook}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
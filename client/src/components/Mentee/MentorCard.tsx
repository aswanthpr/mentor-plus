import React from 'react';
// import { Star, Clock } from 'lucide-react';
export interface Mentor extends Partial<IMentor>  {
    _id?: string;
    name: string;
    profileUrl: string;
    jobTitle: string;
    category: string;
    // rating?: number;
    // reviewCount?: number;
    // hourlyRate?: number;
    // availability?: 'available' | 'busy' | 'offline';
    bio: string;
    linkedinUrl: string;
    skills: string[];
    githubUrl: string;

  }

 

  interface MentorCardProps {
    mentor: Mentor;
    onBook: (mentorId: string) => void;
  }
  
  const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBook }) => {
    // const availabilityColor = {
    //   available: 'bg-green-500',
    //   busy: 'bg-yellow-500',
    //   offline: 'bg-gray-400',
    // }[mentor.availability??"available"];
  
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow mx-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <img
            src={mentor?.profileUrl}
            alt={mentor?.name}
            className="w-16 h-16 rounded-full object-cover mx-auto sm:mx-0"
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 text-center sm:text-left">{mentor?.name}</h3>
              {/* <div className="flex items-center justify-center sm:justify-start gap-1">
                <div className={`w-2 h-2 rounded-full ${availabilityColor}`} />
                <span className="text-sm text-gray-500 capitalize">{mentor?.availability}</span>
              </div> */}
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center sm:text-left">{mentor?.jobTitle} |{mentor?.category}</p>
            {/* <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{mentor.rating}</span>
                <span className="text-sm text-gray-500">({mentor.reviewCount})</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm text-gray-600">${mentor.hourlyRate}/hr</span>
              </div>
            </div> */}
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              {mentor.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-2 text-center sm:text-left">{mentor.bio}</p>
        <button
          onClick={() => onBook(mentor?._id as string)}
          className="mt-4 w-full px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] transition-colors"
        >
          Book Session
        </button>
      </div>
    );
  };
  
  export default MentorCard;
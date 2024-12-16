import React from 'react';
export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  jobTitle: string;
  rating: number;
  skills: string[];
  hourlyRate: number;
}

interface MentorListProps {
  mentors: Mentor[];
  onBook: (mentorId: string) => void;
}

const MentorCard: React.FC<MentorListProps> = ({ mentors, onBook }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {mentors.map(mentor => (
        <div key={mentor.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{mentor.name}</h3>
              <p className="text-sm text-gray-500">{mentor.jobTitle}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-lg font-semibold">${mentor.hourlyRate}/hr</span>
            <button
              onClick={() => onBook(mentor.id)}
              className="px-3 py-1 bg-[#ff8800] text-white rounded-lg"
            >
              Book
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorCard;

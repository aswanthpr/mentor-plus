import { BadgeCheckIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
// import { Star, Clock } from 'lucide-react';

interface MentorCardProps {
  mentor: IMentor;
  // onBook: (name: string,mentor:IMentor) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  // const availabilityColor = {
  //   available: 'bg-green-500',
  //   busy: 'bg-yellow-500',
  //   offline: 'bg-gray-400',
  // }[mentor.availability??"available"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-6 hover:shadow-md transition-shadow mx-1">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <img
          src={mentor?.profileUrl}
          alt={mentor?.name}
          className="w-16 h-16 rounded-full object-cover mx-auto sm:mx-0"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center  gap-2">
            <div className="flex items-center gap-2 justify-center ">
              <h3 className="text-lg font-semibold text-gray-900 ">
                {mentor?.name}
              </h3>
              <span className="mt-1">
                <BadgeCheckIcon className="ml-1 text-green-600 w-5" />
              </span>
            </div>
            {/* <div className="flex items-center justify-center sm:justify-start gap-1">
                <div className={`w-2 h-2 rounded-full ${availabilityColor}`} />
                <span className="text-sm text-gray-500 capitalize">{mentor?.availability}</span>
              </div> */}
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center sm:text-left">
            {mentor?.jobTitle} |{mentor?.category}
          </p>
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
      <p className="mt-4 text-sm text-gray-600 line-clamp-2 text-center sm:text-left">
        {/* {mentor.bio} */}
      </p>
      {/* <button
        onClick={() => onBook(mentor?.name as string,mentor as IMentor)}
        className="mt-4 w-full px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] transition-colors"
      >
        Book Session
      </button> */}
      <Link
        to={`/mentee/explore/${mentor?.name.toLowerCase()}`}
        state={mentor}
        className="mt-4 w-full px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] font-semibold transition-colors block text-center mx-auto"
      >
        View Profile
      </Link>
    </div>
  );
};

export default MentorCard;

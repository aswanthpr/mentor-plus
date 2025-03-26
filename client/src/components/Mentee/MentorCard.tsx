import { BadgeCheckIcon, Star } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants/message";
import profileImg from "../../Asset/user.png";
const MentorCard: React.FC<{ mentor: IMentor}> = ({ mentor }) => {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-6 hover:shadow-md transition-shadow mx-1">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <img
          src={mentor?.profileUrl??profileImg}
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

          </div>
          <p className="text-sm text-gray-600 mt-1 text-center sm:text-left">
            {mentor?.jobTitle} |{mentor?.category}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="flex items-center">
                
                <span className="ml-1 text-sm font-medium">{mentor?.averageRating?mentor?.averageRating?.toFixed(1):0}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
      
              </div>
              
            </div>
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
      <div className=" flex space-x-2">

      <Link
        to={`${ROUTES?.MENTEE_EXPLORE}/${mentor?.name.toLowerCase()}`}
        state={mentor}
        className="mt-4 w-2/6 px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] font-medium transition-colors block text-center mx-auto"
      >
        Profile
      </Link>
      <Link
        to={`/mentee/${decodeURIComponent(mentor?.name)}/slot-booking`}
        state={{mentorId:mentor?._id}}
        className="mt-4 w-4/6 px-4 py-2 bg-[#ff8800]  text-white rounded-lg hover:bg-[#ff9900] font-medium transition-colors block text-center "
      >
       Book Now   
      </Link>
      </div>
    </div>
  );
};

export default MentorCard;

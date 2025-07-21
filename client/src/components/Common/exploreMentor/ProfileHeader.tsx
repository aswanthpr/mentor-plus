import { Clock, Github, Linkedin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import profileImg from "../../../Asset/user.png";
export const ProfileHeader = ({ mentorData }: ProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-l from-orange-300 to-orange-400 text-white rounded-md">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 ">
          <div className="relative">
            <img  loading="lazy"
              src={mentorData?.profileUrl??profileImg}
              alt={mentorData?.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover "
            />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {mentorData?.name}
            </h1>
            <p className="text-md font-light    mb-1">{mentorData?.category}</p>
            <p className="text-white/90 mb-2  font-light">
              {mentorData?.jobTitle}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              {/* <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{location}</span>
              </div> */}
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-300" />
                <span>{mentorData?.averageRating?.toFixed(1)} (rating)</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>{status}</span>
              </div> */}
              <div className="flex">
                <div className="flex items-center gap-1 text-gray-100">
                  <Link to={mentorData?.linkedinUrl as string}>
                    <Linkedin className="w-5" />
                  </Link>
                </div>
                <div className="flex items-center gap-1 ml-3 text-gray-100">
                  <Link to={mentorData?.githubUrl as string}>
                    <Github className="w-5" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} />
                <span>'Usually responds in a few hours'</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

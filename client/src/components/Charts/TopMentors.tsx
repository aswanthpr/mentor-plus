import React from "react";
import { IndianRupee, Star } from "lucide-react";
import profileImg from "../../Asset/user.png";
const TopMentors: React.FC<TopMentorsProps> = React.memo(({ mentors }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-6 ">Top Performing Mentors</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expertise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Earnings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sessions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentors?.map((mentor) => (
              <tr key={mentor?.mentorId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={mentor?.profileUrl ?? profileImg}
                      alt={mentor?.mentorName}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {mentor?.mentorName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {mentor?.category}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {mentor?.totalRevenue?.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="ml-1 text-sm text-gray-900">
                      {mentor?.averageRating?.toFixed(1)}
                    </span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </td>
                <td className=" px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mentor?.totalSessions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default TopMentors;

import React from 'react';
import { Star, ArrowUp, ArrowDown } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  expertise: string;
  earnings: number;
  rating: number;
  sessions: number;
  growth: number;
}

interface TopMentorsProps {
  mentors: Mentor[];
}

const TopMentors: React.FC<TopMentorsProps> = ({ mentors }) => {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentors.map((mentor) => (
              <tr key={mentor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={mentor.avatar}
                      alt={mentor.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{mentor.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{mentor.expertise}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">${mentor.earnings.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-900">{mentor.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mentor.sessions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${
                    mentor.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mentor.growth >= 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span className="ml-1 text-sm">{Math.abs(mentor.growth)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopMentors;
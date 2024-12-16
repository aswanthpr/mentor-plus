// import React, { useState } from 'react';
// import MentorList from '../../components/explore/MentorList';
// export interface Mentor {
//   id: string;
//   name: string;
//   avatar: string;
//   jobTitle: string;
//   rating: number;
//   skills: string[];
//   hourlyRate: number;
// }

// // Mock data (Replace with API calls as needed)
// const mockSkills: FilterOption[] = [/*...same as before...*/];
// const mockJobTitles: FilterOption[] = [/*...same as before...*/];
// const mockMentors: Mentor[] = [/*...same as before...*/];

// const Explore: React.FC = () => {
//   const [skills, setSkills] = useState(mockSkills);
//   const [jobTitles, setJobTitles] = useState(mockJobTitles);
//   const [sortOption, setSortOption] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const handleSkillChange = (value: string) => {
//     setSkills(skills.map(skill => 
//       skill.value === value ? { ...skill, checked: !skill.checked } : skill
//     ));
//   };

//   const handleJobTitleChange = (value: string) => {
//     setJobTitles(jobTitles.map(title => 
//       title.value === value ? { ...title, checked: !title.checked } : title
//     ));
//   };

//   const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortOption(event.target.value);
//   };

//   const handleBook = (mentorId: string) => {
//     console.log('Booking mentor:', mentorId);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 p-6 border-r border-gray-200">
//         <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
//           <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
//             {skills.map(option => (
//               <label key={option.id} className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={option.checked}
//                   onChange={() => handleSkillChange(option.value)}
//                   className="h-4 w-4 text-[#ff8800] rounded border-gray-300 focus:ring-[#ff8800]"
//                 />
//                 <span className="text-sm text-gray-700">{option.label}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Titles</h3>
//           <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
//             {jobTitles.map(option => (
//               <label key={option.id} className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={option.checked}
//                   onChange={() => handleJobTitleChange(option.value)}
//                   className="h-4 w-4 text-[#ff8800] rounded border-gray-300 focus:ring-[#ff8800]"
//                 />
//                 <span className="text-sm text-gray-700">{option.label}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Mentor</h1>
//           <select
//             value={sortOption}
//             onChange={handleSortChange}
//             className="p-2 border border-gray-300 rounded-lg focus:ring-[#ff8800]"
//           >
//             <option value="">Sort by</option>
//             <option value="rating">Rating</option>
//             <option value="priceLowToHigh">Price: Low to High</option>
//             <option value="priceHighToLow">Price: High to Low</option>
//           </select>
//         </div>
// <div className='space-y-4'>


// </div>
//         <MentorList mentors={mockMentors} onBook={handleBook} />

//         <div className="mt-6 flex justify-center">
//           {/* Replace with actual pagination */}
//           <button
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-2 bg-gray-200 rounded-lg mr-2"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => setCurrentPage(currentPage + 1)}
//             className="px-3 py-2 bg-gray-200 rounded-lg"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Explore;

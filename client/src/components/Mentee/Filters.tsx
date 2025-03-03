// import React, { useState } from "react";
// import SelectField from "../Common/Schedule/SelectField";
// import { SelectChangeEvent } from "@mui/material";

// interface Category {
//   _id: string;
//   category: string;
//   isBlocked: boolean;
// }
// export interface MentorFilters {
//   categories: Category[];
//   skills: string[];
//   rating: number;
// }

// interface FiltersProps {
//   filters: MentorFilters;
//   onFilterChange: (filters: MentorFilters) => void;
//   handleSort?: (e: SelectChangeEvent<string>) => void;
// }

// const Filters: React.FC<FiltersProps> = ({
//   filters,
//   onFilterChange,
//   handleSort,
// }) => {
//   const [checkValue, setCheckedValue] = useState<string[]>([]);
//   const [checkedSkill, setCheckedSkill] = useState<string[]>([]);
// const [filterVal,setFilterVal] = useState({
//   domain:"",
//   skill:"",
//   sort:""
// })
//   const handleCheckboxChange = (category: string, isChecked: boolean) => {
//     if (isChecked) {
//       setCheckedValue((prevCheckedValues) => [...prevCheckedValues, category]);
//     } else {
//       setCheckedValue((prevCheckedValues) =>
//         prevCheckedValues.filter((item) => item !== category)
//       );
//     }
//   };

//   const handleSkillChange = (skill: string, isChecked: boolean) => {
//     if (isChecked) {
//       setCheckedSkill((prevCheckedValues) => [...prevCheckedValues, skill]);
//     } else {
//       setCheckedSkill((prevCheckedValues) =>
//         prevCheckedValues.filter((item) => item !== skill)
//       );
//     }
//   };
//   return (
//     <div className={"space-y-6 ml-2  "}>
//       <SelectField
//         label="Sort"
//         onChange={handleSort!}
//         placeholder="Select One"
//         options={["A-Z", "Z-A"]}
//         classNames="border w-full h-10 "
//         value={""}
//       />
//       <div>
//         <h3 className="text-lg font-semibold  text-gray-900 mb-3 ">Domain</h3>
//         <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
//           {filters.categories.map((categ) => (
//             <label key={categ._id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={checkValue.includes(categ.category)}
//                 onChange={
//                   (e: React.ChangeEvent<HTMLInputElement>) =>
//                     handleCheckboxChange(categ.category, e.target.checked)
//                   // onFilterChange({filters, categories: checkValue });
//                 }
//                 className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
//               />
//               <span
//                 key={categ._id}
//                 className="ml-2 text-md text-gray-600 font-semibold"
//               >
//                 {categ.category}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h3 className="text-lg text-gray-900 mb-3 font-semibold">Skills</h3>
//         <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
//           {filters.skills.map((skill) => (
//             <label key={skill} className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={checkedSkill.includes(skill)}
//                 onChange={(e) => handleSkillChange(skill, e.target.checked)}
//                 className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
//               />
//               <span
//                 key={skill}
//                 className="ml-2 text-md font-semibold text-gray-600 capitalize"
//               >
//                 {skill}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//       {/* 
//       <div>
//         <h3 className="text-sm font-medium text-gray-900 mb-3">
//           Minimum Rating
//         </h3>
//         <input
//           type="range"
//           min="0"
//           max="5"
//           step="0.5"
//           value={filters.rating}
//           onChange={(e) => {
//             onFilterChange({
//               ...filters,
//               rating: parseFloat(e.target.value),
//             });
//           }}
//           className="w-full custom-range"
//         />
//         <div className="text-sm text-gray-600 mt-1">
//           {filters.rating} stars and above
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default Filters;



import React, { useRef, useState } from "react";
import SelectField from "../Common/Schedule/SelectField";
import { SelectChangeEvent } from "@mui/material";

interface Category {
  _id: string;
  category: string;
  isBlocked: boolean;
}
export interface MentorFilters {
  categories: Category[];
  skills: string[];
  rating: number;
}

interface FiltersProps {
  filters: MentorFilters;
  onFilterChange: (filterVal:Ifilter) => void;

}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const filterRef = useRef<MentorFilters>(filters);

  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [checkedSkills, setCheckedSkills] = useState<string[]>([]);
  const [filterVal, setFilterVal] = useState<Ifilter>({sort:"",domain:[],skill:[]});

  const handleCheckboxChange = (category: string, isChecked: boolean) => {
    setCheckedCategories((prev) =>
      isChecked ? [...prev, category] : prev.filter((item) => item !== category)
    );
  };

  const handleSkillChange = (skill: string, isChecked: boolean) => {
    setCheckedSkills((prev) =>
      isChecked ? [...prev, skill] : prev.filter((item) => item !== skill)
    );
  };
  const handleSort = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFilterVal((pre) => ({ ...pre, sort: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = {
      domain: checkedCategories,
      skill: checkedSkills,
      sort: filterVal.sort,
    };
  
    setFilterVal(updatedFilters)
   
    onFilterChange(updatedFilters)
    setFilterVal({domain:[],skill:[],sort:""})
    setCheckedCategories([]);
    setCheckedSkills([]);
  };
  return (
    <form className="space-y-6 ml-2" onSubmit={handleSubmit}>
      <SelectField
        label="Sort"
        onChange={handleSort}
        placeholder="Select One"
        options={["A-Z", "Z-A"]}
        classNames="border w-full h-10"
        value={filterVal.sort}
      />
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Domain</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
          {(filters??filterRef.current)?.categories?.map((categ) => (
            <label key={categ._id} className="flex items-center">
              <input
                type="checkbox"
                checked={checkedCategories.includes(categ?.category)}
                onChange={(e) => handleCheckboxChange(categ?.category, e.target.checked)}
                className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
              />
              <span className="ml-2 text-md text-gray-600 font-semibold">{categ.category}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg text-gray-900 mb-3 font-semibold">Skills</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
          {(filters??filterRef.current)?.skills?.map((skill) => (
            <label key={skill} className="flex items-center">
              <input
                type="checkbox"
                checked={checkedSkills.includes(skill)}
                onChange={(e) => handleSkillChange(skill, e.target.checked)}
                className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
              />
              <span className="ml-2 text-md font-semibold text-gray-600 capitalize">{skill}</span>
            </label>
          ))}
        </div>
      </div>
      
      <button type="submit" className="w-full bg-[#ff8800] text-white py-2 rounded-lg hover:bg-[#e67e00]">
        Apply Filters
      </button>
    </form>
  );
};

export default Filters;

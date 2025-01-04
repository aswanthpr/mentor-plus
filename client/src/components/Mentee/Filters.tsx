import React, { useState } from "react";

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
  onFilterChange: (filters: MentorFilters) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const [checkValue,setCheckedValue]=useState<string[]>([])
  const [checkedSkill,setCheckedSkill]=useState<string[]>([])

  const handleCheckboxChange = (category: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedValue((prevCheckedValues) => [...prevCheckedValues, category]);
    } else {
      setCheckedValue((prevCheckedValues) =>
        prevCheckedValues.filter((item) => item !== category)
      );
    }
  };

  const handleSkillChange = (skill:string, isChecked:boolean) => {
    if (isChecked) {
      setCheckedSkill((prevCheckedValues) => [...prevCheckedValues, skill]);
    } else {
      setCheckedSkill((prevCheckedValues) =>
        prevCheckedValues.filter((item) => item !== skill)
      );
    }
  }
  return (
    <div className="space-y-6 ml-2">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3 ">Domain</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {filters.categories.map((categ) => (
            <label key={categ._id} className="flex items-center">
              <input
                type="checkbox"
                checked={checkValue.includes(categ.category)}
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>
                  handleCheckboxChange(categ.category, e.target.checked)
                  // onFilterChange({filters, categories: checkValue });
                }
                className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
              />
              <span key={categ._id} className="ml-2 text-sm text-gray-600">{categ.category}</span>
            </label>
          ))}
        </div>
      </div>



      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Skills</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {filters.skills.map((skill) => (
            <label key={skill} className="flex items-center">
              <input
                type="checkbox"
                checked={checkedSkill.includes(skill)}
                onChange={(e) => handleSkillChange(skill, e.target.checked)}
                className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
              />
              <span key={skill} className="ml-2 text-sm text-gray-600 capitalize">{skill}</span>
            </label>
          ))}
        </div>
      </div>
{/* 
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Minimum Rating
        </h3>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.rating}
          onChange={(e) => {
            onFilterChange({
              ...filters,
              rating: parseFloat(e.target.value),
            });
          }}
          className="w-full custom-range"
        />
        <div className="text-sm text-gray-600 mt-1">
          {filters.rating} stars and above
        </div>
      </div> */}
    </div>
  );
};

export default Filters;

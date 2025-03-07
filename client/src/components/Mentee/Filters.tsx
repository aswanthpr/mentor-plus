


import React, { useRef, useState } from "react";
import SelectField from "../Common/Schedule/SelectField";
import { SelectChangeEvent, Tooltip } from "@mui/material";
import { XCircleIcon } from "lucide-react";

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
const handleClearFilters = ()=>{
setFilterVal({ domain: [], skill: [], sort: "" });
setCheckedCategories([]);
setCheckedSkills([]);
}
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = {
      domain: checkedCategories,
      skill: checkedSkills,
      sort: filterVal.sort,
    };
  
    setFilterVal(updatedFilters)
   
    onFilterChange(updatedFilters)
    
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
        <h3 className="text-lg text-gray-900 mb-2 font-semibold">Skills</h3>
        <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
          {(filters??filterRef?.current)?.skills?.map((skill) => (
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
      <div className="flex flex-col">
          <Tooltip
        
          title={'clear filters'}
          arrow
        placement="top-end"
          children={
      <button
          type="button"
          onClick={handleClearFilters}
          className="flex items-center text-red-600 font-light hover:text-red-800 mb-1 justify-end mr-2 "
        >
          clear
        </button>

          }
          />

      <button type="submit" className="w-full bg-[#ff8800] text-white py-1 rounded-lg hover:bg-[#e67e00]">
        Apply Filters
      </button>
      </div>
    </form>
  );
};

export default Filters;

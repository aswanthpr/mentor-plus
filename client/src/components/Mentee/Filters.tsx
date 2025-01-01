import React from 'react';
export interface MentorFilters {
    expertise: string[];
    priceRange: [number, number];
    availability: string[];
    rating: number;
  }

  interface FiltersProps {
    filters: MentorFilters;
    onFilterChange: (filters: MentorFilters) => void;
  }
  
  const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
    return (
      <div className="space-y-6 ml-2">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Expertise</h3>
          <div className="space-y-2">
            {['React', 'Node.js', 'Python', 'Java', 'DevOps'].map((skill) => (
              <label key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.expertise.includes(skill)}
                  onChange={(e) => {
                    const newExpertise = e.target.checked
                      ? [...filters.expertise, skill]
                      : filters.expertise.filter((s) => s !== skill);
                    onFilterChange({ ...filters, expertise: newExpertise });
                  }}
                  className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
                />
                <span className="ml-2 text-sm text-gray-600">{skill}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                onFilterChange({
                  ...filters,
                  priceRange: [value, filters.priceRange[1]],
                });
              }}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                onFilterChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], value],
                });
              }}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
        </div>
  
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Availability</h3>
          <div className="space-y-2">
            {['available', 'busy', 'offline'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(status)}
                  onChange={(e) => {
                    const newAvailability = e.target.checked
                      ? [...filters.availability, status]
                      : filters.availability.filter((s) => s !== status);
                    onFilterChange({ ...filters, availability: newAvailability });
                  }}
                  className="rounded border-gray-300 text-[#ff8800] focus:ring-[#ff8800]"
                />
                <span className="ml-2 text-sm text-gray-600 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
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
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">{filters.rating} stars and above</div>
        </div>
      </div>
    );
  };
  
  export default Filters
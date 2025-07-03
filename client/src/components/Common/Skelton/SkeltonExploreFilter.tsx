// components/Mentee/Skeletons/FiltersSkeleton.tsx
import React from "react";

const SkeltonExploreFilter: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 ml-2">
      {/* Sort Dropdown */}
      <div className="h-10 bg-gray-200 rounded-md w-full" />

      {/* Domain Section */}
      <div>
        <div className="h-5 bg-gray-300 rounded w-24 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-300 rounded-sm" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <div className="h-5 bg-gray-300 rounded w-24 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-300 rounded-sm" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded self-end ml-auto" />
        <div className="h-8 bg-gray-300 rounded-md w-full" />
      </div>
    </div>
  );
};

export default SkeltonExploreFilter;

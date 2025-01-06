import React, { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import SearchBar from "../../components/Mentee/SearchBar";
import Filters from "../../components/Mentee/Filters";
import MentorCard from "../../components/Mentee/MentorCard";

import { MentorFilters } from "../../components/Mentee/Filters";
import { protectedAPI } from "../../Config/Axios";
import Spinner from "../../components/Common/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";

const ExplorePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MentorFilters>({
    categories: [],
    skills: [],
    rating: 0,
  });
  const [mentors, setMentors] = useState<IMentor[]>([
    {
      _id: "",
      bio: "",
      name: "",
      email: "",
      phone: "",
      githubUrl: "",
      linkedinUrl: "",
      verified: true,
      isBlocked: false,
      profileUrl: "",
      jobTitle: "",
      category: "",
      skills: [],
    },
  ]);

  const handleBook = (mentorId: string) => {
    console.log("Booking session with mentor:", mentorId);
    // Implement booking logic
  };

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const { data } = await protectedAPI.get(`/mentee/explore`);
        console.log(data.skills, "data ");
        setMentors(data?.mentor);

        setFilters((prev) => ({
          ...prev,
          categories: data?.category,
          skills: data?.skills[0].skills,
        }));
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    fetchMentor();
    console.log(filters.categories, "wfassafafasf", filters.skills);
  }, []);
  return (
    <div className="relative mx-20 mt-20 ">
      {loading && <Spinner />}
      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className=" fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden ">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 "
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 ml-8 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Filters
            </h2>
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 smr-6">
            <div className="flex-1 z-0">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden px-4 mt-6 flex items-center justify-center gap-2 mx-8 border border-gray-300 rounded-lg hover:bg-gray-50 py-2 "
            >
              <Filter className="h-5 w-5 mx-" />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                onBook={handleBook}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

import React, { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import SearchBar from "../../components/Mentee/SearchBar";
import Filters from "../../components/Mentee/Filters";
import MentorCard from "../../components/Mentee/MentorCard";

import { MentorFilters } from "../../components/Mentee/Filters";
import { protectedAPI } from "../../Config/Axios";
// import Spinner from "../../components/Common/common4All/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";


const ExplorePage: React.FC = () => {
  const limit = 3;
  // const navigate = useNavigate()
  // const [loading, setLoading] = useState<boolean>(false);
    const [filterVal, setFilterVal] = useState<Ifilter>({sort:"",domain:[],skill:[]});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
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

  useEffect(() => {
    console.log(filterVal)
    const fetchMentor = async () => {
      try {
        const { data, status } = await protectedAPI.get(`/mentee/explore/`,{
          params:{
            search:searchQuery??"",
            categories:filterVal?.domain??[],
            skill:filterVal?.skill??[],
            sort:filterVal?.sort??'',
            page:currentPage,
            limit
          }
        });
        if (status == 200 && data) {
          console.log(data?.currentPage,data?.totalPage)
          setMentors(data?.mentor);
          setCurrentPage(data?.currentPage);
          setTotalPages(data?.totalPage)
          setFilters((prev) => ({
            ...prev,
            categories: data?.category,
            skills: data?.skills[0]?.skills,
          }));
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    };
    fetchMentor();
  }, [currentPage, filterVal, searchQuery]);

  return (
    <div className="relative mx-4 mt-10  ">
      {/* {loading && <Spinner />} */}
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
            <Filters  filters={filters} onFilterChange={setFilterVal} />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 ml-8 flex-shrink-0 ">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-24">

            <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-6">
              {/* Filters */}
            </h2>
            <Filters  filters={filters} onFilterChange={setFilterVal} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ">
          <div className="flex flex-col sm:flex-row gap-2 mb-4 mr-1">
            <div className="flex-1 z-0 xss:mx-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden px-4 mt-6 flex items-center justify-center gap-2 xss:mx-1 border border-gray-300 rounded-lg hover:bg-gray-50 py-2 "
            >
              <Filter className="h-5 w-5 " />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                // onBook={handleBook}
              />
            ))}
          </div>
          {mentors.length>3&&
          
          <div className="flex justify-center space-x-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Previous
            </button>

            <span className="px-4 py-2 border rounded">{currentPage} / {totalPages}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Next
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

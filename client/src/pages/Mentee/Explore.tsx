import { HttpStatusCode } from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { CircleAlertIcon, Filter, X } from "lucide-react";
import SearchBar from "../../components/Mentee/SearchBar";
import Filters from "../../components/Mentee/Filters";
import MentorCard from "../../components/Mentee/MentorCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchExplorePage } from "../../service/menteeApi";
import {
  FILTERS_EXPLORE,
  FITLER_VALUE_INITIAL,
} from "../../Constants/initialStates";
import useDebounce from "../../Hooks/useDebounce";
import SkeletonMentorCard from "../../components/Common/Skelton/SkeltonMentorCard";
import SkeltonExploreFilter from "../../components/Common/Skelton/SkeltonExploreFilter";

const ExplorePage: React.FC = () => {
  const limit = 4;
  const [filterVal, setFilterVal] = useState<Ifilter>(FITLER_VALUE_INITIAL);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MentorFilters>(FILTERS_EXPLORE);
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchMentor = useCallback(
    async (page: number, isNewSearch = false) => {
      setLoading(true);
      const response = await fetchExplorePage(
        debouncedSearchQuery,
        filterVal?.domain,
        filterVal?.skill,
        filterVal?.sort,
        page,
        limit
      );
      setLoading(false);
      if (response?.status === HttpStatusCode?.Ok && response?.data) {
        const newMentors = response?.data?.mentor || [];

        setMentors((prev) =>
          isNewSearch ? newMentors : [...prev, ...newMentors]
        );
        setHasMore(page < response?.data?.totalPage);
        setCurrentPage(page);

        setFilters((prev) => ({
          ...prev,
          categories: response?.data?.category,
          skills: response?.data?.skills[0]?.skills,
        }));
      }
    },
    [debouncedSearchQuery, filterVal?.domain, filterVal?.skill, filterVal?.sort]
  );

  useEffect(() => {
    fetchMentor(1, true); // Reset to page 1 on new search/filter
  }, [fetchMentor, filterVal, debouncedSearchQuery]);

  const fetchMoreMentors = () => {
    if (hasMore) {
      fetchMentor(currentPage + 1);
    }
  };

  return (
    <div className="relative mx-4 mt-10">
      {/* {loading && <Spinner />} */}

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <Filters filters={filters} onFilterChange={setFilterVal} />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 ml-8 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-6">
              Filters
            </h2>
            {loading ? (
              <SkeltonExploreFilter />
            ) : (
              <Filters filters={filters} onFilterChange={setFilterVal} />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">
          {/* Shared container */}
          <div className="w-full max-w-5xl px-2">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <div className="flex-1 z-0">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden px-4 mt-6 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 py-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mentor Cards */}
            {loading && mentors.length === 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {[...Array(4)].map((_, idx) => (
                  <SkeletonMentorCard key={idx} />
                ))}
              </div>
            ) : (
              <InfiniteScroll
                dataLength={mentors.length}
                next={fetchMoreMentors}
                hasMore={hasMore}
                loader={
                  <h4 className="text-center my-4">Loading more mentors...</h4>
                }
                endMessage={
                  <p className="flex justify-center text-center my-4 text-gray-500">
                    <CircleAlertIcon className="w-6 mr-1" /> No more mentors to
                    load.
                  </p>
                }
              >
                <div className="grid gap-2 w-full">
                  {mentors.map((mentor) => (
                    <MentorCard key={mentor?._id} mentor={mentor} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

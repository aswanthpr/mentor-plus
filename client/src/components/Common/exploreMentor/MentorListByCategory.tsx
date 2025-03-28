import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import profileImg from "../../../Asset/user.png";
import { Link } from "react-router-dom";

export const MentorListByCategory = ({
  title,
  mentors,
}: // onSeeAll,
MentorListByCategoryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {/* <button
          onClick={onSeeAll}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          See all →
        </button> */}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          disabled={scrollContainerRef.current?.scrollLeft === 0}
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {mentors?.map((mentor) => (
            <div
              key={mentor?._id}
              className="flex-shrink-0 w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Link to={`/mentee/explore/${mentor?.name}`} state={mentor}>
                <div className="relative">
                  <img
                    src={mentor?.profileUrl ?? profileImg}
                    alt={mentor?.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                    {mentor?.category}
                  </span>
                </div>
              </Link>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{mentor?.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {mentor?.jobTitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity "
        >
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MentorListByCategory;

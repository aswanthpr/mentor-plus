import { HandshakeIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import InputField from "../../components/Auth/InputField";
import QuestionFilter from "../../components/Common/Qa/QuestionFilter";


import AnswerModal from "../../components/Common/Qa/AnswerInputModal";
import QuestionList from "../../components/Common/Qa/QuestionsList";
import { Pagination } from "../../components/Common/common4All/Pagination";
import Spinner from "../../components/Common/common4All/Spinner";
import { axiosInstance } from "../../Config/mentorAxios";

const MentorHome: React.FC = () => {
  const [filter, setFilter] = useState<"answered" | "unanswered">("answered");

  console.log(filter,'filer undeyy')
  const [questions, setQuestions] = useState<IQuestion[] | []>([]);
  

  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(()=>{
    const fetchData = async () => {
          try {
            setLoading(false)
            const  response= await axiosInstance.get(`/mentor/home/${filter}`,);
    
            if (response?.status === 200 && response?.data?.success) {
    
              setQuestions(response?.data.homeData);
            }

          } catch (error: unknown) {
            console.log(
              `error while fetching home data ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          } 
        };
        fetchData();

  },[filter]);


  // const handleSearch = (query: string) => {
  //   console.log('Searching for:', query);
  //   // Implement search logic
  // };


  const handleShowAnswers = (questionId: string): void => {
    const question = questions.find((q) => q._id === questionId);
    if (question) {
      setSelectedQuestion(question);
      setShowAnswerModal(true);
    }
  };
  const filterQuestions = questions.filter((question) => {
    // Safely check if title, content, and tags exist before calling toLowerCase
    const title = question.title?.toLowerCase() || "";
    const content = question.content?.toLowerCase() || "";
    const tags = question.tags?.map((tag) => tag.toLowerCase()) || [];

    return (
      title.includes(searchQuery.toLowerCase()) ||
      content.includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.includes(searchQuery.toLowerCase()))
    );
  });
  return (
    <div>
      <div className="mb-6 mt-16">
        {loading && <Spinner/>}
        <div className="flex items-center gap-3 mb-4 ">
          <h1 className="text-2xl font-bold text-gray-900 ml-8 xs:ml-2 xs:text-xl sm:ml-0 ">
            Welcome
          </h1>
          <HandshakeIcon className="w-8 h-8 text-[#ff8800] mt-2" />
        </div>
      </div>

      <div className="h-0.5 bg-gray-200 w-full" />

      <section className="flex items-center justify-between mb-6 sm:mb-4">
        <h2 className="text-2xl font-bold text-gray-900 ml-8 mt-2 sm:text-xl sm:ml-0 xs:text-lg xs:ml-2 xss:text-md">
          Asked Questions
        </h2>
        <div className="w-96 mt-2">
          <InputField
            type="search"
            name="search"
            value={searchQuery}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"

            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>
      <div className="flex justify-between items-center  sm:gap-4">
        <QuestionFilter activeFilter={filter} onFilterChange={setFilter} />

      </div>

      <QuestionList
        questions={filterQuestions}
        onShowAnswers={handleShowAnswers}

      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filterQuestions.length / 5)}
        onPageChange={setCurrentPage}
      />

      {selectedQuestion && (
        <AnswerModal
          isOpen={showAnswerModal}
          onClose={() => setShowAnswerModal(false)}
          answers={selectedQuestion.answerId}
        />
      )}
    </div>
  );
};

export default MentorHome;

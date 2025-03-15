import { CircleAlertIcon, HandshakeIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../components/Auth/InputField";
import QuestionFilter from "../../components/Common/Qa/QuestionFilter";

import AnswerModal from "../../components/Common/Qa/AnswerInputModal";
import QuestionList from "../../components/Common/Qa/QuestionsList";
import { Pagination } from "../../components/Common/common4All/Pagination";
import Spinner from "../../components/Common/common4All/Spinner";
import { axiosInstance } from "../../Config/mentorAxios";
import AnswerInputModal from "../../components/Common/Qa/AnswerInputModal";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { toast } from "react-toastify";
import { fetchMentorHomeData } from "../../service/api";
import InfiniteScroll from "react-infinite-scroll-component";

const MentorHome: React.FC = () => {
  const limit = 6;
  const [filter, setFilter] = useState<"answered" | "unanswered">("answered");
  const [questions, setQuestions] = useState<IQuestion[] | []>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answerInputModalOpen, setAnswerInputModalOpen] =
    useState<boolean>(false);
  const [answerQuestionId, setAnswerQuestionId] = useState<string>("");
  const [mentorId, setMentorId] = useState<string>("");
  const [answer, setEditAnswer] = useState<string>("");
  const [answerId, setAnswerId] = useState<string>("");
  const [editAnswerModalOpen, setEditAnswerModalOpen] =
    useState<boolean>(false);

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [editData, setEditData] = useState<{
    content: string;
    answerId: string;
  }>({
    content: "",
    answerId: "",
  });

  const fetchData = useCallback(
    async (page: number, isNewSearch = false) => {
      try {
        setLoading(false);
        const response = await fetchMentorHomeData(
          filter,
          searchQuery,
          page,
          limit
        );

        if (response?.status === 200 && response?.data?.success) {
          setMentorId(response.data?.userId);
          const newQustion = response?.data.homeData;
          setQuestions((pre) =>
            isNewSearch ? newQustion : [...pre, ...newQustion]
          );
          setHasMore(page < response?.data?.totalPage);
          setCurrentPage(page);
       
        }
      } catch (error: unknown) {
        console.log(
          `error while fetching home data ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },
    [filter, searchQuery]
  );
  useEffect(() => {
    fetchData(1,true);
  }, [fetchData, filter, searchQuery]);

  const fetchMoreQuestion = useCallback(() => {
    if (hasMore) {
      fetchData(currentPage + 1);
    }
  }, [currentPage, fetchData, hasMore]);

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
  const handleAnswerSubmit = async (answer: string) => {
    try {
      setLoading(true);
      const { status, data } = await axiosInstance.post(
        `/mentor/qa/create-new-answer`,
        {
          answer,
          questionId: answerQuestionId,
          userType: "mentor",
        }
      );
      if (status === 200 && data.success) {
        // setEditData({ content: data?.answers, answerId: answerQuestionId });
        toast.success(data?.message);

        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === answerQuestionId
              ? {
                  ...question,
                  answerData: [...(question.answerData || []), data.answers],
                }
              : question
          )
        );
        if (filter == "unanswered") {
          setQuestions((prevQuestions) =>
            prevQuestions.filter(
              (question) => question._id !== answerQuestionId
            )
          );
        }
      }
      setAnswerInputModalOpen(false);
    } catch (error: unknown) {
      errorHandler(error);
      console.log(error, "unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnswerSubmit = async (content: string, answerId?: string) => {
    console.log("Answer Edited: ", { content, answerId });

    if (!answerId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.patch(`/mentor/qa/edit-answer`, {
        content,
        answerId,
      });

      if (response.status === 200 && response.data.success) {
        setEditData({ content: response.data?.answer, answerId: answerId });
        toast.success(response.data.message);

        const updatedAnswer = response.data?.answer;
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) => ({
            ...question,
            answerData: question.answerData?.map((ans) =>
              ans._id === answerId ? { ...ans, answer: updatedAnswer } : ans
            ),
          }))
        );
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
      setEditAnswerModalOpen(false);
    }
  };
  const handleEditAnswer = (content: string, answerId: string) => {
    setEditAnswer(content);
    setAnswerId(answerId);
    setEditAnswerModalOpen(true);
  };
  return (
    <div>
      <div className="mb-3 mt-16">
        {loading && <Spinner />}
        <div className="flex items-center gap-3 mb-2  justify-center">
                  <h1 className="text-3xl font-bold text-gray-900  xs:text-xl sm:ml-0 ">
                    Welcome
                  </h1>
                  <HandshakeIcon className="w-6 h-6 text-[#ff8800] mt-1" />
                </div>
      </div>

      <div className="h-0.5 bg-gray-200 w-full" />

      <section className="flex items-center justify-between mb-6 sm:mb-4  sm:flex-col lg:flex-row  xss:flex-col">
        {/* <h2 className="text-2xl font-bold text-gray-900 ml-8 mt-2 sm:text-xl sm:ml-0 xs:text-lg xs:ml-2 xss:text-md">
          Asked Questions
        </h2> */}
        <div className="flex justify-between items-center  sm:gap-4 mt-4">
          <QuestionFilter activeFilter={filter} onFilterChange={setFilter} />
        </div>
        <div className="w-72  mt-2">
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

      <div className="bg-white p-6 rounded-lg shadow-sm">
      <InfiniteScroll
        dataLength={questions?.length}
        next={fetchMoreQuestion}
        hasMore={hasMore}
        loader={<h4 className="text-center my-4">Loading more Questions...</h4>}
        endMessage={questions.length>0?
          <p className=" flex justify-center text-center my-4 text-gray-500">
            <CircleAlertIcon className="w-6 mr-1" /> No more Questions to load.{" "}
          </p>:""
        }
      >
        <QuestionList
          questions={filterQuestions}
          onShowAnswers={handleShowAnswers}
          setAnswerQuestionId={setAnswerQuestionId}
          setIsAnswerModalOpen={setAnswerInputModalOpen}
          currentUserId={mentorId}
          EditedData={editData}
          onEditAnswer={handleEditAnswer}
        />
      </InfiniteScroll>
      </div>
      {selectedQuestion && (
        <AnswerModal
          isOpen={showAnswerModal}
          onClose={() => setShowAnswerModal(false)}
          onSubmit={() => selectedQuestion.content}
        />
      )}
      {answerInputModalOpen && (
        <AnswerInputModal
          isOpen={answerInputModalOpen}
          onClose={() => setAnswerInputModalOpen(false)}
          onSubmit={handleAnswerSubmit}
        />
      )}
      {editAnswerModalOpen && (
        <AnswerInputModal
          isOpen={editAnswerModalOpen}
          onClose={() => setEditAnswerModalOpen(false)}
          onSubmit={handleEditAnswerSubmit}
          receiveAnswer={answer}
          answerId={answerId}
        />
      )}
    </div>
  );
};

export default MentorHome;

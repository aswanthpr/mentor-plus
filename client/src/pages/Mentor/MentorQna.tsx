import { ArrowUpDown, CircleAlertIcon, Filter, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../components/Auth/InputField";
import AnswerModal from "../../components/Common/Qa/AnswerInputModal";
import QuestionList from "../../components/Common/Qa/QuestionsList";
import Spinner from "../../components/Common/common4All/Spinner";
import AnswerInputModal from "../../components/Common/Qa/AnswerInputModal";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fetchCreateNewAnsweres,
  fetchMentorEditAnswer,
  fetchMentorHomeData,
} from "../../service/mentorApi";
import { toast } from "react-toastify";
import { ANSWER_EDIT } from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";

const MentorQna: React.FC = () => {
  const limit = 6;
  const [filter, setFilter] = useState<TquestionTab>("answered");
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
  const [sortField, setSortField] = useState<TsortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [editData, setEditData] = useState<{
    content: string;
    answerId: string;
  }>(ANSWER_EDIT);

  const fetchData = useCallback(
    async (page: number, isNewSearch = false) => {
      try {

        setLoading((pre)=>!pre)
        const response = await fetchMentorHomeData(
          filter,
          searchQuery,
          sortField,
          sortOrder,
          page,
          limit
        );
        setLoading((pre)=>!pre)
        if (
          response?.status === HttpStatusCode?.Ok &&
          response?.data?.success
        ) {
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
    [filter, searchQuery, sortField, sortOrder]
  );
  useEffect(() => {
    
    fetchData(1, true);
  }, [fetchData, filter, searchQuery]);

  const fetchMoreQuestion = useCallback(() => {
    if (hasMore) {
      fetchData(currentPage + 1);
    }
  }, [currentPage, fetchData, hasMore]);

  const handleShowAnswers = useCallback(
    (questionId: string): void => {
      const question = questions.find((q) => q._id === questionId);
      if (question) {
        setSelectedQuestion(question);
        setShowAnswerModal(true);
      }
    },
    [questions]
  );
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
  const handleAnswerSubmit = useCallback(
    async (answer: string) => {
      setLoading(true);
      const response = await fetchCreateNewAnsweres(
        answer,
        answerQuestionId,
        "mentor"
      );

      if (response?.status === HttpStatusCode?.Ok && response?.data.success) {
        // setEditData({ content: data?.answers, answerId: answerQuestionId });
        toast.success(response?.data?.message);

        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === answerQuestionId
              ? {
                  ...question,
                  answerData: [
                    ...(question.answerData || []),
                    response?.data.answers,
                  ],
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

      setLoading(false);
    },
    [answerQuestionId, filter]
  );

  const handleEditAnswerSubmit = useCallback(
    async (content: string, answerId?: string) => {
  

      if (!answerId) return;

      setLoading(true);
      const response = await fetchMentorEditAnswer(content, answerId);

      if (response.status === HttpStatusCode?.Ok && response.data.success) {
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

      setLoading(false);
      setEditAnswerModalOpen(false);
    },
    []
  );
  const handleEditAnswer = useCallback((content: string, answerId: string) => {
    setEditAnswer(content);
    setAnswerId(answerId);
    setEditAnswerModalOpen(true);
  }, []);
  return (
    <div>
      {loading && <Spinner />}

      <div className="bg-white p-6 rounded-lg shadow-sm mt-16">
        <section className="flex items-center justify-en mb-6 sm:mb-4  sm:flex-col lg:flex-row  xss:flex-col">
          <div className=" flex">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <InputField
                  type={"search"}
                  placeholder="Search questions or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilter(e.target.value as "answered" | "unanswered")
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
                >
                  <option value="answered">Answered</option>
                  <option value="unanswered">Unanswered</option>
                </select>
              </div>

              {/* Sort */}

              <div className="flex items-center gap-2">
                <ArrowUpDown size={20} className="text-gray-400" />
                <select
                  value={`${sortField}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortField(field as TsortField);
                    setSortOrder(order as TSortOrder);
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <div className="h-0.5 bg-gray-200 w-full mb-2" />

        <InfiniteScroll
          dataLength={questions?.length}
          next={fetchMoreQuestion}
          hasMore={hasMore}
          loader={
            <h4 className="text-center my-4">Loading more Questions...</h4>
          }
          endMessage={
            questions.length > 0 ? (
              <p className=" flex justify-center text-center my-4 text-gray-500">
                <CircleAlertIcon className="w-6 mr-1" /> No more Questions to
                load.{" "}
              </p>
            ) : (
              ""
            )
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

export default MentorQna;

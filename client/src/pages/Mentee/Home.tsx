import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowUpDown,
  CircleAlertIcon,
  Filter,
  HandshakeIcon,
  Search,
} from "lucide-react";
import QuestionsList from "../../components/Common/Qa/QuestionsList";
import AnswerModal from "../../components/Common/Qa/AnswerInputModal";
import InputField from "../../components/Auth/InputField";
import { toast } from "react-toastify";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import Spinner from "../../components/Common/common4All/Spinner";
import AnswerInputModal from "../../components/Common/Qa/AnswerInputModal";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fetchCreateAnswer,
  fetchDeleteQuestion,
  fetchEditQuestion,
  fetchHomeData,
  fetchMenteeEditAnswer,
} from "../../service/menteeApi";
import { ANSWER_EDIT } from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";

const Home: React.FC = () => {
  const page_limit = 6;
  const [filter, setFilter] = useState<TquestionTab>("answered");
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<IQuestion[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answerQuestionId, setAnswerQuestionId] = useState<string>("");
  const [editAnswerModalOpen, setEditAnswerModalOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortField, setSortField] = useState<TsortField>("createdAt");

  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [editData, setEditData] = useState<{
    content: string;
    answerId: string;
  }>(ANSWER_EDIT);
  const [newAns, setNewAns] = useState<Ianswer | null>(null);

  const fetchData = useCallback(
    async (page: number, isNewSearch = false) => {
      setLoading((pre)=>!pre)
      const response = await fetchHomeData(
        filter,
        searchQuery,
        sortField,
        sortOrder,
        page,
        page_limit
      );
      setLoading((pre)=>!pre)

      if (response?.status === HttpStatusCode?.Ok && response?.data?.success) {
        setUserId(response.data.userId);
        const newQuestion = response?.data.homeData;
        setQuestions((pre) =>
          isNewSearch ? newQuestion : [...pre, ...newQuestion]
        );
        setHasMore(page < response?.data?.totalPage);
        setCurrentPage(page);
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

  const handleEditQuestion = useCallback(
    async (questionId: string, updatedQuestion: IeditQuestion) => {
      // Update the question in the state

      const originalQuestion = questions.find((q) => q._id === questionId);

      if (!originalQuestion) {
        toast.error("Unexpected error occured");
        console.error(`Question with ID ${questionId} not found.`);
        return;
      }

      // Check if any field has changed
      const isChanged = Object.keys(updatedQuestion).some((key) => {
        return (
          JSON.stringify(updatedQuestion[key as keyof IeditQuestion]) !==
          JSON.stringify(originalQuestion[key as keyof IQuestion])
        );
      });

      if (!isChanged) {
        toast.info(
          "No changes detected. Please modify the question before updating."
        );
        return;
      }

      setLoading(true);
      const response = await fetchEditQuestion(
        questionId,
        updatedQuestion,
        filter
      );

      if (response?.status == HttpStatusCode?.Ok && response?.data.success) {
        setQuestions(
          questions.map((q) =>
            q._id === questionId ? response?.data?.question : q
          )
        );
        toast.success(response?.data.message);
      }

      setInterval(() => {
        setLoading(false);
      }, 500);
    },
    [filter, questions]
  );

  const filterQuestions = questions.filter((question) => {
    const search = searchQuery.toLowerCase();
    const title = question.title?.toLowerCase() || "";
    const content = question.content?.toLowerCase() || "";
    const tags = question.tags?.map((tag) => tag.toLowerCase()) || [];

    return (
      title.includes(search) ||
      content.includes(search) ||
      tags.some((tag) => tag.includes(search))
    );
  });

  const handleDeleteQuestion = useCallback((questionId: string) => {
    toast(
      <ConfirmToast
        message="Confirm Deletion"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onReply={() => handleDel(questionId as string)}
        onIgnore={() => toast.dismiss()}
        ariaLabel="delete question confirmation"
      />,
      {
        closeButton: false,
        className: "p-0  border border-purple-600/40 ml-0",
        autoClose: false,
      }
    );
    const handleDel = async (questId: string) => {
      toast.dismiss();

      setLoading(true);
      const response = await fetchDeleteQuestion(questId);

      if (response.status === HttpStatusCode?.Ok && response.data.success) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questId)
        );
        setSelectedQuestion(null);
        toast.success(response.data?.message);
      }

      setLoading(false);
    };
  }, []);

  const handleAnswerSubmit = useCallback(
    async (content: string) => {
      setLoading(true);
      const response = await fetchCreateAnswer(
        content,
        answerQuestionId,
        "mentee"
      );


      if (response?.status === HttpStatusCode?.Ok && response?.data.success) {
        toast.success(response?.data.message);
        setIsAnswerModalOpen(false);
        setNewAns(response?.data?.answers);
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === answerQuestionId
              ? {
                  ...question,
                  answerData: [
                    ...(question.answerData || []),
                    response?.data?.answers,
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

      setTimeout(() => {
        setLoading(false);
      });
    },
    [answerQuestionId, filter]
  );

  const handleEditAnswer = useCallback((content: string, answerId: string) => {
    setEditingAnswer(content);
    setEditingAnswerId(answerId);
    setEditAnswerModalOpen(true);
  }, []);

  const handleEditAnswerSubmit = useCallback(
    async (content: string, answerId?: string) => {
      if (!answerId) return;

      setLoading(true);
      const response = await fetchMenteeEditAnswer(content, answerId);

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

  return (
    <div>
      <div className="mb-6 mt-8 ">
        {loading && <Spinner />}
        <div className="flex items-center gap-3 mb-2  justify-center">
          <h1 className="text-3xl font-bold text-gray-900  xs:text-xl sm:ml-0 ">
            Welcome
          </h1>
          <HandshakeIcon className="w-6 h-6 text-[#ff8800] mt-1" />
        </div>
        <div className="h-0.5 bg-gray-200 w-full" />
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <section className="flex items-center justify-between mb-2 sm:mb-2 sm:flex-col lg:flex-row  xss:flex-col">
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
                      setSortField(field as "createdAt" | "mostAnswered");
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

          <InfiniteScroll
            dataLength={questions?.length}
            next={fetchMoreQuestion}
            hasMore={hasMore}
            loader={
              <h4 className="text-center my-4">Loading more Questions...</h4>
            }
            endMessage={
              <p className=" flex justify-center text-center my-4 text-gray-500">
                <CircleAlertIcon className="w-6 mr-1" /> No more Questions to
                load.{" "}
              </p>
            }
          >
            <QuestionsList
              onDeleteQestion={handleDeleteQuestion}
              currentUserId={userId}
              questions={filterQuestions}
              onShowAnswers={handleShowAnswers}
              setIsAnswerModalOpen={setIsAnswerModalOpen}
              setAnswerQuestionId={setAnswerQuestionId}
              onEditQuestion={handleEditQuestion}
              onEditAnswer={handleEditAnswer}
              EditedData={editData}
              newAnswer={newAns}
            />
          </InfiniteScroll>
        </div>
      </div>

      {selectedQuestion && (
        <AnswerModal
          onSubmit={() => selectedQuestion.content}
          isOpen={showAnswerModal}
          onClose={() => setShowAnswerModal(false)}
        />
      )}
      {isAnswerModalOpen && (
        <AnswerInputModal
          isOpen={isAnswerModalOpen}
          onClose={() => setIsAnswerModalOpen(false)}
          onSubmit={handleAnswerSubmit}
        />
      )}

      {editAnswerModalOpen && (
        <AnswerInputModal
          isOpen={editAnswerModalOpen}
          onClose={() => setEditAnswerModalOpen(false)}
          onSubmit={handleEditAnswerSubmit}
          receiveAnswer={editingAnswer || ""}
          answerId={editingAnswerId || undefined}
        />
      )}
    </div>
  );
};

export default Home;

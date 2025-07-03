import { toast } from "react-toastify";
import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowUpDown,
  Filter,
  MessageCircleQuestion,
  Search,
} from "lucide-react";

import AddQuestion from "../../components/Common/Qa/AddQuestion";
import QuestionsList from "../../components/Common/Qa/QuestionsList";
import InputField from "../../components/Auth/InputField";
import Spinner from "../../components/Common/common4All/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import AnswerInputModal from "../../components/Common/Qa/AnswerInputModal";
import {
  fetchCreateAnswer,
  fetchCreateQuestion,
  fetchDeleteQuestion,
  fetchEditAnswer,
  fetchEditQuestion,
  fetchMenteeQuestions,
} from "../../service/menteeApi";
import { Pagination } from "@mui/material";
import { ANSWER_EDIT } from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";
import { Messages } from "../../Constants/message";
import useDebounce from "../../Hooks/useDebounce";

const QnA_page: React.FC = () => {
  const limit = 6;

  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<IQuestion[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [answer, setEditAnswer] = useState<string>("");
  const [answerId, setAnswerId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<TsortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [answerQuestionId, setAnswerQuestionId] = useState<string>("");
  const [filter, setFilter] = useState<TquestionTab>("answered");
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [editAnswerModalOpen, setEditAnswerModalOpen] =
    useState<boolean>(false);
  const [editData, setEditData] = useState<{
    content: string;
    answerId: string;
  }>(ANSWER_EDIT);
  const [newAns, setNewAns] = useState<Ianswer | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setLoading((pre) => !pre);
    const fetchQuestions = async () => {
      try {
        const response = await fetchMenteeQuestions(
          debouncedSearchQuery,
          filter,
          sortField,
          sortOrder,
          currentPage,
          limit
        );
        setLoading((pre) => !pre);
        if (response?.status === HttpStatusCode?.Ok && response.data?.success) {
          setQuestions(response.data?.question);
          setUserId(response.data.userId);
          setTotalDocuments(response.data.totalPage);
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    };

    fetchQuestions();
  }, [currentPage, filter, debouncedSearchQuery, sortField, sortOrder]);

  const handleAddQuestion = useCallback(
    async (question: IeditQuestion) => {
      setShowAddModal(false);

      const response = await fetchCreateQuestion(question);

      if (response?.status == HttpStatusCode?.Ok && response?.data?.success) {
        if (filter == "unanswered") {
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
              ...response.data?.question,
              user: response.data?.question?.menteeId,
              menteeId: response.data?.question?.user?._id,
            },
          ]);
        }
        toast.success(response.data.message);
      }

      setInterval(() => {
        setLoading(false);
      }, 500);
    },
    [filter]
  );

  const handleEditQuestion = useCallback(
    async (questionId: string, updatedQuestion: Partial<IQuestion>) => {
      const originalQuestion = questions.find((q) => q._id === questionId);

      if (!originalQuestion) {
        toast.error(Messages?.UNEXPECTED_ERROR);
        console.error(`Question with ID ${questionId} not found.`);
        return;
      }

      // Check if any field has changed
      const isChanged = Object.keys(updatedQuestion).some((key) => {
        return (
          JSON.stringify(updatedQuestion[key as keyof IQuestion]) !==
          JSON.stringify(originalQuestion[key as keyof IQuestion])
        );
      });

      if (!isChanged) {
        toast.info(Messages?.NO_CHANGES_IN_FILE);
        return;
      }

      setLoading(true);
      const { status, data } = await fetchEditQuestion(
        questionId,
        updatedQuestion,
        filter
      );

      if (status == HttpStatusCode?.Ok && data.success) {
        setQuestions(
          questions.map((q) => (q._id === questionId ? data?.question : q))
        );
        toast.success(data.message);
      }

      setInterval(() => {
        setLoading(false);
      }, 500);
    },
    [filter, questions]
  );

  const filteredQuestions = questions.filter((question) => {
    const title = question.title?.toLowerCase() || "";
    const content = question.content?.toLowerCase() || "";
    const tags = question.tags?.map((tag) => tag.toLowerCase()) || [];

    return (
      title.includes(searchQuery.toLowerCase()) ||
      content.includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.includes(searchQuery.toLowerCase()))
    );
  });
  const handleShowAnswers = (questionId: string) => {
    console.log(`Show answers for question ID: ${questionId}`);
  };

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
    const handleDel = async (questionId: string) => {
      toast.dismiss();

      const response = await fetchDeleteQuestion(questionId);

      if (response.status === HttpStatusCode?.Ok && response.data.success) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questionId)
        );
        toast.success("Question deleted successfully");
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);
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

      if (response?.status === HttpStatusCode?.Ok && response.data.success) {
        toast.success("Answer submited  successfully");
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
        setIsAnswerModalOpen(false);
      }

      setTimeout(() => {
        setLoading(false);
      });
    },
    [answerQuestionId, filter]
  );

  const handleEditAnswer = useCallback((content: string, answerId: string) => {
    setEditAnswer(content);
    setAnswerId(answerId);
    setEditAnswerModalOpen(true);
  }, []);
  const handleEditAnswerSubmit = useCallback(
    async (content: string, answerId?: string) => {
      setLoading(true);
      const response = await fetchEditAnswer(content, answerId as string);

      if (response.status === HttpStatusCode?.Ok && response.data.success) {
        setEditData({ content: response.data?.answer, answerId: answerId! });
        const updatedAnswer = response.data?.answer;
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) => ({
            ...question,
            answerData: question.answerData?.map((ans) =>
              ans._id === answerId ? { ...ans, answer: updatedAnswer } : ans
            ),
          }))
        );
        toast.success(response.data?.message);
        setIsAnswerModalOpen(false);
      }

      setLoading(false);
    },
    []
  );
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );
  return (
    <div>
      <div className="mb-4 mt-10">
        {loading && <Spinner />}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-end space-y-4 lg:space-y-0 lg:space-x-4 text-center">
          {/* Add Question Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#ff8800] justify-center  text-white hover:bg-[#e67a00] px-4 py-2 rounded-md font-bold transition-colors flex items-center mt-"
          >
            Ask Questions
            <MessageCircleQuestion className="ml-1" />
          </button>
        </div>
      </div>
      {/* <QuestionFilter activeFilter={filter} onFilterChange={setFilter} /> */}
      <div className="bg-white rounded-lg shadow-md p-6 h-[81vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                setFilter(e.target.value as "answered" | "unanswered" | "all")
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="answered">Answered</option>
              <option value="unanswered">Un Answered</option>
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
              <option value="mostAnswered-asc">More Answered</option>
            </select>
          </div>
        </div>

        <QuestionsList
          onDeleteQestion={handleDeleteQuestion}
          questions={filteredQuestions}
          onEditQuestion={handleEditQuestion}
          currentUserId={userId as string}
          setAnswerQuestionId={setAnswerQuestionId}
          onShowAnswers={handleShowAnswers}
          setIsAnswerModalOpen={setIsAnswerModalOpen}
          onEditAnswer={handleEditAnswer}
          EditedData={editData}
          newAnswer={newAns}
        />
        <hr className="h-px  bg-gray-100 border-0 dark:bg-gray-300 mt-2" />
        <div className="flex justify-center mt-3">
          
          <Pagination
            count={ typeof totalDocuments==='number'?totalDocuments:1}
            page={currentPage}
            onChange={handlePageChange}
            color="standard"
            shape="circular"
            size="small"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
        
      </div>
      <AddQuestion
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddQuestion}
      />
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
          receiveAnswer={answer}
          answerId={answerId}
        />
      )}
    </div>
  );
};

export default QnA_page;

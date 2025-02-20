import React, { useEffect, useState } from "react";
import { HandshakeIcon } from "lucide-react";
import { Pagination } from "../../components/Common/common4All/Pagination";
import QuestionFilter from "../../components/Common/Qa/QuestionFilter";
import QuestionsList from "../../components/Common/Qa/QuestionsList";
import AnswerModal from "../../components/Common/Qa/AnswerInputModal";
import InputField from "../../components/Auth/InputField";
import { protectedAPI } from "../../Config/Axios";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { toast } from "react-toastify";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import Spinner from "../../components/Common/common4All/Spinner";
import AnswerInputModal from "../../components/Common/Qa/AnswerInputModal";

const Home: React.FC = () => {
  const [filter, setFilter] = useState<"answered" | "unanswered">("answered");
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<IQuestion[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answerQuestionId, setAnswerQuestionId] = useState<string>("");
  const [editAnswerModalOpen, setEditAnswerModalOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    content: string;
    answerId: string;
  }>({
    content: "",
    answerId: "",
  });
  const [newAns, setNewAns] = useState<Ianswer | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
        const response = await protectedAPI.get(`/mentee/home/${filter}`);

        if (response?.status === 200 && response?.data?.success) {
          setUserId(response.data.userId);
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
  }, [filter]);

  const handleShowAnswers = (questionId: string): void => {
    const question = questions.find((q) => q._id === questionId);
    if (question) {
      setSelectedQuestion(question);
      setShowAnswerModal(true);
    }
  };

  const handleEditQuestion = async (
    questionId: string,
    updatedQuestion: IQuestion
  ) => {
    // Update the question in the state

    const originalQuestion = questions.find((q) => q._id === questionId);

    if (!originalQuestion) {
      toast.error("Unexpected error occured");
      console.error(`Question with ID ${questionId} not found.`);
      return;
    }

    // Check if any field has changed
    const isChanged = Object.keys(updatedQuestion).some((key) => {
      console.log(
        typeof JSON.stringify(updatedQuestion),
        "this is the quesion where error occure"
      );
      return (
        JSON.stringify(updatedQuestion[key as keyof IQuestion]) !==
        JSON.stringify(originalQuestion[key as keyof IQuestion])
      );
    });

    if (!isChanged) {
      toast.info(
        "No changes detected. Please modify the question before updating."
      );
      return;
    }

    try {
      setLoading(true);
      const { status, data } = await protectedAPI.patch(
        `/mentee/qa/edit-question`,
        {
          questionId,
          updatedQuestion,
          filter,
        }
      );

      if (status == 200 && data.success) {
        setQuestions(
          questions.map((q) => (q._id === questionId ? data?.question : q))
        );
        toast.success(data.message);
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setInterval(() => {
        setLoading(false);
      }, 500);
    }
  };

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

  const handleDeleteQuestion = (questionId: string) => {
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
      try {
        setLoading(true);
        const response = await protectedAPI.delete(
          `/mentee/qa/delete/${questId}`
        );
        if (response.status === 200 && response.data.success) {
          setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question._id !== questId)
          );
          setSelectedQuestion(null);
          toast.success("Question deleted successfully");
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };
  };

  const handleAnswerSubmit = async (content: string) => {
    console.log(answerQuestionId, "thsi sit he question id ");
    try {
      setLoading(true);
      const { status, data } = await protectedAPI.post(
        `/mentee/qa/create-answer`,
        {
          answer: content,
          questionId: answerQuestionId,
          userType: "mentee",
        }
      );
      console.log(data.answers);
      if (status === 200 && data.success) {
        toast.success(data.message);
        setIsAnswerModalOpen(false);
        setNewAns(data?.answers);
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === answerQuestionId
              ? {
                  ...question,
                  answerData: [...(question.answerData || []), data?.answers],
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
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      });
    }
  };

  const handleEditAnswer = (content: string, answerId: string) => {
    setEditingAnswer(content);
    setEditingAnswerId(answerId);
    setEditAnswerModalOpen(true);
  };

  const handleEditAnswerSubmit = async (content: string, answerId?: string) => {
    console.log("Answer Edited: ", { content, answerId });

    if (!answerId) return;

    try {
      setLoading(true);
      const response = await protectedAPI.patch(`/mentee/qa/edit-answer`, {
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

  return (
    <div>
      <div className="mb-8 mt-16 ">
        {loading && <Spinner />}
        <div className="flex items-center gap-3 mb-4 ">
          <h1 className="text-3xl font-bold text-gray-900 ml-8  xs:text-xl sm:ml-0 ">
            Welcome
          </h1>
          <HandshakeIcon className="w-8 h-8 text-[#ff8800] mt-2" />
        </div>
        <div className="h-0.5 bg-gray-200 w-full" />

        <section className="flex items-center justify-between mb-2 sm:mb-2 sm:flex-col lg:flex-row  xss:flex-col">
          <h2 className="text-xl font-bold text-gray-900 ml-8 mt-4 sm:ml-0 ">
            Asked Questions
          </h2>
          <div className="flex justify-between items-center  sm:gap-4 mt-3">
            <QuestionFilter activeFilter={filter} onFilterChange={setFilter} />
          </div>
          <div className="w-96 mt-4 xss:w-auto">
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
      </div>

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
        newAns={newAns}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={2}
        onPageChange={setCurrentPage}
      />

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

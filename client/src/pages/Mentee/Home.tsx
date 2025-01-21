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
  console.log(answerQuestionId, "thsi is the qestion id");
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
      return (
        JSON.stringify((updatedQuestion as any)[key]) !==
        JSON.stringify((originalQuestion as any)[key])
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
      const response = await protectedAPI.patch(`/mentee/qa/edit-question`, {
        questionId,
        updatedQuestion,
      });

      if (response.status == 200 && response.data.success) {
        const question = response.data.question;
        const update = {
          _id: question?._id,
          title: question?.title,
          content: question?.content,
          tags: question?.tags,
          createdAt: question?.createdAt,
          updatedAt: question?.updatedAt,
          menteeId: question?.menteeId?._id,
          answerId: question?.answerId,
          menteeData: question?.menteeId,
        };
        setQuestions(questions.map((q) => (q._id === questionId ? update : q)));
        toast.success(response.data.message);
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

  const handleDeleteQuestion = (questionId: string) => {
    console.log(questionId, "kdflkassdkasjfslf");
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
        const response = await protectedAPI.delete(
          `/mentee/qa/delete/${questId}`
        );
        if (response.status === 200 && response.data.success) {
          setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question._id !== questId)
          );
          toast.success("Question deleted successfully");
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
  };

  const handleAnswerSubmit = async (content: string) => {
    console.log(answerQuestionId, "thsi sit he question id ");
    try {
      setLoading(true);
      const response = await protectedAPI.post(`/mentee/qa/create-answer`, {
        answer: content,
        questionId: answerQuestionId,
        userType:"mentees",
      });

    
      if (response.status === 200 && response.data.success) {
        toast.success("Answer submited  successfully");
        setIsAnswerModalOpen(false);
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      });
    }
   
  };
  console.log(questions,'thsi sit he dat is swa')
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

        <section className="flex items-center justify-between mb-6 sm:mb-4 ">
          <h2 className="text-xl font-bold text-gray-900 ml-8 mt-4 sm:ml-0 ">
            Asked Questions
          </h2>
          <div className="w-96 mt-4">
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
      <div className="flex justify-between items-center  sm:gap-4">
        <QuestionFilter activeFilter={filter} onFilterChange={setFilter} />
      </div>

      <QuestionsList
        onDeleteQestion={handleDeleteQuestion}
        currentUserId={userId}
        questions={filterQuestions}
        onShowAnswers={handleShowAnswers}
        onEditQuestion={handleEditQuestion}
        setIsAnswerModalOpen={setIsAnswerModalOpen}
        setAnswerQuestionId={setAnswerQuestionId}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={2}
        onPageChange={setCurrentPage}
      />

      {selectedQuestion && (
        <AnswerModal
          isOpen={showAnswerModal}
          onClose={() => setShowAnswerModal(false)}
          answers={selectedQuestion.answerId}
        />
      )}
      {isAnswerModalOpen && (
        <AnswerInputModal
          isOpen={isAnswerModalOpen}
          onClose={() => setIsAnswerModalOpen(false)}
          onSubmit={handleAnswerSubmit}
        />
      )}
    </div>
  );
};

export default Home;

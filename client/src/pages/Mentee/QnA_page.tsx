import React, { useEffect, useState } from "react";
import { MessageCircleQuestion, Search } from "lucide-react";

import AddQuestion from "../../components/Common/Qa/AddQuestion";
import QuestionsList from "../../components/Common/Qa/QuestionsList";
import InputField from "../../components/Auth/InputField";
import { Pagination } from "../../components/Common/common4All/Pagination";
import Spinner from "../../components/Common/common4All/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { protectedAPI } from "../../Config/Axios";
import { toast } from "react-toastify";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import QuestionFilter from "../../components/Common/Qa/QuestionFilter";
import AnswerInputModal from "../../components/Common/Qa/AnswerInputModal";

const QnA_page: React.FC = () => {
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<IQuestion[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [filter, setFilter] = useState<"answered" | "unanswered">("answered");
  const [answerQuestionId,setAnswerQuestionId] = useState<string>('')
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await protectedAPI.get(`/mentee/qa/${filter}`);
        if (response?.status === 200 && response.data?.success) {
          console.log(response.data.question, "thsi is response data");

          setQuestions(response.data.question);
          setUserId(response.data.userId);
        }
      } catch (error: unknown) {
        errorHandler(error);

      } finally {
    
          setLoading(false);
      
      }
    };

    fetchQuestions();
  }, [filter]);

  const handleAddQuestion = async (question: IQuestion) => {
    setShowAddModal(false);
    try {
      setLoading(true);
      const response = await protectedAPI.post(
        `/mentee/qa/add-question/`,
        question
      );

      if (response.status == 200 && response.data.success) {
        setQuestions((prevQuestions) => [
          response.data.question,
          ...prevQuestions,
        ]);
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

  const handleEditQuestion = async (
    questionId: string,
    updatedQuestion: IQuestion
  ) => {
    const originalQuestion = questions.find((q) => q._id === questionId);

    if (!originalQuestion) {
      toast.error("Unexpected error occured");
      console.error(`Question with ID ${questionId} not found.`);
      return;
    }

    // Check if any field has changed
    const isChanged = Object.keys(updatedQuestion).some((key) => {
      return (
        JSON.stringify(updatedQuestion [ key as keyof IQuestion]) !==
        JSON.stringify(originalQuestion [ key as keyof IQuestion])
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
    const handleDel = async (questionId: string) => {
      toast.dismiss();
      try {
        const response = await protectedAPI.delete(
          `/mentee/qa/delete/${questionId}`
        );
        if (response.status === 200 && response.data.success) {
          setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question._id !== questionId)
          );
          toast.success("Question deleted successfully");
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
  };

  const handleAnswerSubmit = async (content: string) => {
    console.log(answerQuestionId,'thsi sit he question id ')
try {
  setLoading(true);
  const response = await protectedAPI.post(`/mentee/qa/create-answer`,{answer:content,questionId:answerQuestionId,userType:'mentees'});

  

  if (response.status === 200 && response.data.success) {
   
    toast.success("Answer submited  successfully");
    setIsAnswerModalOpen(false);
  }
} catch (error:unknown) {
  errorHandler(error)
}
    console.log('Answer submitted:', content);
  };
  return (
    <div>
      <div className="mb-6 mt-16">
        {loading && <Spinner />}
        {/* Wrapper for the responsive layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 text-center ">
          {/* Text (Q&A) */}
          <h1 className="text-2xl font-bold sm:text-xl">Q&A</h1>

          {/* Input Field */}

          <div className="relative w-full lg:max-w-md ">
            <Search className="absolute left-3 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <InputField
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent w-full "
            />
          </div>

          {/* Add Question Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#ff8800] justify-center  text-white hover:bg-[#e67a00] px-4 py-2 rounded-md font-bold transition-colors flex items-center "
          >
            Ask Questions
            <MessageCircleQuestion className="ml-1" />
          </button>
        </div>
      </div>
      <QuestionFilter activeFilter={filter} onFilterChange={setFilter} />
      {/* <div className="h-0.5 bg-gray-200 w-full" /> */}

      <section className="flex items-center justify-center mt-6">
        <QuestionsList
          onDeleteQestion={handleDeleteQuestion}
          questions={filteredQuestions}
          onEditQuestion={handleEditQuestion}
          currentUserId={userId as string}
          setAnswerQuestionId={setAnswerQuestionId}
          onShowAnswers={handleShowAnswers}
          setIsAnswerModalOpen={setIsAnswerModalOpen}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredQuestions.length / 5)}
          onPageChange={setCurrentPage}
        />

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
      </section>
    </div>
  );
};

export default QnA_page;

import React, { useState, useEffect } from "react";
import { Table } from "../../components/Admin/Table";
import { Pagination } from "../../components/Common/common4All/Pagination";
import Modal from "../../components/Common/common4All/Modal";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import {
  Eye,
  XCircle,
  CheckCircle, 
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import InputField from "../../components/Auth/InputField";
import { API } from "../../Config/adminAxios";

import Spinner from "../../components/Common/common4All/Spinner";
import { Tooltip } from "@mui/material";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { toast } from "react-toastify";


const QUESTIONS_PER_PAGE = 8;



const QA_mgt: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<
    IQuestion | undefined
  >(undefined);
  const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<TSort>("createdAt");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TFilter>("all");
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);

  console.log(sortField, sortOrder, statusFilter, searchQuery);
  // Fetch questions from API
  const fetchQuestions = async () => {

    try {
      const intravel =  setTimeout(() => {
        setLoading(true)
      }, 1000);
      const { data, status } = await API.get(`/admin/qa-management`, {
        params: {
          search: searchQuery,
          Status: statusFilter,
          sortField,
          sortOrder,
          page: currentPage,
          limit: QUESTIONS_PER_PAGE,
        },
      });
      console.log(data?.questions);
      if (status === 200 && data?.success) {
        setQuestions(data?.questions);
        setTotalDocuments(data?.docCount);
      }
      clearInterval(intravel)
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {

    fetchQuestions();
  }, [sortField, searchQuery, sortOrder, statusFilter,currentPage]);

  const filterQuestions = (questions: IQuestion[]) => {
    return questions
      .filter(
        (q) =>
          ((q.content &&
            q.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q?.user &&
              q?.user?.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))) &&
          (statusFilter === "all" ||
            (statusFilter === "blocked" && q?.isBlocked) ||
            (statusFilter === "active" && !q?.isBlocked))
      )
      .sort((a, b) => {
        if (sortField === "createdAt") {
          return sortOrder === "asc"
            ? new Date(a?.createdAt).getTime() -
                new Date(b?.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return sortOrder === "asc"
            ? (a?.answers ? a?.answers : 0) - (b?.answers ? b?.answers : 0)
            : (b?.answers ? b?.answers : 0) - (a?.answers ? a.answers : 0);
        }
      });
  };

  const toggleQuestionBlock = async (questionId: string) => {
    console.log("Toggle question block:", questionId);
    try {
      if (!questionId) {
        toast.error("Credential not found");
        return;
      }
      const response = await API.patch(
        `/admin/qa_management/change_question_status`,
        { questionId }
      );
      if (response.data?.success && response.status === 200) {
        toast.dismiss();
        setQuestions((prevQuestions) =>
          prevQuestions.map((qa) =>
            qa._id === questionId ? { ...qa, isBlocked: !qa.isBlocked } : qa
          )
        );
        toast.success(response.data?.message);
      }
    } catch (error: unknown) {
      errorHandler(error);
    }
  };

  const toggleAnswerBlock = async (questionId: string, answerId: string) => {
    console.log(questionId, answerId, "qkaslkdjflkasdjflajsjl");
    try {
      if (!questionId || !answerId) {
        toast.error("credential not found");
        return;
      }
      // setLoading(true)
      const response = await API.patch(
        `/admin/qa_management/change_answer_status`,
        { answerId }
      );
      console.log(response?.data, response.status, response.data?.message);

      if (response.data?.success && response?.status === 200) {
        // toast.dismiss();

        setQuestions((prevQuestions) => {
          return prevQuestions.map((question) => {
            if (question._id === questionId) {
              return {
                ...question,
                answerData: question.answerData?.map((ans) => {
                  if (ans._id === answerId) {
                    const updatedAnswer = {
                      ...ans,
                      isBlocked: !ans.isBlocked,
                    };
                    console.log("Updated Answer:", updatedAnswer);
                    return updatedAnswer;
                  }
                  return ans;
                }),
              };
            }
            return question;
          });
        });
        setSelectedQuestion((prevSelectedQuestion) => {
          if (!prevSelectedQuestion) return prevSelectedQuestion;

          return {
            ...prevSelectedQuestion,
            answerData: prevSelectedQuestion.answerData?.map((ans) =>
              ans._id === answerId ? { ...ans, isBlocked: !ans.isBlocked } : ans
            ),
          };
        });

        toast.success(response.data?.message);
      }
    } catch (error: unknown) {
      errorHandler(error);
    }
  };

  const filteredQuestions = filterQuestions(questions);
  const totalPages = Math.ceil(totalDocuments / QUESTIONS_PER_PAGE);
  const indexOfLastCategory = currentPage * QUESTIONS_PER_PAGE;
  const indexOfFirstCategory = indexOfLastCategory - QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  // (currentPage-1 ) * QUESTIONS_PER_PAGE,
  // currentPage * QUESTIONS_PER_PAGE

  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold mb-8">Q&A Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value as TFilter)
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-gray-400" />
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortField(field as TSort);
                setSortOrder(order as TSortOrder);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="answers-1">Answered</option>
              <option value="answers-0">UnAnswered</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Table headers={["Question", "Answers", "Status", "Actions"]}>
            {currentQuestions.map((question) => (
              <tr key={question._id}>
                <td className="px-6 py-4 ">
                  <div className="max-w-md">
                    <p className="truncate">{question.content}</p>
                    <p className="text-sm text-gray-500">
                      by {question?.user?.name} •{" "}
                      {new Date(question?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center ">
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsAnswersModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mx-auto"
                  >
                    <Eye size={16} />
                    View ({question?.answerData?.length})
                  </button>
                </td>


                <td className="px-6 py-4 text-center">
                  <StatusBadge
                    status={question.isBlocked ? "blocked" : "active"}
                  />
                </td>
                <td className="px-6 py-4 text-center ">
                  <button
                    onClick={() => toggleQuestionBlock(question?._id as string)}
                    // className={`   items-center gap-1 px-3 py-1 rounded-md  text-white`}
                  >
                    {question.isBlocked ? (
                      <>
                        <Tooltip
                          arrow
                          title="unblock"
                          children={
                            <CheckCircle className="w-10  text-green-600 hover:text-green-700" />
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Tooltip
                          arrow
                          title="block"
                          children={
                            <XCircle className="w-10  text-red-600 hover:text-red-700" />
                          }
                        />
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0">
      <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
      </div>

      <Modal
        isOpen={isAnswersModalOpen}
        onClose={() => setIsAnswersModalOpen(false)}
      >
        {selectedQuestion && selectedQuestion.answerData && (
          <div className="space-y-4 ">
            <h2 className="text-xl font-bold">Question</h2>
            <p className="text-gray-700 mb-4">{selectedQuestion.content}</p>

            <h3 className="text-lg font-semibold">
              Answers ({selectedQuestion?.answers})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {selectedQuestion && selectedQuestion?.answerData?.length > 0 ? (
                selectedQuestion?.answerData.map((answer: Ianswer) => (
                  <div
                    key={answer._id}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        by {answer.author?.name} •{" "}
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() =>
                          toggleAnswerBlock(
                            selectedQuestion._id as string,
                            answer._id as string
                          )
                        }
                      >
                        {answer.isBlocked ? (
                          <>
                            <Tooltip
                              arrow
                              title="unblock"
                              children={
                                <CheckCircle className="w-8  text-green-600 hover:text-green-700" />
                              }
                            />
                          </>
                        ) : (
                          <>
                            <Tooltip
                              arrow
                              title="block"
                              children={
                                <XCircle className="w-8  text-red-600 hover:text-red-700" />
                              }
                            />
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {answer.answer}
                    </p>
                  </div>
                ))
              ) : (
                <p>No answers available</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QA_mgt;

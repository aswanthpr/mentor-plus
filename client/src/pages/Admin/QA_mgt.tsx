import React, { useCallback, useEffect, useState } from "react";

import {
  Eye,
  XCircle,
  CheckCircle,
  Search,
  Filter,
  ArrowUpDown,
  Frown,
} from "lucide-react";
import InputField from "../../components/Auth/InputField";
import { Pagination, Tooltip } from "@mui/material";
import { toast } from "react-toastify";

import {
  changeQuestionStatus,
  fetchChangeAnswerStatus,
  fetchQuestionMangement,
} from "../../service/adminApi";
import { Table } from "../../components/Admin/Table";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import Modal from "../../components/Common/common4All/Modal";
import { HttpStatusCode } from "axios";
import { Messages } from "../../Constants/message";
import Spinner from "../../components/Common/common4All/Spinner";

const QA_mgt: React.FC = () => {
  const QUESTIONS_PER_PAGE = 8;

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
  const [loading, setLoading] = useState<boolean>(false);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    let flag = true;
    setLoading((pre)=>!pre)
    const response = await fetchQuestionMangement(
      searchQuery,
      statusFilter,
      sortField,
      sortOrder,
      currentPage,
      QUESTIONS_PER_PAGE
    );
    setLoading((pre)=>!pre)
    if (
      response?.status === HttpStatusCode?.Ok &&
      response?.data?.success &&
      flag
    ) {
      setQuestions(response?.data?.questions);
      setTotalDocuments(response?.data?.totalPage);
    }

    return () => {
      flag = false;
    };
  }, [currentPage, searchQuery, sortField, sortOrder, statusFilter]);

  useEffect(() => {
   
    fetchQuestions();
   
  }, [
    sortField,
    searchQuery,
    sortOrder,
    statusFilter,
    currentPage,
    fetchQuestions,
  ]);

  const toggleQuestionBlock = useCallback(async (questionId: string) => {
    if (!questionId) {
      toast.error(Messages?.CREDENTIAL_NOT_FOUND);
      return;
    }
    const response = await changeQuestionStatus(questionId);

    if (response.data?.success && response.status === HttpStatusCode?.Ok) {
      toast.dismiss();
      setQuestions((prevQuestions) =>
        prevQuestions.map((qa) =>
          qa._id === questionId ? { ...qa, isBlocked: !qa.isBlocked } : qa
        )
      );
      toast.success(response.data?.message);
    }
  }, []);

  const toggleAnswerBlock = useCallback(
    async (questionId: string, answerId: string) => {
      if (!questionId || !answerId) {
        toast.error(Messages?.CREDENTIAL_NOT_FOUND);
        return;
      }
      // setLoading(true)
      const response = await fetchChangeAnswerStatus(answerId);

      if (response.data?.success && response?.status === HttpStatusCode?.Ok) {
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
    <div className="p-6 mt-16  ">
        {loading && <Spinner />}
      <div className="bg-white rounded-lg shadow-md p-6 h-[89vh]">
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
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
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700 " />
        {questions.length > 0 ? (
          <Table headers={["Question", "Answers", "Status", "Actions"]}>
            {questions?.map((question) => (
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
        ) : (
          <div className="text-center text-gray-500 mt-4  mb-8 flex justify-center items-center ">
            <Frown className="w-5 mr-4" /> <span>No Data Available</span>
          </div>
        )}
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex justify-center mt-3">
          <Pagination
            count={ typeof totalDocuments==='number'?totalDocuments:1}
            page={currentPage} // Current page
            onChange={handlePageChange} // Page change handler
            color="standard" // Pagination color
            shape="circular" // Rounded corners
            size="small" // Size of pagination
            siblingCount={1} // Number of sibling pages shown next to the current page
            boundaryCount={1} // Number of boundary pages to show at the start and end
          />
        </div>
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

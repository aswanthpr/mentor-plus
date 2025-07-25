import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import {
  BadgeCheckIcon,
  EditIcon,
  FilePenIcon,
  Github,
  Linkedin,
  NotepadText,
  PenLineIcon,
  Trash,
  X,
} from "lucide-react";
import AddQuestion from "./AddQuestion";
import profileImg from "../../../Asset/user.png"; 


const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  newAnswer,
  EditedData,
  onEditAnswer,
  currentUserId,
  onEditQuestion,
  onDeleteQestion,
  setAnswerQuestionId,
  setIsAnswerModalOpen,
 

}) => {
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | undefined>(
    undefined
  );
  const [pickedQuestion, setPickedQuestion] = useState<IQuestion | null>(null);


  const canEditQuestion = useCallback((question: IQuestion) => {
    return question.menteeId === currentUserId;
  },[currentUserId]);
  useEffect(() => {

    if (EditedData&&Object.values(EditedData).length) {
      setPickedQuestion((prev) => {
        if (prev) {
         
          const { title = "", answerData } = prev;

          return {
            ...prev,
            title, 
            answerData: answerData
              ? answerData.map((ans) =>
                  ans._id === EditedData.answerId
                    ? { ...ans, answer: EditedData.content }
                    : ans
                )
              : [],
          };
        }
        return prev;
      });
    }
    
    
  }, [questions, EditedData]);
  
  useEffect(()=>{
    if (newAnswer&&Object.values(newAnswer).length) {
      setPickedQuestion((prev) => {
        if (!prev) return prev;
    
        return {
          ...prev,
          answerData: prev.answerData && prev.answerData.length > 0 
            ? [newAnswer, ...prev.answerData] 
            : [newAnswer],
        };
      });
    } 
  },[newAnswer])
  return (
    <>
      {questions.length === 0 ? (
        <div className="flex text-center text-gray-500 py-6 justify-center items-center ">
           No questions available.
          <NotepadText className="w-8 "/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {questions.map((question) => (
            <div
              key={question?._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 break-words"
            >
              <div className="flex justify-between items-start ">
                <h3 className="text-xl font-semibold text-gray-900">
                  {question.title}
                </h3>
              </div>

              <p className="mt-2 text-gray-600 line-clamp-3">
                {question.content}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img  loading="lazy"
                    src={question.user?.profileUrl??profileImg }
                    alt={question.user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-500">
                    {question.user?.name}
                  </span>
                  {question.user?._id !== currentUserId ? (
                    <div className="flex items-center gap-2">
                      <Tooltip
                        children={
                          <a
                        href={question.user?.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#ff8800]"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                        }
                        title="Github"
                        arrow
                        placement="bottom"
                      />
                      
                      {question.user?.linkedinUrl && (
                        <Tooltip
                        children={
                          <a
                          href={question.user?.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[#ff8800]"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        }
                        title="Linkedin"
                        arrow
                        placement="bottom"
                      />
                       
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="flex justify-between space-x-4">
                  {canEditQuestion(question) && (
                    <>
                      <Tooltip
                        children={
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="text-[#ff8800] hover:text-[#ff9900]"
                            aria-label={`Edit question titled "${question.title}"`}
                          >
                            <EditIcon className="w-4" />
                          </button>
                        }
                        title="Edit"
                        arrow
                        placement="bottom"
                      />

                      <Tooltip
                        children={
                          <button
                            children={<Trash className="text-[#ff8800] w-4 " />}
                            onClick={() =>
                              onDeleteQestion?.(question?._id as string)
                            }
                          />
                        }
                        title={"Delete"}
                        arrow
                        placement="bottom"
                      />
                    </>
                  )}
                  <Tooltip
                    className="flex"
                    arrow
                    children={
                      <button
                        onClick={() => setPickedQuestion(question)}
                        className="text-[#ff8800] hover:text-[#ff9900] "
                      >
                        <PenLineIcon className="w-4 mr-1" />
                        <span className="text-sm">
                          ({question.answerData?.length??question.answers}){" "}
                        </span>
                      </button>
                    }
                    title={"Answers"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {pickedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setPickedQuestion(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex flex-col justify-between items-center">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-md font-bold text-gray-900">Answers</h2>

                  <button
                    onClick={() => setPickedQuestion(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors "
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {pickedQuestion.content}
                </p>
              </div>
              <div className="relative ml-6 lg:left-72 sm:left-72 xs:left-52 xss:left-36">
                <Tooltip
                  children={
                    <button
                      onClick={() => {
                        setIsAnswerModalOpen(true);
                        setAnswerQuestionId(pickedQuestion["_id"] as string);
                      }}
                      className="text-orange-500 hover:text-orange-300 transition-colors"
                    >
                      <FilePenIcon className="w-5 ml-4 relative top-1" />
                    </button>
                  }
                  title="write new answer"
                  placement="bottom"
                  arrow
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto overflow-x-hidden flex-1">
              {pickedQuestion?.answerData?.[0] &&
              (pickedQuestion.answerData?.length ?? 0) > 0 ? (
                <div  key={pickedQuestion?._id} className="space-y-6">
                  {pickedQuestion.answerData.map((answer) => (
                    <div
                      key={answer?._id}
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <img  loading="lazy"
                          src={answer?.author?.profileUrl??profileImg}
                          alt={answer?.author?.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            {answer?.authorType=='mentor'?(
                            <span className="font-medium text-gray-900 flex">
                              
                              {answer.author?.name }<BadgeCheckIcon className="text-green-400 w-4 ml-1"/>
                            </span>

                            ):(<span className="font-medium text-gray-900">
                              
                              {answer.author?.name }
                            </span>)}
                            {answer.authorId !== currentUserId ? (
                              <div className="flex items-center gap-2">
                                <Tooltip
                                  children={
                                <a
                                  href={answer?.author?.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-[#ff8800]"
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                                 }
                                 title="github"
                                 arrow
                                 placement="bottom"
                               />
                                {answer?.author?.linkedinUrl && (
                                  <Tooltip
                                  children={
                                    <a
                                    href={answer?.author?.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#ff8800]"
                                  >
                                    <Linkedin className="w-4 h-4" />
                                  </a>
                                  }
                                  title="Linkedin"
                                  arrow
                                  placement="bottom"
                                />
                                  
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(answer?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {answer?.authorId === currentUserId && (
                          <div className="ml-auto">
                            <Tooltip
                              children={
                                <button
                                  onClick={() =>
                                    onEditAnswer(
                                      answer?.answer,
                                      answer._id as string
                                    )
                                  }
                                  className="text-[#ff8800] hover:text-[#ff9900]"
                                  aria-label={`Edit Answer`}
                                >
                                  <EditIcon className="w-4" />
                                </button>
                              }
                              title="Edit Answer"
                              arrow
                              placement="bottom"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600  whitespace-pre-wrap break-words">
                        {answer?.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No answers yet &#x1F615;. Be the first to answer!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editingQuestion && (
        <AddQuestion
          isOpen={true}
          onClose={() => setEditingQuestion(undefined)}
          onAdd={(updatedQuestion) => {
            if (onEditQuestion) {
              onEditQuestion(
                editingQuestion?._id as string,
                updatedQuestion
              );
            }
            setEditingQuestion(undefined);
          }}
          initialQuestion={editingQuestion}
          isEditing={true}
        />
      )}
    </>
  );
};

export default QuestionList;

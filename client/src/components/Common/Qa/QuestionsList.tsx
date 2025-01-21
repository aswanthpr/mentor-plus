import React ,{useState} from 'react';
import { Tooltip } from '@mui/material';
import {EditIcon, FilePenIcon, Github,Linkedin, PenLineIcon, Trash, X } from 'lucide-react';
import AddQuestion from './AddQuestion';
import falseLogo from '../../../Asset/images.png';



interface QuestionListProps {
  questions: IQuestion[];
  onEditQuestion?:(questionId: string, question: IQuestion) => void;
  currentUserId?: string;
  onShowAnswers: (questionId: string) => void;
  onDeleteQestion?: (questionId: string) => void
  setIsAnswerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  passQuestionId?:(questId:string)=>void;
  setAnswerQuestionId:React.Dispatch<React.SetStateAction<string>>
}
const  QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  onEditQuestion,
  currentUserId ,
  onDeleteQestion,
  setIsAnswerModalOpen,
  setAnswerQuestionId


}) => {
  const [editingQuestion, setEditingQuestion] = useState<IQuestion|undefined >(undefined);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);

  const canEditQuestion = (question: IQuestion) => {
  
    return question.user?._id === currentUserId;
  };
 


  return (
    <>
    {questions.length === 0 ? (
  <div className="text-center text-gray-500 py-8">No questions available.
  </div>
) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {questions.map((question) => (
          <div key={question?._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 break-words">
            <div className="flex justify-between items-start ">
              <h3 className="text-xl font-semibold text-gray-900">{question.title}</h3>
             
            </div>
            
            <p className="mt-2 text-gray-600 line-clamp-3">{question.content}</p>
            
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
                <img
                  src={question.user?.profileUrl||falseLogo}
                  alt={question.user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-500">{question.user?.name}</span>
              </div>
              <div className='flex justify-between space-x-4'>
              {canEditQuestion(question)  && (
                <>
                <Tooltip
                children={
                        <button

                          onClick={() => setEditingQuestion(question)}
                          className="text-[#ff8800] hover:text-[#ff9900]"
                          aria-label={`Edit question titled "${question.title}"`}
                        >
                          <EditIcon className='w-4' />

                        </button>
                }
                title='Edit'
                arrow
                placement='bottom'
                />
               
                <Tooltip
                children={
                  
                  <button
                 
                      children={<Trash className='text-[#ff8800] w-4 '/>}
  
                      onClick={() => onDeleteQestion?.(question?._id as string)}
                  />
                }
                title={'Delete'}
                arrow
                placement='bottom'
                
                />
                </>
              )}
              <Tooltip
              arrow
              children={ <button
                onClick={() => setSelectedQuestion(question)}
                className="text-[#ff8800] hover:text-[#ff9900]"
              >
                <PenLineIcon className='w-4'/> 
             {/* ({question.answerId?.length})  */}
             </button>}
              title={'Answers'}
              />
             


              </div>
            </div>
          </div>
        ))}
      </div>
)}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex flex-col justify-between items-center">
              <div>
                <div className='flex justify-between'>
                  <h2 className="text-md font-bold text-gray-900">Answers
             </h2>
                 
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors "
              >
                <X className="h-5 w-5" />
              </button>

                </div>
                <p className="text-sm text-gray-500 mt-1">{selectedQuestion.content}</p>
                
              </div>
              <div className='relative lg:left-72 sm:left-72 xs:left-56 xss:left-40'>
              <Tooltip
              children={
                  <button
                  onClick={() =>{ 
                  setIsAnswerModalOpen(true)
                  setAnswerQuestionId(selectedQuestion['_id'] as string)
                  }} 
                    className="text-orange-500 hover:text-orange-300 transition-colors"
                  >
                    <FilePenIcon className="w-5 ml-4 relative top-1" />
                  </button>
              }
              title='write new answer'
              placement='bottom'
              arrow
              />
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              
              {selectedQuestion.answerData &&selectedQuestion.answerData?.length > 0 ? (
                <div className="space-y-6">
                  {selectedQuestion.answerData.map((answer) => (
                    <div key={answer?._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={answer?.author?.profileUrl}
                          alt={answer?.author?.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {answer?.author?.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={answer?.author?.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-[#ff8800]"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                              {answer?.author?.linkedinUrl && (
                                <a
                                  href={answer?.author?.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-[#ff8800]"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(answer?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">{answer?.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No answers yet. Be the first to answer!
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
           if(onEditQuestion){

             onEditQuestion(editingQuestion?._id as string  ,updatedQuestion as IQuestion);
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
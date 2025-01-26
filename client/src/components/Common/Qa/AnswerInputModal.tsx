import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../../Auth/Button";
import  * as Yup from 'yup'
import { answerInputSchema } from "../../../Validation/yupValidation";


interface AnswerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, answerId?: string) => void;
  answerId?: string;
  receiveAnswer?: string;
}
const AnswerInputModal: React.FC<AnswerInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  answerId,
  receiveAnswer,
}) => {
  const [answer, setAnswer] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [error,setError] = useState<string>('')

  useEffect(() => {
    if (isOpen && textAreaRef.current) {
      textAreaRef.current.focus();
    }
    setAnswer(receiveAnswer as string);
  }, [isOpen, receiveAnswer]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
     await answerInputSchema.validate({ answer })
     setError('')
     onSubmit(answer, answerId);
     setAnswer("");
     onClose();
    } catch (error:unknown) {
      if (error instanceof Yup.ValidationError) {

        setError(error.message); 
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-8 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {" "}
            {answerId ? "Edit Your Answer" : "Write Your Answer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            ref={textAreaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-80 p-3 border border-[#ff8800] rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Write your answer here..."
          />
   {error && <div className="text-red-500 text-sm font-normal mt-2 text-center">{error}</div>}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="submit"
              className="text-white font-semibold"
              variant="orange"
              children={answerId ? "Update" : "Submit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerInputModal;

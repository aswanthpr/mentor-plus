import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../../Auth/Button";

interface AnswerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

const AnswerInputModal: React.FC<AnswerInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [answer, setAnswer] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isOpen && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer);
    setAnswer("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Write Your Answer</h2>
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
            className="w-full h-64 p-3 border border-[#ff8800] rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Write your answer here..."
          />

          <div className="mt-4 flex justify-end gap-2">
           

            <Button
            type="submit"
            className="text-white font-semibold"
            variant="orange"
            children={'Submit'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerInputModal;

import React, { useState } from 'react';
import { X } from 'lucide-react';
import TagInput from './TagInput';
import InputField from '../../Auth/InputField';
import { validateSkills } from '../../../Validation/Validation';
export interface Answer {
  id: string;
  content: string;
  author: IMentee;
  createdAt: string;
}

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question:IeditQuestion) => void;
  initialQuestion?: IQuestion;
  isEditing?: boolean;
}

const AddQuestion: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialQuestion,
  isEditing = false 
}) => {
  const [title, setTitle] = useState<string>(initialQuestion?.title ?? '');
  const [content, setContent] = useState<string>(initialQuestion?.content ?? '');
  const [tags, setTags] = useState<string[]>(initialQuestion?.tags ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Question content is required';
    if (tags.length === 0) newErrors.tags = 'At least one tag is required';
    if (tags) {
      const err = validateSkills(tags);
      if(err!=""){
        newErrors.tags =err; 
      }
    }
    setErrors(newErrors);
    console.log(errors)
    return Object.keys(newErrors).length === 0;
  };

  const handleClose =()=>{
    setTitle("")
    setContent("")
    setTags([])
    onClose()
  }
  

  const handleSubmit = (e: React.FormEvent) => {
 
    e.preventDefault();
  
    if (!validateForm()) return;
 
    const question:IeditQuestion= {
      title,
      content,
      tags,
    };

    onAdd(question);
    handleClose()
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Question' : 'Add Question'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>

            <InputField

              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full rounded-md shadow-sm ${errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#ff8800] focus:ring-[#ff8800]'
                }`}
              name='title'
              placeholder='Question Title'
              error={errors.title}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600"></p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Question Details
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className={`mt-1 block w-full rounded-md shadow-sm border p-3 outline-none ${errors.content
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#ff8800] focus:ring-[#ff8800] border-r-2'
                }`}
              placeholder="Question Details"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (max 5)
            </label>
            <TagInput
              tags={tags}
              onChange={setTags}
              maxTags={5}
              error={errors.tags}

            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
            >
              {isEditing ? 'Update' : 'Add'} Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion
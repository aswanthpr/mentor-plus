import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';


const TagInput: React.FC<TagInputProps> = ({ tags, onChange, maxTags, error }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && tags.length < maxTags) {
        const newTag = input.trim();
        if (!tags.includes(newTag)) {
          onChange([...tags, newTag]);
        }
        setInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className={`mt-1 flex flex-wrap gap-2 p-2 border rounded-md ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}>
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "Press enter to add tags" : ""}
            className="flex-1 min-w-[120px] outline-none border-r-2 "
          />
          
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <p className="mt-1 text-sm text-gray-500">
        {maxTags - tags.length} tags remaining
      </p>
    </div>
  );
};

export default TagInput;
import React, { useState } from 'react';
import { X } from 'lucide-react';


export const SkillInput: React.FC<ISkill> = ({ skills, onSkillsChange, maxSkills = 8 }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (skills.length < maxSkills) {
                const newSkill = inputValue.trim();
                if (!skills.includes(newSkill)) {
                    onSkillsChange([...skills, newSkill]);
                    setInputValue('');
                }
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onSkillsChange(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className='space-y-2'>
            <input 
                type="text"
                value={inputValue}
                onKeyDown={handleKeyDown}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                placeholder='Type a skill and press Enter'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500'
                disabled={skills.length >= maxSkills} // Disable input when skills reach the max limit
            />
            
            <div className='flex flex-wrap gap-2'>
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className='flex items-center gap-1 px-3 bg-orange-100 text-orange-800 rounded-full'
                    >
                        <span>{skill}</span>
                        <button 
                            type='button'
                            onClick={() => removeSkill(skill)}
                            className='hover:text-orange-900'
                        >
                            <X size={14}/>
                        </button>
                    </div>
                ))}
            </div>

            <p className='text-sm text-gray-600'>
                {skills.length}/{maxSkills} skills added
            </p>
        </div>
    );
};

export default SkillInput;

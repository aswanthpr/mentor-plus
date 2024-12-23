import React from 'react';
interface InputFieldProps{
    label?:string;
    type:string;
    id?:string;
    placeholder?:string;
    value:string;
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    error?:string;
    required?:boolean;
    className?:string;
    name?:string
}

const InputField:React.FC<InputFieldProps> = (props) => {
  return (
    <div className='space-y-2'>
        <label 
        htmlFor={props.id} 
        className='block text-sm font-medium text-grey-700'>{props.label}
        </label>
        <input
         type={props.type}
         id={props.id}
         name={props.name}
         placeholder={props.placeholder}
         value={props.value}
         onChange={props.onChange}
         required={props.required}
         className={`w-full px-3 py-2 border rounded-lg outline-none transition-all ${props.className} ${
            props.error
            ?' border-red-700 focus:ring-2 focus:ring-red-300'
            : 'border-grey-300 focus:ring-2 focus:ring-[#ff8800] focus:border-transparent'

         }`}

          />
          {props.error && <p className='text-sm text-red-500'>{props.error}</p>}

    </div>
  )
}

export default InputField

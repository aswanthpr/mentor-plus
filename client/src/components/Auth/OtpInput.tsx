import React,{useRef}from 'react'


export const OtpInput:React.FC<IOtpinput> = (props) => {
    const inputRefs = useRef<(HTMLInputElement|null)[]>([]);

    const handleChange = (index:number)=>(e:React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = e.target.value;
        if(newValue.length>1)return ;
        const newOTP = props.value.split('');
        newOTP[index] =newValue;
        props.onChange(newOTP.join(''))

        //move to next input if value is entered

        if(newValue && index<5){
            inputRefs.current[index+1]?.focus();

        }
    }
    const handleKeyDown = (index:number)=>(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key ==="Backspace" && !props.value[index]&& index >0){
            inputRefs.current[index-1]?.focus();

        }
    }

  return (
    
        <div className='flex gap-2 '>
           {Array(6).fill(null).map((_,index)=>(
            <input
            key={index}
            ref={(ref)=>inputRefs.current[index]=ref}
             type="text"
            maxLength={1}
            className=' w-12 h-12 text-center border-2 border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200'
            value={props.value[index]||""}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            
              />
           ))}
        </div>
 
  )
}

export default OtpInput
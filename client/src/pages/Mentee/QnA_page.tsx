
import { MessageCircleQuestion } from 'lucide-react'
import React from 'react'

const  QnA_page:React.FC= () => {
  return (
    <div >
    <div className="mb-6 mt-16">
        

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold ml-5 mt-2 ">
            Your Question nd Answers
          </h1>
          <button
        
            className="mt-4 mr-8 bg-[#ff8800] text-white hover:bg-[#e67a00] px-4 py-2 rounded-md font-bold transition-colors flex"
          >Ask Qestions  
        
          <MessageCircleQuestion className=' ml-1'/>
          
          </button>
        </div>
      </div>


<div className='h-0.5 bg-gray-200 w-full'/>

<section className='flex items-center justify-between mb-6'>

</section>

</div>
  )
}

export default QnA_page
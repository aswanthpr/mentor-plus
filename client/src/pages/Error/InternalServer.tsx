import React from 'react';
import { HomeIcon,RotateCcw } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import internal_Server from '../../Asset/500 Internal Server Error-cuate(1).svg'

const InternalServer:React.FC = () => {
const navigate =useNavigate()

const handleRefresh=()=>{
    window.location.reload();
}
  return (
    <div className='min-h-screen bg-gray-50 flex items-center  justify-center px-4  py-12  sm:px-6 lg:px-8 '>
        
        <div className='max-w-md w-full text-center'>
            
            <div className='space-y-6 '>
                <div className='relative'>
                
                    <div className='absolute inset-0 flex items-center justify-center'>
                    <img src={internal_Server} alt="Lost in space "
                        className=' w-50 h-50  object-cover rounded-sm border-orange-300 ' />

                    </div>
                </div>
   
            </div>

        </div>
        <div className='space-y-4 '>
        <h2 className='text-3xl font-bold text-gray-900 text-center'>
            Something Went Wrong
        </h2>
        <p className="text-gray-600">
              Our servers are taking a quick break. Don't worry, we're working to get things back to normal.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
            onClick={handleRefresh} 
            className='inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg text-base font-bold text-[#000000]bg-[#ffffff] hover:bg-[hsl(31,94%,81%)] hover:text-[#ff8800]  transition-colors duration-200  hover:border-transparent '>
            <RotateCcw className='w-5 h-5 mr-5'/>
            Try Again  

            </button>
            <button
            onClick={()=>navigate('*')}
            className='inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-bold text-[#f5f5f5] bg-[#000000] hover:bg-[#ff8800] hover:text-white transition-colors duration-200'>
            <HomeIcon className="w-5 h-5 mr-2" />
            Back To Home
            </button>
            </div>

    </div>
    </div>
  )
}

export default InternalServer
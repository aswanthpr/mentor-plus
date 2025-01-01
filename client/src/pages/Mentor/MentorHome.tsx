import { HandshakeIcon } from 'lucide-react';
import React from 'react'

const MentorHome:React.FC = () => {
  return (
    <div >
    <div className='mb-8 '>
    <div className='flex items-center gap-3 mb-4 '>
        <h1 className='text-3xl font-bold text-gray-900 ml-8 mt-0' >
        Welcome</h1>
        <HandshakeIcon className='w-8 h-8 text-[#ff8800] mt-2'/>
        </div>     
    </div>

<div className='h-0.5 bg-gray-200 w-full'/>

<section className='flex items-center justify-between mb-6'>
<h2 className='text-3xl font-bold text-gray-900 ml-8 mt-8'>

</h2>
</section>

</div>
  )
}

export default MentorHome;

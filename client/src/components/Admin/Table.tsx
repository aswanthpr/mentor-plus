// import React, { ReactNode } from 'react'

// interface ITable{
//     headers:string;
//     children:ReactNode;
// }
const Table:React.FC = () => {
  return (
    <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50 '>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>header1
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>header2
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>header3
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>header4
                        </th>
                    </tr>
                    
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    childrens
                </tbody>
        </table>

    </div>
  )
}

export default Table
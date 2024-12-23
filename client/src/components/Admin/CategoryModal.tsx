import React from 'react'


interface ICategModal{
heading:JSX.Element|string;
category:string;
handleCategoryChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
error:string;
handleCloseModal:()=>void;
handleSave:()=>void;

}
const CategoryModal:React.FC<ICategModal> = (
   {heading,category,handleCategoryChange,error,handleCloseModal,handleSave}
) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      <input
        type="text"
        name="category"
        value={category}
        onChange={handleCategoryChange}
        className="w-full p-3 rounded-md mb-4 focus:outline-none"
        placeholder="Enter category"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex justify-end">
        <button
          onClick={handleCloseModal}
          className="bg-gray-400 text-white py-1 px-4 mr-4 rounded-md text-sm hover:bg-gray-500 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="bg-[#FF8800] text-white py-1 px-4 rounded-md text-sm hover:bg-[#FF6700] transition-all duration-300"
        >
          Save
        </button>
      </div>
    </div>
  </div>
  )
}

export default CategoryModal
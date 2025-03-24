import { X } from "lucide-react";
import React, { useCallback, useRef } from "react";

const CategoryModal: React.FC<ICategModal> = ({
  heading,
  category,
  handleCategoryChange,
  error,
  handleCloseModal,
  handleSave,
  reference,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    },
    [handleCloseModal]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6">{heading}</h2>

        {/* Input Field */}
        <input
          ref={reference}
          type="text"
          name="category"
          value={category}
          onChange={handleCategoryChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
          placeholder="Enter category"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#FF8800] text-white py-2 px-4 rounded-md hover:bg-[#FF6700] transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

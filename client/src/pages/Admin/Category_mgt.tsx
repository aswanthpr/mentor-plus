import React, { useCallback, useEffect, useState } from "react";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import { Table } from "../../components/Admin/Table";
import { toast } from "react-toastify";
import Spinner from "../../components/Common/common4All/Spinner";
import { categoryValidation } from "../../Validation/Validation";
import { BanIcon, CircleCheckBigIcon, PencilLineIcon } from "lucide-react";
import CategoryModal from "../../components/Admin/CategoryModal";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { Pagination } from "@mui/material";
import { fetchAllcategoryData, fetchCategoryChange, fetchCreateCategory, fetchEditCategory } from "../../service/adminApi";

interface Category {
  _id: string;
  category: string;
  isBlocked?: boolean;
}

const Category_mgt: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<Category>({
    _id: "",
    category: "",
  });
  const CATEGORIES_PER_PAGE = 10;

  //fetch category data
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchAllcategoryData()
      
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (error: unknown) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // Handle modal opening
  const handleAddCategoryClick = useCallback(async (): Promise<void> => {
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(!isModalOpen);
    setCategory("");
    setError("");
  }, [isModalOpen]);
  const handleEditCloseModal = useCallback(() => {
    setIsEditModalOpen(!isEditModalOpen);
    setCategory("");
    setError("");
  }, [isEditModalOpen]);

  // Handle category input change
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault();
      setCategory(e.target.value);
    },
    []
  );

  // Pagination logic
  const indexOfLastCategory = currentPage * CATEGORIES_PER_PAGE;
  const indexOfFirstCategory = indexOfLastCategory - CATEGORIES_PER_PAGE;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  // Handle add category
  const handleAddCategory = useCallback(async (): Promise<void> => {
    const categoryValue = category.trim().toLowerCase();
    const isValid = await categoryValidation(categoryValue);
    if (!isValid) {
      setError(
        "Category must be between 3 and 20 letters, and no symbols or numbers are allowed."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetchCreateCategory(categoryValue)
       

      if (response.data.success && response.status === 201) {
        setCategories((prev) => [...prev, response.data.result]);

        handleCloseModal();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [category, handleCloseModal]);


  //handle edit category modal open
  const handleEditCategory = useCallback((_id: string, category: string) => {
    setIsEditModalOpen(true);
    setEditData({ _id, category });
  }, []);

  //handle edit save
  const editCategorySave = useCallback(async (): Promise<void> => {
    const categoryValue = editData.category.trim().toLowerCase();

    const isValid = await categoryValidation(categoryValue);

    if (!isValid) {
      setError(
        "Category must be between 3 and 20 letters, and no symbols or numbers are allowed."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetchEditCategory(editData?._id, editData?.category)
      

      if (response.data.success && response.status === 200) {
        toast.success(response.data.message);

        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === editData._id ? { ...cat, category: categoryValue } : cat
          )
        );
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      handleEditCloseModal();
    }
  }, [editData._id, editData.category, handleEditCloseModal]);

  //HANDLE CATEGORY BLOCK UNBLOCK;
  const handleBlock = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetchCategoryChange(id)
     
      console.log(response.data, response.status, response.data.message);
      if (response.data.success && response.status === 200) {
        toast.dismiss();

        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === id ? { ...cat, isBlocked: !cat.isBlocked } : cat
          )
        );
        setTimeout(() => {
          toast.success(response.data.message);
        }, 500);
      }
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);
  const notify = useCallback(
    (id: string) => {
      toast(
        <ConfirmToast
          message="Change Category Status"
          description="Are you sure you want to change Status?"
          onReply={() => handleBlock(id as string)}
          onIgnore={() => toast.dismiss()}
          ariaLabel="category status confirmation"
        />,
        {
          closeButton: false,
          className: "p-0  border border-purple-600/40 ml-0",
          autoClose: false,
        }
      );
    },
    [handleBlock]
  );
  const handlecategoryBlock = useCallback(
    async (id: string) => {
      // Show confirmation toast before performing block action
      notify(id);
    },
    [notify]
  );
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );

  return (
    <div>
      {/* Category Management Section */}
      <div className="mb-6 mt-16">
        {loading && <Spinner />}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold ml-5">Category Management</h1>
          <button
            onClick={handleAddCategoryClick}
            className="mt-4 mr-8 bg-[#ff8800] text-white hover:bg-[#e67a00] px-4 py-2 rounded-md font-bold transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="h-0.5 bg-gray-200 w-full" />

      {/* Modal for Adding Category */}
      {isModalOpen && (
        <CategoryModal
          heading={"Add new Category"}
          handleCategoryChange={handleCategoryChange}
          handleCloseModal={handleCloseModal}
          handleSave={handleAddCategory}
          category={category}
          error={error}
        />
      )}

      {/* Table for displaying categories */}
      <Table headers={["Category Name", "Status", "Edit", "Actions"]}>
        {currentCategories.map((category) => (
          <tr key={category._id}>
            <td className="text-center  py-4">{category.category}</td>
            <td className="text-center py-4">
              <StatusBadge status={category.isBlocked ? "blocked" : "active"} />
            </td>
            <td className="text-center  py-4">
              <button
                className=" text-blue-600 hover:text-blue-800 font-bold"
                onClick={() =>
                  handleEditCategory(category._id, category.category)
                }
              >
                <PencilLineIcon />
              </button>
            </td>
            <td className="text-center  py-4">
              <button
                onClick={() => handlecategoryBlock(category._id)}
                className={`${
                  category.isBlocked
                    ? "text-green-800 hover:text-green-400"
                    : "text-red-800 hover:text-red-400"
                } font-extrabold`}
              >
                {category.isBlocked ? (
                  <CircleCheckBigIcon color="green" />
                ) : (
                  <BanIcon color="red" />
                )}
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {/* Pagination component */}
      <div className="flex justify-center items-center">
        <Pagination
          count={Math.ceil(categories.length / CATEGORIES_PER_PAGE)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Page change handler
          color="standard" // Pagination color
          shape="circular" // Rounded corners
          size="small" // Size of pagination
          siblingCount={1} // Number of sibling pages shown next to the current page
          boundaryCount={1} // Number of boundary pages to show at the start and end
        />
      </div>

      {/* Modal for eding Category */}
      {isEditModalOpen && (
        <CategoryModal
          heading={"Edit Category"}
          handleCategoryChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditData({ ...editData, category: e.target.value })
          }
          handleCloseModal={handleEditCloseModal}
          handleSave={editCategorySave}
          category={editData.category}
          error={error}
        />
      )}
    </div>
  );
};

export default Category_mgt;

import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import { Table } from "../../components/Admin/Table";
import { toast } from "react-toastify";
import Spinner from "../../components/Common/common4All/Spinner";
import { categoryValidation } from "../../Validation/Validation";
import {
  ArrowUpDown,
  BanIcon,
  CircleCheckBigIcon,
  Filter,
  PencilLineIcon,
  Search,
} from "lucide-react";
import CategoryModal from "../../components/Admin/CategoryModal";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";
import { Pagination } from "@mui/material";
import {
  fetchAllcategoryData,
  fetchCategoryChange,
  fetchCreateCategory,
  fetchEditCategory,
} from "../../service/adminApi";
import InputField from "../../components/Auth/InputField";
import { Messages } from "../../Constants/message";
import { HttpStatusCode } from "axios";
import { EDIT_CATEGORY } from "../../Constants/initialStates";

const Category_mgt: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<TalphabetOrder>("atoz");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<TFilter>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<Category>(EDIT_CATEGORY);
  const inputRef = useRef<HTMLInputElement>(null);
  const PAGE_LIMIT = 8;

  //fetch category data
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading((pre)=>!pre)
      const response = await fetchAllcategoryData(
        searchQuery,
        statusFilter,
        sortField,
        sortOrder,
        currentPage,
        PAGE_LIMIT
      );

      setLoading((pre)=>!pre)
      if (response.data.success) {
        setCategories(response.data.categories);
        setTotalDocuments(response?.data?.totalPage);
      }
    };
    fetchCategories();
  }, [currentPage, searchQuery, sortField, sortOrder, statusFilter]);

  useEffect(() => {
    if (isModalOpen || isEditModalOpen) {
      inputRef.current?.focus();
    }
  }, [isModalOpen, isEditModalOpen]);
  // Handle modal opening
  const handleAddCategoryClick = useCallback(async (): Promise<void> => {
    setIsModalOpen((pre) => !pre);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen((pre) => !pre);
    setCategory("");
    setError("");
  }, []);
  const handleEditCloseModal = useCallback(() => {
    setIsEditModalOpen(!isEditModalOpen);
    setCategory("");
    setError("");
  }, [isEditModalOpen]);

  // Handle category input change
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault();
      setCategory(e.target?.value);
    },
    []
  );

  // Handle add category
  const handleAddCategory = useCallback(async (): Promise<void> => {
    const categoryValue = category.trim().toLowerCase();
    const isValid = await categoryValidation(categoryValue.trim());
    if (!isValid) {
      setError(Messages?.CATEGORY_ADD_INPUT_VALIDATION);
      return;
    }

    setLoading(true);

    const response = await fetchCreateCategory(categoryValue);

    if (response.data.success && response.status === HttpStatusCode?.Created) {
      setCategories((prev) => [...prev, response.data.result]);

      handleCloseModal();
      toast.success(response.data.message);
    }

    setLoading(false);
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
      setError(Messages?.CATEGORY_EDIT_INPUT_VALIDATION);
      return;
    }
    const isCategoryExist = categories.some(
      (cat) => cat.category.toLowerCase() === editData?.category
    );

    if (isCategoryExist) {
      setError(Messages?.CATEGORY_EXIST);
      return;
    }

    setLoading(true);

    const response = await fetchEditCategory(editData?._id, editData?.category);

    if (response?.data?.success && response?.status === HttpStatusCode?.Ok) {
      toast.success(response.data.message);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat?._id === editData?._id ? { ...cat, category: categoryValue } : cat
        )
      );
    }

    setLoading(false);

    handleEditCloseModal();
  }, [categories, editData?._id, editData.category, handleEditCloseModal]);

  //HANDLE CATEGORY BLOCK UNBLOCK;
  const handleBlock = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    const response = await fetchCategoryChange(id);

    if (response.data.success && response.status === HttpStatusCode?.Ok) {
      toast.dismiss();

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === id ? { ...cat, isBlocked: !cat.isBlocked } : cat
        )
      );

      toast.success(response.data.message);
    }

    setLoading(false);
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
    <div className={`p-6 mt-10 `}>
      {/* Category Management Section */}
      <div className="mb-3">
        {loading && <Spinner />}

        <div className="flex items-center justify-end mb-1">
          <button
            onClick={handleAddCategoryClick}
            className="mt-4 mr-8 bg-[#ff8800] text-white hover:bg-[#e67a00] px-4 py-2 rounded-md font-bold transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 h-[83vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <InputField
              type={"search"}
              placeholder="Search questions or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value as TFilter)
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-gray-400" />
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortField(field as "atoz" | "ztoa");
                setSortOrder(order as TSortOrder);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            >
              <option value="atoz-asc">A-Z</option>
              <option value="ztoa-desc">Z-A</option>
            </select>
          </div>
        </div>
        {/* Table for displaying categories */}
        <Table headers={["Category Name", "Status", "Edit", "Actions"]}>
          {categories?.map((category) => (
            <tr key={category._id}>
              <td className="text-center  py-4">{category.category}</td>
              <td className="text-center py-4">
                <StatusBadge
                  status={category.isBlocked ? "blocked" : "active"}
                />
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
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700 " />
        {/* Pagination component */}
        <div className="flex justify-center items-center mt-3 ">
          <Pagination
            count={totalDocuments}
            page={currentPage}
            onChange={handlePageChange}
            color="standard"
            shape="circular"
            size="small"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </div>

      {/* Modal for eding Category */}
      {isEditModalOpen && (
        <CategoryModal
          reference={inputRef}
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
      {/* Modal for Adding Category */}
      {isModalOpen && (
        <CategoryModal
          heading={"Add new Category"}
          handleCategoryChange={handleCategoryChange}
          handleCloseModal={handleCloseModal}
          handleSave={handleAddCategory}
          category={category}
          error={error}
          reference={inputRef}
        />
      )}
    </div>
  );
};

export default Category_mgt;

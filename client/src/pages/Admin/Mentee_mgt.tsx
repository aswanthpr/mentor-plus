import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BanIcon, CircleCheckBigIcon, PencilLineIcon } from "lucide-react";
import { Table } from "../../components/Admin/Table";
import { Pagination } from "../../components/Common/Pagination";
import { StatusBadge } from "../../components/Common/StatusBadge";
import { unProtectedAPI } from "../../Helper/Axios";
import profile from "/rb_2877.png";
import ConfirmToast from "../../components/Common/ConfirmToast";
import Modal from "../../components/Common/Modal";
import InputField from "../../components/Common/Form/InputField";
import {
  validateBio,
  validateEmail,
  validateName,
  validatePhone,
} from "../../Validation/Validation";
import Spinner from "../../components/Common/Spinner";

// import { ConfirmationModal }

const MENTEES_PER_PAGE = 5;

interface IMentee {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isBlocked: boolean;
  verified: boolean;
  profileUrl?: string;
}
interface IFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export const Mentee_mgt: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [errors, setErrors] = useState<IFormErrors | undefined>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [menteeData, setMenteeData] = useState<IMentee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IMentee>>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setLoading(true);

        const response = await unProtectedAPI.get(`/admin/mentee_management`);

        if (response.status == 200 && response.data.success) {
          setMenteeData(response.data?.Data);
         
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          console.error(message || "An error occurred");
        } else {
          console.error("An unexpected error occurred. Please try again.");
        }
      }finally{
        setLoading(false)
      }
    };
    fetchUserData();
  }, []);

  const handleMenteeBlock = (id: string) => {
    notify(id);
  };

  const notify = (id: string) => {
    toast(
      <ConfirmToast
        message="Change Mentee Status"
        description="Are you sure you want to change Status?"
        onReply={() => handleBlock(id as string)}
        onIgnore={() => toast.dismiss()}
        ariaLabel="mentee status confirmation"
      />,
      {
        closeButton: false,
        className: "p-0  border border-purple-600/40 ml-0",
        autoClose: false,
      }
    );
  };

  const handleBlock = async (id: string) => {
    try {
      if (!id) toast.error("credential not found");

      const response = await unProtectedAPI.patch(
        `/admin/mentee_management/change_mentee_status`,
        { id }
      );
      console.log(response?.data, response.status, response.data?.message);

      if (response.data?.success && response?.status === 200) {
       
        toast.dismiss();
        
        setMenteeData((prev) =>
          prev.map((mentee) =>
            mentee?._id === id
              ? { ...mentee, isBlocked: !mentee?.isBlocked }
              : mentee
          )
        );
        setTimeout(() => {
          toast.success(response.data?.message);
        }, 1000);
      }
    } catch (error: any) {
      if (error.response && error.response?.data) {
        toast.dismiss();
        const { message } = error.response?.data;
        toast.error(message || "An error occurred");
      } else {
        setTimeout(() => {
          toast.error("An unexpected error occurred. Please try again.");
        }, 1000);
      }
    }
  };

  // const validateForm = () => {
  //   const formErrors: IFormErrors = {};
  //   const { name, email, phone, bio } = formData;

  //   formErrors.name = validateName(name!);
  //   formErrors.email = validateEmail(email!);
  //   formErrors.phone = validatePhone(phone!);
  //   formErrors.bio = validateBio(bio!);

  //   setErrors(formErrors);
  //   console.log(errors, "htsi si formdta");
  //   const filteredErrors = Object.keys(formErrors).filter(
  //     (key:any) => formErrors[key] !== undefined
  //   );
  //   return res;
  // };
  const handleAddMentee = () => {
    setFormData({
      _id: "",
      name: "",
      email: "",
      phone: "",
      bio: "",
    });
    setIsModalOpen(true);
  };
  const modalClose = () => {
    setIsModalOpen(false);
    setFormData({
      _id: "",
      name: "",
      email: "",
      phone: "",
      bio: "",
      profileUrl: "",
    });
    setErrors({});
  };
  const handleEditMentee = async (id: string) => {
    const menteeToEdit = menteeData.find((mentee) => mentee?._id === id);
    if (menteeToEdit) {
      setFormData({ ...menteeToEdit });
      setIsModalOpen(true);
    }
  };
  const handleSaveChanges = async () => {
    // if (validateForm()) {
      setLoading(true)
    try {
      const Data = {
        id: formData?._id,
        name: formData?.name,
        email: formData?.email,
        phone: formData?.phone,
        bio: formData?.bio,
      };

      let response;

      if (formData._id) {
        response = await unProtectedAPI.put(
          `/admin/mentee_management/edit_mentee`,
          Data
        );
      } else {
        response = await unProtectedAPI.post(
          `/admin/mentee_management/add_mentee`,
          Data
        );
      }
      if (response?.status == 200 && response?.data?.success) {
        toast.success(response.data?.message);
        modalClose();

        if (formData?._id) {
          setMenteeData((prev) =>
            prev.map((mentee) =>
              mentee?._id === formData?._id
                ? {
                    ...mentee,
                    name: formData?.name,
                    email: formData?.email,
                    phone: formData?.phone,
                    bio: formData?.bio,
                  }
                : mentee
            )
          );
        } else {
          setMenteeData((prev) => [...prev, response.data.mentee]);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        console.error(message || "An error occurred");
      } else {
        console.error("An unexpected error occurred. Please try again.");
      }
    }finally{
      setLoading(false)
    }
    // }
  };
  return (
    <div className="p-4 pb-4">
      {loading && <Spinner/>}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentee Management</h1>
        <button
          onClick={handleAddMentee}
          className="px-4 py-2 bg-[#ff8800] text-white rounded-md hover:bg-[#e67a00]"
        >
          Add Mentee
        </button>
      </div>

      <hr className="mb-6" />

      <Table
        headers={["Profile", "Name", "Email", "Status", "Edit", "Actions"]}
      >
        {menteeData.map((mentee) => (
          <tr key={mentee?._id}>
            <td className=" py-4 flex justify-center">
              <img
                src={mentee?.profileUrl ? mentee?.profileUrl : profile}
                alt={mentee?.name}
                className="w-10 h-10 rounded-full  "
              />
            </td>
            <td className="px-6  py-4 text-center text-sm">{mentee?.name}</td>
            <td className="px-6 py-4 text-sm text-center">{mentee?.email}</td>

            <td className="px-6  py-4 text-center">
              <StatusBadge status={mentee?.isBlocked ? "blocked" : "active"} />
            </td>
            <td className="px-32  py-4 flex justify-center">
              <button
                className="text-blue-600 hover:text-blue-800 font-bold"
                onClick={() => handleEditMentee(mentee._id)}
              >
                <PencilLineIcon />
              </button>
            </td>
            <td className="px-32  py-4">
              <button
                onClick={() => handleMenteeBlock(mentee?._id)}
                className={`${
                  mentee?.isBlocked
                    ? "text-green-800 hover:text-green-400"
                    : "text-red-800 hover:text-red-400"
                } font-extrabold`}
              >
                {mentee?.isBlocked ? (
                  <CircleCheckBigIcon color="green" />
                ) : (
                  <BanIcon color="red" />
                )}
              </button>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(menteeData.length / MENTEES_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={modalClose}
          children={
            <>
              <h2 className="text-xl text-center font-bold mb-4">
                {formData._id ? "Edit Mentee" : "Add Mentee"}
              </h2>

              <div className="space-y-4">
                <InputField
                  id={"name"}
                  placeholder={"Enter name"}
                  error={errors?.name}
                  className={""}
                  type="text"
                  name={"name"}
                  value={formData?.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <InputField
                  id={"email"}
                  placeholder={"Enter email"}
                  error={errors?.email}
                  className={""}
                  type="email"
                  name={"email"}
                  value={formData?.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <InputField
                  id={"phone"}
                  name={"phone"}
                  placeholder={"Enter phone"}
                  error={errors?.phone}
                  value={formData?.phone || ""}
                  className=""
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <p className="text-sm text-red-500">{errors?.bio}</p>
                <textarea
                  value={formData?.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself and your experience..."
                  rows={4}
                  className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none border-2"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={modalClose}
                  className="px-4 py-2 mr-4 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-[#ff8800] text-white rounded-md hover:bg-[#e67a00]"
                >
                  Save
                </button>
              </div>
            </>
          }
        />
      )}

      <ToastContainer />
    </div>
  );
};
export default Mentee_mgt;

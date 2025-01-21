import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BanIcon, CircleCheckBigIcon } from "lucide-react";
import { Table } from "../../components/Admin/Table";
import { Pagination } from "../../components/Common/common4All/Pagination";
import { StatusBadge } from "../../components/Admin/StatusBadge";
import profile from "../../Asset/rb_2877.png";
import ConfirmToast from "../../components/Common/common4All/ConfirmToast";

import Spinner from "../../components/Common/common4All/Spinner";
import { API } from "../../Config/adminAxios";
import { errorHandler } from "../../Utils/Reusable/Reusable";

const MENTEES_PER_PAGE = 8;

interface IMentee {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isBlocked?: boolean;
  verified?: boolean;
  profileUrl?: string;
}

export const Mentee_mgt: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);
  const [menteeData, setMenteeData] = useState<IMentee[]>([]);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setLoading(true);

        const response = await API.get(`/admin/mentee_management`);

        if (response.status == 200 && response.data.success) {
          setMenteeData(response.data?.Data);
        }
      } catch (error: unknown) {
       errorHandler(error)
      } finally {
        setLoading(false);
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
      setLoading(true)
      if (!id) toast.error("credential not found");

      const response = await API.patch(
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
        }, 500);
      }
    } catch (error: unknown) {
     errorHandler(error)
    }finally{
      setTimeout(() => {
        setLoading(false)
        
      },500);
    }
  };

  return (
    <div className="p-4 pb-4 mt-16">
      {loading && <Spinner />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentee Management</h1>
      </div>

      <hr className="mb-6" />

      <Table headers={["Profile", "Name", "Email", "Status", "Actions"]}>
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
            <td className="px-24  py-4 items-center text-center">
              <button
                onClick={() => handleMenteeBlock(mentee?._id as string)}
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


    </div>
  );
};
export default Mentee_mgt;

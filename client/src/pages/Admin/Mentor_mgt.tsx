import { useState, useEffect, useMemo } from 'react';
import { Table } from '../../components/Admin/Table';
import { useNavigate, useLocation } from 'react-router-dom';
import { StatusBadge } from '../../components/Admin/StatusBadge';
import { toast } from 'react-toastify';
import profile from "../../Asset/rb_2877.png";
import { BanIcon, CheckCircle2, CircleCheckBigIcon, Eye } from 'lucide-react';
import ConfirmToast from '../../components/Common/common4All/ConfirmToast';
import Spinner from '../../components/Common/common4All/Spinner';
import { API } from '../../Config/adminAxios';
import { errorHandler } from '../../Utils/Reusable/Reusable';
import { Pagination } from '@mui/material';


const MENTORS_PER_PAGE = 8;

export const Mentor_mgt: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTabFromPath = (path: string) => {
    if (path.includes("not-verified")) return 'not-verified';
    return 'verified';
  }
  
  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<IMentor[]|[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'verified' | 'not-verified'>(getActiveTabFromPath(location.pathname));
  
  const indexOfLastMentors = currentPage * MENTORS_PER_PAGE;
  const indexOfFirstMentors = indexOfLastMentors - MENTORS_PER_PAGE;
  const currentMentors = mentors.slice(
    indexOfFirstMentors,
    indexOfLastMentors
  );
  // Pagination change handler
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault()
    setCurrentPage(value);
  };

  // Fetch the mentor data (replace with actual API call)
  useEffect(() => {
    // Example of API call (replace with your actual API call)
    const fetchMentors = async () => {
      try {
        const response = await API.get(`/admin/mentor_management`);
        if(response?.status &&response.data.success){
          setMentors(response.data?.mentorData);

        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab == 'verified') {
      navigate('/admin/mentor_management/verified');
    } else {
      navigate('/admin/mentor_management/not_verified');
    }
  }, [activeTab, navigate])

  const handleVerify = async (id: string) => {
    try {
      toast.dismiss()
      setLoading(true)
      const response = await API.patch(`/admin/mentor_management/mentor_verify`, { id: id });
      if (response && response.data) {
        setTimeout(() => {
          toast.success(response.data.message);
        }, 1000);
        //here change the value opposite dinamically
        setMentors((pre) => pre.map(mentor => mentor?._id == id ? { ...mentor, verified: true } : mentor));

      } else {
        console.error('Invalid response format', response);
      }
    } catch (error: unknown) {
     errorHandler(error)
        toast.dismiss();


    } finally {
      setTimeout(() => {
        setLoading(false)
        
      }, 1000);
    }
  }
  const handleMentorBlock = (id: string, tab: string) => {
    if (tab == 'verified') {
      confirmModal(id)
    } else {
      handleMentorVerify(id)
    }
  }
  const handleMentorVerify = (id: string) => {

    toast(
      <ConfirmToast
        message="Verify Mentor"
        description="Are you sure you want to approve?"
        onReply={() => handleVerify(id as string)}
        onIgnore={() => toast.dismiss()}
        ariaLabel="mentor verification confirmation"
      />,
      {
        closeButton: false,
        className: "p-0  border border-purple-600/40 ml-0",
        autoClose: false,
      }
    );

  }

  const confirmModal = (id: string) => {
    toast(
      <ConfirmToast
        message="Change Mentor Status"
        description="Are you sure you want to change status?"
        onReply={() => handleStatus(id as string)}
        onIgnore={() => toast.dismiss()}
        ariaLabel="mentor status confirmation"
      />,
      {
        closeButton: false,
        className: "p-0  border border-purple-600/40 ml-0",
        autoClose: false,
      }
    );
  }
  const handleStatus = async (id: string) => {
    try {
      toast.dismiss()
      setLoading(true)
  
      const response = await API.patch(`/admin/mentor_management/change_mentor_status`, { id: id });
      if (response.status==200 && response.data.success) {
    

        setTimeout(() => {
          toast.success(response.data?.message);
        }, 1000);

        setMentors((prev) => prev.map(mentor => mentor?._id === id ? { ...mentor, isBlocked: !mentor?.isBlocked } : mentor));
      } else {
        console.error('Invalid response format', response);
      }
    } catch (error: unknown) {
      errorHandler(error)
        toast.dismiss();

    } finally {
      setTimeout(() => {
        setLoading(false)
        
      }, 500);
    }
  }
  // Filter mentors based on the active tab (verified or not-verified)
  const filteredMentors = useMemo(() => {
    return currentMentors.filter(
      (mentor) => mentor?.verified === (activeTab === 'verified')
    );
  }, [activeTab, currentMentors]);

  return (
    <div className="p-6 pb-24 mt-16">
      {loading && <Spinner/>}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentor Management</h1>

      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('verified')}
          aria-label="Show Verified Mentors"
          className={`px-4 py-2  ${activeTab === 'verified'
            ? 'text-[#ff8800] border-b-2 border-[#ff8800] font-semibold'
            : 'bg-gray-100 text-gray-400'
            }`}
        >
          Verified
        </button>
        <button
          onClick={() => setActiveTab('not-verified')}
          aria-label="Show Not Verified Mentors"
          className={`px-4 py-2  ${activeTab === 'not-verified'
            ? 'text-[#ff8800] border-b-2 border-[#ff8800] font-semibold'
            : 'bg-gray-100 text-gray-400'
            }`}
        >
          Not Verified
        </button>
      </div>

      <hr className="mb-6" />

      <Table headers={["Profile", 'Name', 'Email', `${activeTab == "verified" ? 'Status' : 'Details'}`, 'Verify',]}>
        {filteredMentors.map((mentor) => (
          <tr key={mentor?._id}>
            <td className=" py-4 flex justify-center">
              <img
                src={mentor?.profileUrl ? mentor?.profileUrl : profile}
                alt={mentor?.name}
                className="w-10 h-10 rounded-full  "
              />
            </td>
            <td className="px-6 py-4 text-sm text-center">{mentor?.name}</td>
            <td className="px-6 py-4 text-sm text-center">{mentor?.email}</td>

            {activeTab === 'not-verified' ? (
              <td className="px-6 py-4 text-center">
                <button className="px-3 py-1 bg-cyan-200 text-white rounded-full hover:bg-cyan-700 font-bold"
                  onClick={() => window.location.href = `${mentor?.resume}`}

                >
                  <Eye className='text-black h-10' />
                </button>
              </td>
            ) : (
              <td className="px-6 py-4 text-center">

                <StatusBadge status={mentor?.isBlocked ? "blocked" : 'active'} />
              </td>
            )}

            <>
              {activeTab === 'not-verified' ? (
                <>
                  <td className="px-6 py-4 text-center font-bold">
                    <button
                      onClick={() => handleMentorVerify(mentor?._id as string)}
                      className="px-3 py-1 bg-green-400 text-white rounded-full hover:bg-green-700"
                    >
                      <CheckCircle2 className='h-10 text-black' />
                    </button>
                  </td>

                </>
              ) : (
                <td className="px-6 py-4 text-center">

                  <button

                    className={` ${mentor.isBlocked
                      ? "text-green-800 hover:text-green-400"
                      : "text-red-800 hover:text-red-400"
                      } `}

                    onClick={() => handleMentorBlock(mentor?._id as string, activeTab)}
                  >
                    {mentor?.isBlocked ? (
                      <CircleCheckBigIcon color="green" />
                    ) : (
                      <BanIcon color="red" />
                    )}
                  </button>
                </td>
              )}

            </>

          </tr>
        ))}
      </Table>


      <div className="flex justify-center items-center mt-2">
           <Pagination
             count={(Math.ceil(mentors.length / MENTORS_PER_PAGE)) } // Total pages
             page={currentPage} // Current page
             onChange={handlePageChange} // Page change handler
             color="standard" // Pagination color
             shape="circular" // Rounded corners
             size="small" // Size of pagination
             siblingCount={1} // Number of sibling pages shown next to the current page
             boundaryCount={1} // Number of boundary pages to show at the start and end
           />
     
           </div>

    </div>
  );
};
export default Mentor_mgt
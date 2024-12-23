import { useState, useEffect } from 'react';
import { Table } from '../../components/Admin/Table'; 
import { Pagination } from '../../components/Common/Pagination';
import { StatusBadge } from '../../components/Common/StatusBadge'; 
// import { ConfirmationModal } from '../components/common/ConfirmationModal';

const MENTORS_PER_PAGE = 5;

export const Mentor_mgt = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'verified' | 'not-verified'>('verified');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [mentors, setMentors] = useState<any[]>([]); // Assuming mentor data is an array of objects

  // Fetch the mentor data (replace with actual API call)
  useEffect(() => {
    // Example of API call (replace with your actual API call)
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors'); // Replace with actual API endpoint
        const data = await response.json();
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  // Filter mentors based on the active tab (verified or not-verified)
  const filteredMentors = mentors.filter(
    (mentor) => mentor.verified === (activeTab === 'verified')
  );

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentor Management</h1>
        <button className="px-4 py-2 bg-[#ff8800] text-white rounded-md hover:bg-[#e67a00]">
          Add Mentor
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'verified'
              ? 'bg-[#ff8800] text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Verified
        </button>
        <button
          onClick={() => setActiveTab('not-verified')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'not-verified'
              ? 'bg-[#ff8800] text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Not Verified
        </button>
      </div>

      <hr className="mb-6" />

      <Table headers={['Name', 'Email', 'Status', 'Actions']}>
        {filteredMentors.map((mentor) => (
          <tr key={mentor.id}>
            <td className="px-6 py-4">{mentor.name}</td>
            <td className="px-6 py-4">{mentor.email}</td>
            <td className="px-6 py-4">
              <StatusBadge status={mentor.status} />
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                {activeTab === 'not-verified' ? (
                  <button
                    onClick={() => {
                      setSelectedMentorId(mentor.id);
                      setIsVerifyModalOpen(true);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Not Verified
                  </button>
                ) : (
                  <>
                    <button className="px-3 py-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Verified
                    </button>
                  </>
                )}
                <button className="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredMentors.length / MENTORS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />

      {/* <ConfirmationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onConfirm={() => {
          console.log('Verify mentor:', selectedMentorId);
          setIsVerifyModalOpen(false);
        }}
        title="Verify Mentor"
        message="Would you like to verify or block this mentor?"
        confirmText="Verify"
        cancelText="Block"
      /> */}
    </div>
  );
};
export default Mentor_mgt
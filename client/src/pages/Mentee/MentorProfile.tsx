import { ProfileHeader } from "../../components/Common/exploreMentor/ProfileHeader";
import { Skills } from "../../components/Common/exploreMentor/Skills";

import { BookOption } from "../../components/Common/exploreMentor/BookOption";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../../components/Common/common4All/Spinner";
import { ReviewSection } from "../../components/Mentee/ReviewSection";
import { fetchSimilarMentors } from "../../service/menteeApi";
import { HttpStatusCode } from "axios";
import MentorListByCategory from "../../components/Common/exploreMentor/MentorListByCategory";

const MentorProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [mentorData, setMentorData] = useState<IMentor | null>(state);

  const [similarMentor, setSimilarMentor] = useState<IMentor[] | []>([]);

  const [loading, setLoading] = useState(true);

  if (!state) {
    navigate(-1);
  }
  useEffect(() => {
    const fetchMentorData = async () => {
      setLoading(true);

      const response = await fetchSimilarMentors(
        mentorData?.category as string,
        mentorData?._id as string
      );

      if (response.status === HttpStatusCode?.Ok && response.data.success) {
        setSimilarMentor(response.data.mentor);
      }

      setLoading(false);
    };

    fetchMentorData();
    setMentorData(state);
  }, [mentorData?._id, mentorData?.category, navigate, state]);

  const handleBooking = useCallback(() => {
    navigate(
      `/mentee/${decodeURIComponent(mentorData?.name as string)}/slot-booking`,
      { state: { mentorId: mentorData?._id } }
    );
  }, [mentorData?._id, mentorData?.name, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {loading && <Spinner />}

      <ProfileHeader mentorData={mentorData} />

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-white/90 mb-1  font-light">
              {mentorData?.email}
            </p>
            <Skills skills={mentorData?.skills as string[]} />

            <div>
              <h2 className="text-xl font-bold mt-16 mb-4">About</h2>
              <div className="prose max-w-none">
                <p>{mentorData?.bio}</p>
              </div>
            </div>
            {mentorData?.reviews && (
              <ReviewSection mentorData={mentorData as IMentor} />
            )}
          </div>

          <div className="space-y-6">
            <BookOption
              mentorName={mentorData?.name as string}
              onBook={handleBooking}
            />
          </div>
        </div>
        {similarMentor?.length > 0 ? (
          <div className="mt-8">
            <MentorListByCategory
              title="Similar Mentors"
              mentors={similarMentor}
            />
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};
export default MentorProfile;

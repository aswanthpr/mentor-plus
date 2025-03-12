// import { Breadcrumb } from '../../components/Common/exploreMentor/BreadCrumb';
import { ProfileHeader } from "../../components/Common/exploreMentor/ProfileHeader";
import { Skills } from "../../components/Common/exploreMentor/Skills";

import { BookOption } from "../../components/Common/exploreMentor/BookOption";
import MentorListByCategory from "../../components/Common/exploreMentor/MentorListByCategory";
// import Button from "../../components/Auth/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { protectedAPI } from "../../Config/Axios";
import Spinner from "../../components/Common/common4All/Spinner";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { ReviewSection } from "../../components/Mentee/ReviewSection";

 const MentorProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [mentorData] = useState<IMentor | null>(state);
  const [similarMentor, setSimilarMentor] = useState<IMentor[] | []>([]);

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('')

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);

        const response = await protectedAPI.get(
          `/mentee/explore/similar-mentors`,
          {
            params: {
              category: mentorData?.category,
              mentorId: mentorData?._id,
            },
          }
        );
        if (response.status === 200 && response.data.success) {
          setSimilarMentor(response.data.mentor);
        }
      } catch (err) {
        errorHandler(err);
      } finally {
        setLoading(false);
      }
    };

    // if () {
    fetchMentorData();
    // }
  }, [mentorData?._id, mentorData?.category]);

  const handleBooking = () => {
    navigate(`/mentee/${decodeURIComponent(mentorData?.name as string)}/slot-booking`,{state:{mentorId:mentorData?._id}});
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {loading && <Spinner />}
      {/* <div className="container mx-auto px-4 py-6">
        <Breadcrumb path={breadcrumbPath} />
      </div> */}

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
            {
            // mentorData?.review&& mentorData?.review?.length>0 &&
            <ReviewSection  mentorData={mentorData as IMentor} />
            }
          </div>

          <div className="space-y-6">
            <BookOption
              mentorName={mentorData?.name as string}
              onBook={handleBooking}
            />

            {/* <Button variant="secondary" className="w-full">
              View one-off sessions
            </Button> */}
          </div>
        </div>
        {similarMentor.length > 0 ? (
          <div className="mt-8">
            <MentorListByCategory
              title="Similar Mentors"
              mentors={similarMentor}
              onSeeAll={() => console.log("Navigate to see all mentors")}
            />
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};
export default MentorProfile
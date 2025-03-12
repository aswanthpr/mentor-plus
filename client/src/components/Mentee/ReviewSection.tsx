import { Star } from 'lucide-react';
import moment from 'moment';

interface ReviewSectionProps {
  mentorData:IMentor;
}

export const ReviewSection = ({ mentorData }: ReviewSectionProps) => {

  const ReviewCard = ({review}:{review:Ireview}) => (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <img
          src={review?.mentee?.profileUrl}
          alt={review?.mentee?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{review?.mentee?.name}</h3>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < review?.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{moment(review?.createdAt).format("DD-MM-YYYY")}</p>
          <p className="text-gray-700 mb-4">{review?.feedback}</p>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-4 z-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold">{mentorData?.averageRating?.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">({mentorData?.reviews?.length} reviews)</span>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
        {mentorData?.reviews?.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};
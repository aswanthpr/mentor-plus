// SkeletonMentorCard.tsx
const SkeletonMentorCard = () => (
  <div className="bg-white rounded-lg shadow p-4 animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-10 bg-gray-300 rounded w-full mt-2" />
  </div>
);

export default SkeletonMentorCard;

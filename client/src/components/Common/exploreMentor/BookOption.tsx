import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import Button from "../../Auth/Button";

const features = [
  "Resume review",
  "Mock interview",
  "Document reviews",
  "Carrier Guidance",
  "Interview prep & tips",
  "Doubt clearing session",
  "Talk about your carrier,goal",
  "LinkedIn profile optimization",
];

interface MentorshipPlansProps {
  mentorName: string;
  onBook: () => void;
}

export const BookOption = ({ mentorName, onBook }: MentorshipPlansProps) => {
  const [mentor] = useState<string>(mentorName);

  // const currentPlan = selectedPlan === 'lite' ? litePlan : standardPlan;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-6">
        {/* <button
          onClick={() => setSelectedPlan('lite')}
          className={`flex-1 py-2 text-center rounded-md transition-colors ${
            selectedPlan === 'lite'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Lite Plan
        </button> */}
        <span
          // onClick={() => setSelectedPlan('standard')}
          className={`flex-1 py-2 text-center rounded-md transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold
          `}
        >
          Book a session with {mentor}
        </span>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {/* ${currentPlan.price} */}
            {/* <span className="text-lg text-gray-500">/month</span> */}
          </div>
          {/* <p className="text-gray-500 mt-1">7-day free trial • Cancel anytime</p> */}
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check
                size={20}
                className="text-green-500 mt-0.5 flex-shrink-0"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {/* 
        {currentPlan.spotsLeft <= 3 && (
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <AlertCircle size={16} />
            <span>Only {currentPlan.spotsLeft} spots left!</span>
          </div>
        )} */}

        <Button
          variant="orange"
          className="w-full font-bold"
          onClick={onBook}
        >
          Book now
        </Button>
      </div>
    </div>
  );
};

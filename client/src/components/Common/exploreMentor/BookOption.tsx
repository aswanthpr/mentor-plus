import { useState } from "react";
import { Check } from "lucide-react";
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

export const BookOption = ({ mentorName, onBook }: MentorshipPlansProps) => {
  const [mentor] = useState<string>(mentorName);

  // const currentPlan = selectedPlan === 'lite' ? litePlan : standardPlan;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-6">
        <span
          className={`flex-1 py-2 text-center rounded-md transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold
          `}
        >
          Book a session with {mentor}
        </span>
      </div>

      <div className="space-y-6">
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

        <Button variant="orange" className="w-full font-bold" onClick={onBook}>
          Book now
        </Button>
      </div>
    </div>
  );
};

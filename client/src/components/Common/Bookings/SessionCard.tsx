import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import Modal from "../common4All/Modal";
import { SelectChangeEvent, TextareaAutosize } from "@mui/material";
import { toast } from "react-toastify";
import SelectField from "../Schedule/SelectField";
import moment from "moment";


interface SessionCardProps {
  session: ISession;
  role: string;
  handleReclaimRequest?:(sessionId:string,value:string)=>void;
  handleCancelSession?: (
    sessionId: string,
    reason: string,
    customReason: string,
   
  ) => void;
  handleJoinClick:(
    id:string,
    description:string,
    duration:string,
  )=>void
  handleRating: (sessionId: string) => void;
}
const issues = [
  "health Issues",
  "personal Issue",
  "technical Issues",
  "family Obligation",
  "no Longer Interested",
  "found Another Mentor",
  "financial Constraints",
  "dissatisfaction with Platform or Service",
  "other",
];

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  handleCancelSession,
  handleReclaimRequest,
  role,
  
}) => {
  const [modalToggle, setModalToggle] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [mentorStatusChange,setMentorStatusChange] = useState<string>("")
  const formatTime = moment(session.slotDetails?.slots![0]?.startTime)

const startTime = moment(formatTime).format('hh:mm A');

  const handleModalClose = () => {
    setModalToggle(false);
    setReason("");
    setCustomReason("");
  };

  const handleReasonChange = (e: SelectChangeEvent<string>) => {
    setReason(e.target.value);
    if (e.target.value === "other") {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
      setCustomReason("");
    }
  };
 
  useEffect(() => {}, [session]);

  const handleSubmit = () => {
    console.log("Reason:", reason);
    console.log("Custom Reason:", customReason);

    if (reason == "") {
      toast.error("select a reason");
      return;
    } else if (
      reason === "other" &&
      customReason == "" &&
      customReason?.length <= 25
    ) {
      toast.error(
        "reason cannot be empty and required more than 25 characters"
      );
      return;
    }
    if(handleCancelSession){

      handleCancelSession(session?._id, reason, customReason);
    }
    handleModalClose();
  };
 
const handleSessionJoin = () => {
  
}
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img
            src={session?.user?.profileUrl}
            alt={session.user?.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900">{session?.user?.name}</h3>
            <p className="text-sm text-gray-500">{session?.description}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            session.status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : session.status === "CANCELLED"
              ? "bg-red-100 text-red-800"
              : session.status === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : session.status === "RESCHEDULED"
              ? "bg-blue-100 text-blue-800"
              : session.status === "CANCEL_REQUESTED"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {session.status.charAt(0).toUpperCase() + session?.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {session?.slotDetails?.startDate.split('T')[0]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {startTime} ({session?.duration} min)
          </span>
        </div>
        <div className="flex justify-end">
          {role == "mentee" && session.status === "CONFIRMED" && (
            <div className="flex gap-2">
              {session?.status=="CONFIRMED"&&(

              <button
                onClick={() => setModalToggle(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Cancel
              </button>
              )}
              <button 
              onClick={handleSessionJoin}
              className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium">
                Join
              </button>
            </div>
          )}
          {role == "mentor" && session?.status === "CANCEL_REQUESTED" && (
            <div className="flex gap-1  items-end">

              <SelectField 
              label="Cancel Request"
              onChange={(e:SelectChangeEvent<string>)=>{
                setMentorStatusChange(e.target?.value);
                if (handleReclaimRequest) {
                  handleReclaimRequest(session?._id, e.target?.value);
                }
              }}
              options={["APPROVE","REJECTED"]}
              placeholder="choose one"
              value={mentorStatusChange}
              classNames="border border-none rounded-md focus:ring-2 focus:ring-orange-200 border-gray-500 focus:outline-none focus:border-gray-400 lg:w-40 xss:w-20 h-12"

              />
            </div>
          )}
          {/* {session.status === 'completed' && !session?.rating && (
          <button
            onClick={() => handleRating(session?._id)}
            className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium"
          >
            Rate Session
          </button>
        )} */}
          {/* {session.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{session.rating}/5</span>
          </div>
        )} */}
        </div>
      </div>

      {/* {session.review && (
      <div className="mt-4 text-sm text-gray-600 border-t pt-4">
        <p className="italic">"{session.review}"</p>
      </div>
    )} */}
      <Modal
        isOpen={modalToggle}
        onClose={handleModalClose}
        children={
          <>
            <div className="flex flex-col items-center space-y-4">
              {/* <div className="text-center text-red-400 font-medium">
                <p>
                  Warning: If you cancel the confirmed slot, a 20% refund will
                  be deducted.
                </p>
              </div> */}

              <div className="w-full px-6 py-4">
                <SelectField
                  label="Cancellation reason"
                  onChange={handleReasonChange}
                  options={issues}
                  placeholder="Choose a reason"
                  value={reason}
                  classNames="border border-none rounded-md focus:ring-2 focus:ring-orange-200 border-gray-500 focus:outline-none focus:border-gray-400"
                />

                {isOtherSelected && (
                  <div className="mt-4">
                    <TextareaAutosize
                      id="custom-reason"
                      value={customReason}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCustomReason(e.target.value)
                      }
                      className="w-full p-2 border  border-gray-400 rounded mt-2 focus:outline-none focus:border-gray-300"
                      placeholder="Write your reason here..."
                      minRows={2} // Adjust the minimum height by setting the minimum number of rows
                      maxRows={6} //adjusting hte maximum height by setting the no of rows
                    />
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleSubmit}
                    className="w-full px-6 py-2 bg-[#ff8800] text-white rounded hover:bg-[#e57c00]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default SessionCard;

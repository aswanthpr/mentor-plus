import React, { useState } from "react";
import { Calendar, Clock, Star } from "lucide-react";
import Modal from "../common4All/Modal";
import { SelectChangeEvent, TextareaAutosize, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SelectField from "../Schedule/SelectField";
import moment from "moment";
import Button from "../../Auth/Button";
import { issues } from "../../../Constants/const Values";
import { SESSION_STATUS } from "../../../Constants/message";
import profileImg from "../../../Asset/user.png";
const SessionCard: React.FC<ISessionCardProps> = ({
  session,
  handleCreateSessionCode,
  handleCancelSession,
  handleReclaimRequest,
  role,
  handleCompletedSession,
  handleSessionJoin,
  handleRating,
}) => {
  const [modalToggle, setModalToggle] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [mentorStatusChange, setMentorStatusChange] = useState<string>("");
  const [desptnOpn, setDesptnOpn] = useState<boolean>(false);

  const formatTime = moment(session?.slotDetails?.slots![0]?.startTime);

  const startTime = moment(formatTime).format("hh:mm A");
  const startDate = moment(session?.slotDetails?.slots?.[0]?.startTime).format(
    "DD-MM-YYYY"
  );

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

  const handleSubmit = () => {
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
    if (handleCancelSession) {
      handleCancelSession(session?._id, reason, customReason);
    }
    handleModalClose();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mt-2">
      <div className="flex items-start justify-between">
        {/* image */}
        <div className="flex items-center gap-4">
          <img
            src={session?.user?.profileUrl ?? profileImg}
            alt={session?.user?.name}
            className="w-12 h-12 rounded-full"
          />
          {/* description */}
          <div>
            <h3 className="font-medium text-gray-900">{session?.user?.name}</h3>
            <span
              onClick={() => setDesptnOpn(true)}
              className="text-sm text-gray-500 cursor-pointer hover:underline"
            >
              {session?.description.length > 20
                ? session.description.slice(0, 20) + "....."
                : session?.description}
            </span>
          </div>
        </div>
        {/* mark session complete */}
        <div className="flex space-x-3 flex-row">
          {role == "mentor" &&
            session?.sessionCode &&
            session?.status !== SESSION_STATUS?.COMPLETED && (
              <Tooltip title="Mark session as completed">
                <span>
                  <button
                    onClick={() => handleCompletedSession!(session?._id)}
                    className="bg-[#afaba6] text-white text-sm font-normal rounded-full p-2 "
                  >
                    mark as completed
                  </button>
                </span>
              </Tooltip>
            )}
          {/* sessionCode generate */}
          {role === "mentor" &&
            (session?.status === SESSION_STATUS?.CONFIRMED ||
              session?.status === SESSION_STATUS?.REJECTED) &&
            moment().diff(moment(session?.slotDetails?.startDate), "minutes") <=
              1440 &&
            !session?.sessionCode && (
              <Button
                onClick={() => handleCreateSessionCode!(session?._id)}
                children={"session code"}
                className="bg-[#afaba6] text-white text-sm font-normal rounded-full p-1"
                variant="secondary"
              />
            )}

          <span
            className={`px-3 py-1 pt-2 rounded-full text-sm font-medium  items-center ${
              session.status === SESSION_STATUS?.CONFIRMED
                ? "bg-green-100 text-green-800"
                : session.status === SESSION_STATUS?.CANCELLED
                ? "bg-red-100 text-red-800"
                : session.status === SESSION_STATUS?.COMPLETED
                ? "bg-green-100 text-green-800"
                : session.status === SESSION_STATUS?.RESCHEDULED
                ? "bg-blue-100 text-blue-800"
                : session.status === SESSION_STATUS?.CANCEL_REQUESTED
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {session.status.charAt(0).toUpperCase() + session?.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{startDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {startTime} ({session?.duration} min)
          </span>
        </div>
        <div className="flex justify-end">
          {(session?.status === "CONFIRMED" ||
            session?.status === "REJECTED") && (
            <div className="flex gap-2">
              {session?.status === "CONFIRMED" &&
                role == "mentee" &&
                !session?.sessionCode && (
                  <Tooltip title="Cancel session">
                    <button
                      onClick={() => setModalToggle(true)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </Tooltip>
                )}
              {session?.sessionCode && (
                <Tooltip title="Join session">
                  <button
                    onClick={() =>
                      handleSessionJoin!(
                        session?._id,
                        session?.sessionCode as string,
                        role as string
                      )
                    }
                    className="text-[#ff8800] hover:text-[#ff9900] text-lg font-medium"
                  >
                    Join
                  </button>
                </Tooltip>
              )}
            </div>
          )}
          {role == "mentor" && session?.status === "CANCEL_REQUESTED" && (
            <div className="flex gap-1  items-end">
              <SelectField
                label="Cancel Request"
                onChange={(e: SelectChangeEvent<string>) => {
                  setMentorStatusChange(e.target?.value);
                  if (handleReclaimRequest) {
                    handleReclaimRequest(session?._id, e.target?.value);
                  }
                }}
                options={["APPROVE", "REJECTED"]}
                placeholder="choose one"
                value={mentorStatusChange}
                classNames="border border-none rounded-md focus:ring-2 focus:ring-orange-200 border-gray-500 focus:outline-none focus:border-gray-400 lg:w-40 xss:w-20 h-12"
              />
            </div>
          )}
          {session.status === "COMPLETED" &&
          !session?.review?.rating &&
          role === "mentee" ? (
            <button
              onClick={() => handleRating!(session as ISession)}
              className="text-[#ff8800] hover:text-[#ff9900] text-sm font-medium"
            >
              Rate session
            </button>
          ) : (
            session?.review?.rating && (
              <div className="mt-4 text-sm text-gray-600 border-t pt-4 flex items-center gap-1">
                {Array.from({ length: session?.review?.rating }).map(
                  (_, index) => (
                    <Star key={index} className="fill-amber-400 w-4" />
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>

      {session?.review && role === "mentee" && (
        <div className="mt-4 text-sm text-gray-600 border-t pt-4">
          <p className="italic">"{session?.review?.feedback}"</p>
        </div>
      )}
      <Modal
        isOpen={modalToggle}
        onClose={handleModalClose}
        children={
          <>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full px-6 py-4">
                <SelectField
                  label="Cancellation reason"
                  onChange={handleReasonChange}
                  options={issues as string[]}
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
                      minRows={2}
                      maxRows={6}
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
      {desptnOpn && (
        <Modal
          isOpen={desptnOpn}
          onClose={() => setDesptnOpn(false)}
          children={session?.description}
        />
      )}
    </div>
  );
};

export default SessionCard;

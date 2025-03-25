import * as Yup from "yup";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Clock10Icon, PlayCircle, Wallet } from "lucide-react";
import Button from "../Auth/Button";
import stripeLogo from "../../Asset/stripe-icon.svg";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { bookingInputValidation } from "../../Validation/yupValidation";
import { toast } from "react-toastify";
import {
  confirmSlotBooking,
  fetchSlotBookingPageData,
} from "../../service/menteeApi";
import { initialState } from "../../Constants/initialStates";
import { routesObj } from "../../Constants/message";

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const [message, setMessage] = useState("");
  const [mentorId] = useState<string>(state);
  const [timeSlot, setTimeSlot] = useState<Itime[] | []>([]);
  const [errors, setErrors] = useState<IBookingError>(initialState);
  const [selectedSlot, setSelectedSlot] = useState<Itime | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Tpayment>("stripe");
  const [timeDifference, setTimeDifference] = useState<number | null>(null);

  const [mentorName] = useState<string>(pathname.split("/")[2]);
  const [sessionPrice, setSessionPrice] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSlotBookingPageData(mentorId);

        if (response?.status == 200 && response?.data?.success) {
          setTimeSlot(response.data?.timeSlots);
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    };
    fetchData();
  }, [mentorId]);

  const handleBook = useCallback(async () => {
    try {
      if (!selectedSlot) {
        toast.error("Please select a time slot");
        return;
      }
      await bookingInputValidation.validate({ message });
      setErrors(initialState);
      console.log(
        selectedSlot,
        message,
        selectedPayment,
        sessionPrice,
        timeDifference
      );

      const response = await confirmSlotBooking(
        selectedSlot,
        message,
        selectedPayment,
        sessionPrice,
        mentorName
      );

      if (response?.status == 200 && response?.data.success) {
        if (selectedPayment == "stripe") {
          if (response?.data.session?.url) {
            window.location.href = response?.data.session?.url;
          }
        } else if (selectedPayment == "wallet") {
          toast.success(response?.data?.message);
          navigate(routesObj?.MENTEE_BOOKING);
        }
      }

      setMessage("");
      setErrors(initialState);
      setTimeDifference(null);
    } catch (error: unknown) {
      // Handle Yup validation error
      if (error instanceof Yup.ValidationError) {
        setErrors((pre) => ({ ...pre, message: error?.message }));
      } else {
        errorHandler(error);
      }
    }
  }, [
    mentorName,
    message,
    navigate,
    selectedPayment,
    selectedSlot,
    sessionPrice,
    timeDifference,
  ]);

  // Function to handle time slot selection and check for future time
  const handleSlotClick = useCallback((slot: Itime) => {
    setSelectedSlot(slot);
    setSessionPrice(Number(slot?.price));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book a Session</h1>

        {/* Time Slots */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>
          <div className="relative">
            {timeSlot.length > 0 ? (
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {timeSlot.map((slot) => (
                  <button
                    key={slot?._id}
                    onClick={() => handleSlotClick(slot)}
                    className={`flex-shrink-0 p-4 rounded-lg border-2 transition-colors ${
                      selectedSlot?._id === slot?._id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <p className="text-gray-600 text-sm flex">
                      <Calendar className="w-3 mr-1" />
                      {moment(slot?.startDate).format("DD-MM-YYYY")}
                    </p>
                    <p className="text-gray-600 font-light text-sm flex">
                      <PlayCircle className="w-3 mr-1" />{" "}
                      {moment(slot?.startTime).format("hh:mm a")}
                    </p>
                    <p className="text-gray-600 text-sm flex">
                      <Clock10Icon className="w-3 mr-1" /> {slot?.duration} min
                    </p>
                    <p className="text-gray-600 text-sm">${slot?.price}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 p-6">
                <Calendar className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm">No slots available</p>
              </div>
            )}
          </div>
        </div>
        {/* Message */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Tell us about your goals
          </h2>
          <textarea
            value={message}
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What would you like to discuss in this session? What are your expectations?"
            className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
          {errors?.message && (
            <p className="text-red-500 text-sm">{errors?.message}</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Session Price</span>
              <span>${sessionPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">session</span>
              <span>x 1</span>
            </div>
            <div className="flex justify-between pt-3 border-t font-semibold">
              <span>Total</span>
              <span>${sessionPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "stripe"}
                onChange={() => setSelectedPayment("stripe")}
                className="mr-3"
              />
              <img src={stripeLogo} alt="" className="w-6" />
              <span>Stripe</span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "wallet"}
                onChange={() => setSelectedPayment("wallet")}
                className="mr-3"
              />
              <Wallet className="w-6 h-6 mr-2" />
              <span>Wallet</span>
            </label>
          </div>
        </div>
        <Button
          onClick={handleBook}
          className="w-full font-bold py-4 "
          variant="orange"
        >
          Book Session
        </Button>
      </div>
    </div>
  );
};
export default BookingPage;

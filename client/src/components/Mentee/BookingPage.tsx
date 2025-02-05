import * as Yup from "yup";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Clock10Icon, PlayCircle, Wallet } from "lucide-react";
import Button from "../Auth/Button";
// import papalIcon from "../../Asset/icons8-paypal.svg";
import stripeLogo from "../../Asset/stripe-icon.svg";
import { protectedAPI } from "../../Config/Axios";
import { errorHandler } from "../../Utils/Reusable/Reusable";
import { bookingInputValidation } from "../../Validation/yupValidation";


interface IBookingError {
  message: string;
  wallet: string;
  paypal: string;
  stripe: string;
}
const initialState: IBookingError = {
  message: "",
  wallet: "",
  paypal: "",
  stripe: "",
};

export const BookingPage: React.FC = () => {
  const { state,pathname } = useLocation();

  const [selectedSlot, setSelectedSlot] = useState<Itime | null>(null);
  const [message, setMessage] = useState("");
  const [mentorId] = useState<string>(state);
  const [selectedPayment, setSelectedPayment] = useState<
    "stripe" | "wallet" | "paypal" | "upi"
  >("stripe");
  const [timeSlot, setTimeSlot] = useState<Itime[] | []>([]);
  const [errors, setErrors] = useState<IBookingError>(initialState);
  const [timeDifference, setTimeDifference] = useState<number | null>(null);
  const [platformFee, setPlatformFee] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mentorName]  =useState<string>(pathname.split("/")[2])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await protectedAPI.get(`/mentee/slot-booking`, {
          params: mentorId,
        });
        if (response.status == 200 && response.data?.success) {
          console.log(response.data.timeSlots, "this si rep;osne");
          setTimeSlot(response.data?.timeSlots);
          setPlatformFee(response.data?.platformFee);
        }
      } catch (error: unknown) {
        errorHandler(error);
      }
    };
    fetchData();
  }, [mentorId]);

  const sessionPrice = 100;
  const platformFees = sessionPrice * Number(platformFee);
  const totalPrice = sessionPrice + platformFees;

  const handleBook = async () => {
    setErrorMessage(null);

    try {
      if (!selectedSlot) {
        setErrorMessage("Please select a time slot");
        return;
      }
      await bookingInputValidation.validate({ message });
      setErrors(initialState);
console.log( selectedSlot,
  message,
  selectedPayment,
  totalPrice,
  timeDifference,)
      const { data, status } = await protectedAPI.post(`/mentee/slot-booking`,{
        timeSlot: selectedSlot,
        message,
        paymentMethod: selectedPayment,
        totalAmount: totalPrice,
        duration: timeDifference,
        mentorName
      });
      console.log(status,data,'this is response')
      if (status == 200 && data.success) {
        console.log(data.session,'this si seesion',data.session.url)
        if(data.session?.url){
          window.location.href = data.session?.url
        }
      }

      setMessage("");
      setErrors(initialState);
      setTimeDifference(null);
      setErrorMessage(null);
    } catch (error: unknown) {
      // Handle Yup validation error
      if (error instanceof Yup.ValidationError) {
        setErrors((pre) => ({ ...pre, message: error?.message }));
      } else {
          setErrorMessage("An unexpected error occurred.");
        }
      
    }
  };

  // Function to handle time slot selection and check for future time
  const handleSlotClick = (slot: Itime) => {
    // const currentTime = moment();
    const slotStartTime = moment(slot.startStr, ["HH.mm"]);
    const timeDifference = moment(`${slot?.endStr}`, ["HH.mm"]).diff(
      slotStartTime,
      "minutes"
    );
    setTimeDifference(timeDifference);
    // Check if the selected slot time is in the future
    // if (slotStartTime.isAfter(currentTime)) {
    setSelectedSlot(slot);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book a Session</h1>

        {/* Time Slots */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>
          <div className="relative">
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
                  <p className="font-light text-sm flex">
                    <PlayCircle className="w-3 mr-1" />{" "}
                    {moment(`${slot?.startStr} `, ["HH.mm"]).format("hh:mm a")}
                  </p>
                  <p className="text-gray-600 text-sm flex">
                    <Clock10Icon className="w-3 mr-1" />{" "}
                    {moment(`${slot?.endStr}`, ["HH.mm"]).diff(
                      moment(`${slot?.startStr}`, ["HH.mm"]),
                      "minutes"
                    )}
                    min
                  </p>
                  <p className="text-gray-600 text-sm flex">
                    <Calendar className="w-3 mr-1" />
                    {slot?.startDate.split("T")[0]}
                  </p>
                  <p className="text-gray-600 text-sm">${slot?.price}</p>
                </button>
              ))}
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
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
              <span className="text-gray-600">Platform Fee</span>
              <span>${platformFees}</span>
            </div>
            <div className="flex justify-between pt-3 border-t font-semibold">
              <span>Total</span>
              <span>${totalPrice}</span>
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

            {/* <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "wallet"}
                onChange={() => setSelectedPayment("wallet")}
                className="mr-3"
              />
              <Wallet className="w-6 h-6 mr-2" />
              <span>Wallet</span>
            </label> */}

            {/* <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "paypal"}
                onChange={() => setSelectedPayment("paypal")}
                className="mr-3"
              />
              <img src={papalIcon} alt="" className="w-6" />
              <span>PayPal</span>
            </label> */}

            {/* <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "upi"}
                onChange={() => setSelectedPayment("upi")}
                className="mr-3"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/200px-UPI-Logo-vector.svg.png"
                alt="UPI"
                className="w-6 h-6 mr-2"
              />
              <span>UPI</span>
            </label> */}
          </div>
        </div>

        {/* {clientSecret ? (
          <div className={"stripeElem"}>
            <Elements stripe={stripePromise} options={{ clientSecret,loader }}>
           <StripeCheckout/>

            </Elements>
          </div>
        ) : ( */}
          <Button
            onClick={handleBook}
            className="w-full font-bold py-4 "
            variant="orange"
          >
            Book Session
          </Button>
        {/* // )} */}


      </div>
    </div>
  );
};

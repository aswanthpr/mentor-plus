import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CreditCard, DollarSign, Wallet } from 'lucide-react';
import Button from '../Auth/Button';
import { protectedAPI } from '../../Config/Axios';
import { useLocation } from 'react-router-dom';
import { errorHandler } from '../../Utils/Reusable/Reusable';
import moment from 'moment';

// interface TimeSlot {
//   id: string;
//   time: string;
//   date: string;
// }

const PLATFORM_FEE_PERCENTAGE = 0.05;

export const BookingPage:React.FC = () => {
  const {state}= useLocation()

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [mentorId] = useState<string>(state);
  const [selectedPayment, setSelectedPayment] = useState<'stripe' | 'wallet' | 'paypal' | 'upi'>('stripe');
  const [timeSlot,setTimeSlot]=useState<Itime[]|[]>([])


  useEffect(()=>{

    const fetchData =async ()=>{
      try {
        const response = await protectedAPI.get(`/mentee/slot-booking/slot`,{params:mentorId});
        if(response.status == 200 && response.data?.success){
          console.log(response.data.timeSlots,'this si rep;osne')
          setTimeSlot(response.data?.timeSlots)
        }
        
      } catch (error:unknown) {
        errorHandler(error)
      }
    }
    fetchData()
  },[])


  const sessionPrice = 100;
  const platformFee = sessionPrice * PLATFORM_FEE_PERCENTAGE;
  const totalPrice = sessionPrice + platformFee;

  const handleBook = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    console.log({
      timeSlot: selectedSlot,
      message,
      paymentMethod: selectedPayment,
      totalAmount: totalPrice
    });
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
                  onClick={() => setSelectedSlot(slot?._id as string)}
                  className={`flex-shrink-0 p-4 rounded-lg border-2 transition-colors ${
                    selectedSlot === slot?._id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                  >
                  <p className="font-light text-lg">{moment(`${slot?.startStr}`, ["HH.mm"]).format("hh:mm a")} - {moment(`${slot?.endStr}`, ["HH.mm"]).format("hh:mm a")}</p>
                  <p className="text-gray-600">{slot?.startDate.split("T")[0]}</p>
                  <p className="text-gray-600 font-bold">${slot?.price}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tell us about your goals</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What would you like to discuss in this session? What are your expectations?"
            className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
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
              <span>${platformFee}</span>
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
                checked={selectedPayment === 'stripe'}
                onChange={() => setSelectedPayment('stripe')}
                className="mr-3"
              />
              <CreditCard className="w-6 h-6 mr-2" />
              <span>Credit/Debit Card</span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'wallet'}
                onChange={() => setSelectedPayment('wallet')}
                className="mr-3"
              />
              <Wallet className="w-6 h-6 mr-2" />
              <span>Wallet</span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'paypal'}
                onChange={() => setSelectedPayment('paypal')}
                className="mr-3"
              />
              <DollarSign className="w-6 h-6 mr-2" />
              <span>PayPal</span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === 'upi'}
                onChange={() => setSelectedPayment('upi')}
                className="mr-3"
              />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/200px-UPI-Logo-vector.svg.png" 
                   alt="UPI" 
                   className="w-6 h-6 mr-2" />
              <span>UPI</span>
            </label>
          </div>
        </div>

        <Button
          variant="orange"
          className="w-full font-bold py-4"
          onClick={handleBook}
        >
          Book Session
        </Button>
      </div>
    </div>
  );
};
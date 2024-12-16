import React ,{useState,useEffect} from 'react';
import InputField from '../Common/Form/InputField';

interface IModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onVerify:(otp:string)=>void;
}

const OtpModal:React.FC<IModalProps> = (props) => {
    const [otp,setOtp] =useState<string>('');
    const [error,setError]=useState<string|undefined>('');
    const [timer,setTimer] = useState<number>(60);
    const [canResend,setCanResend]=useState<boolean>(false);
    useEffect(()=>{
        let interval:any;
        if(props.isOpen && timer>0){
            interval = setInterval(()=>{
                setTimer((prev)=>prev-1);
            },1000)

        }else if(timer===0){
            setCanResend(true)
        }
        return ()=>{
            clearInterval(interval)
        }

    },[props.isOpen,timer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) {
          setError('OTP is required');
          return;
        }
        if (otp.length !== 6) {
          setError('OTP must be 6 digits');
          return;
        }
        if (!/^\d+$/.test(otp)) {
          setError('OTP must contain only numbers');
          return;
        }
        setError(undefined!);
        props.onVerify(otp);
      };
      const handleResendOtp = () => {
        setTimer(60);
        setCanResend(false);
        // Add your resend OTP logic here
        console.log('Resending OTP...');
      };
    
      if (!props.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Verify OTP
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Enter OTP"
            type="text"
            id="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.slice(0, 6);
              if (/^\d*$/.test(value)) {
                setOtp(value);
                setError(undefined!);
              }
            }}
            error={error}
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={handleResendOtp}
              className={`${
                canResend
                  ? 'text-[#ff8800] hover:text-[#ff9900]'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              disabled={!canResend}
            >
              Resend OTP
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={props.onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] transition-colors"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OtpModal
import React,{useState} from 'react';;
import InputField from '../../components/Common/Form/InputField';
import Button from '../../components/Common/Form/Button';
import OtpInput from '../../components/auth/OtpInput';
import { useTimer } from '../../Hooks/useTime';
import { validateEmail } from '../../Validation/Validation';
import ChangePassword from '../../components/auth/ChangePassword';
import Modal from '../../components/Common/Modal';
ChangePassword

const ForgetPassword:React.FC = () => {
    const [email,setEmail] = useState<string>('');
    const [otp,setOtp] = useState<string>('');
    const [isOtpSent,setIsOtpSent] = useState<boolean>(false);
    const [emailError,setEmailError] = useState<string|null>(null)
    const [otpError,setOtpError] = useState<string|null>(null);
    const [isModalOpen,setIsModalOpen] = useState(false);

    const {seconds,isActive,restart} = useTimer(60);
 
    const handleEmailInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const email_Value = e.target.value;
        setEmail(email_Value) 
        
        const EmailValid =  validateEmail(email_Value)
        if(EmailValid!==undefined){
            setEmailError(EmailValid)
        }else{
            setEmailError(null)
        }
    }


        const handleSendOTP =()=>{
            if(validateEmail(email)!=undefined){
                setEmailError("Please enter a valid email address before sending OTP");
                return 
            }
            setEmailError("")
            setIsOtpSent(true);
            restart();

        }

        const handleResendOTP=()=>{
            restart()
        }
        const handleVerify =()=>{
            if(otp.length !==6 ){
                setOtpError('Please enter a valid 6-digit OTP');
                return 
            }
            setOtpError(null)
         
            //handle verfication logic here
            console.log('verify otp',otp)
            setIsModalOpen(true);
        }
const handlePassChange=(password:string)=>{
    console.log('password  changed',password)
    setIsModalOpen(false);
    //handle hre the logic
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
            <h1 className='text-3xl font-bold text-black text-center mb-8'>
                Forgot Password
            </h1>
            <div className='space-y-6  '>
                <div className='flex gap-4  items-center'>
                    <InputField
                    label='Email'
                    type={'email'}
                    id={'email'}
                    placeholder={'Enter your email'}
                    value={email}
                    onChange={handleEmailInput}
                    required={true}
                    className="flex-1"
                    error = {emailError ||undefined}
                    
                    />
                    <Button
                    variant='dark'
                    onClick={handleSendOTP}
                    disabled={!email||isOtpSent}
                   children={'Verify'}
                   className='mt-7'
                    />
                </div>
                {
                    isOtpSent && (
                        <>
                        <OtpInput
                         value={otp} 
                         onChange={setOtp}
                         />
                         {otpError&&<p className='text-sm text-orange-400'>
                            {otpError}</p>}
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-grey-600'>
                                Time remaing:{String(Math.floor(seconds/60)).padStart(2,'0')}:
                                {String(seconds % 60).padStart(2,'0')}
                            </span>
                            <Button variant='secondary'
                            onClick={handleResendOTP}
                            disabled={isActive}
                            children={'Resend OTP'}/>


                        </div>
                        <Button
                        className='w-full font-bold'
                        onClick={handleVerify}
                        disabled={otp.length !==6}
                        variant='orange'
                        children={'Submit'}
                        />
                        </>
                    )
                }
               
            </div>
        </div>
                <Modal
                isOpen={isModalOpen} 
                onClose={()=>setIsModalOpen(false)}
                children={
                    <ChangePassword
                    onSubmit={handlePassChange}/>
                }
                />
    </div>
  )
}

export default ForgetPassword;
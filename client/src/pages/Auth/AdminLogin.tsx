
import React,{ useState} from 'react';
import Button from '../../components/Common/Form/Button';
import { validatePassword ,validateEmail} from '../../Validation/Validation';

interface IError{
    email:string|undefined
    password:string|undefined;

}
const AdminLogin:React.FC = () => {
    const [email,setEmail] = useState<string>('');
    const [password,setPassword]=useState<string>('');
    const [errors,setErrors ] = useState<IError>({
        email:"",
        password:""
    })

    const handleEmailChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value)

    }
    const handlePassChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value)


    }

    const handleSubmit =(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const emailError = validateEmail(email)
        const passwordError =validatePassword(password);

        if(emailError!==undefined || passwordError!==undefined){
            setErrors({
                email:emailError!,
                password:passwordError
            })
            return
        }
        setErrors({email:"",password:""})
        console.log('Login submitted:', { email, password });
        // Add your login logic here
    }

  return (
    <div className='font-poppins flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
            <h2 className='text-center text-3xl font-bold text-grey-900 mb-6'>Admin Login

            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="email"
                    className='block text-sm font-medium text-grey-700'
                    >Email
                    </label>
                    <input 
                    type="text"
                    id='email'
                    value={email}
                    onChange={handleEmailChange}
                    placeholder='Enter your email'
                    className='w-full p-2 mt-2 border border-[#ff8800] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent'

                    />
                    {errors.email &&<p className='text-red-500 text-sm mt-2'>{errors.email}</p> }
                </div>
                <div >
                    <label
                     htmlFor="password"
                     className='block text-sm font-medium text-grey-700'
                     >
                        Password
                    </label>
                    <input
                     type="text"
                     id='password'
                     value={password}
                     onChange={handlePassChange}
                     placeholder='Enter your password'
                     className='w-full mt-2  p-2 border border-[#ff8800] rounded-md focus:outline-none focus:ring-2  focus:ring-[#ff8800] focus:border-transparent'
                     />
                     {errors.password && <p className='text-red-500 text-sm mt-2'>{errors.password}</p>}
                     </div>
                        <Button
                        type='submit'
                        variant='orange'
                        children={'Login'}
                        className='w-full py-2 mt-4 bg-[#ff8800] text-white font-extrabold rounded-md hover:bg-[#e07e00] transition-colors'/>
            </form>
    {/* <div className='text-center mt-4'>
        <a href="#"
        className='text-black font-bold text-sm hover:underline'>Forgot Password?
        </a>

    </div> */}
  </div>
 </div>
  )
}

export default AdminLogin




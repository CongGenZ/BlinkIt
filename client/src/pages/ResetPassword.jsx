/* eslint-disable no-unused-vars */
import React,{useEffect,useState} from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link,useLocation,useNavigate } from 'react-router'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data,setData] = useState({
        email : "",
        password : "",
        confirmPassword : ""
    })
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
     

    // check xem input có rỗng hay không
  const valideValue = Object.values(data).every(el => el)
  //const valideValue = data.password && data.confirmPassword
//   const valideValue = Object.entries(data)
//   .filter(([key]) => key !== "email")
//   .every(([, value]) => value)



    useEffect(()=>{
        if(!(location?.state?.data?.success)){
            navigate("/")
        }
        if(location?.state?.email){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setData((preve)=>{
                return{
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleChange = (e) => {
             const {name,value}  = e.target

             setData((preve)=>{
                return{
                    ...preve,
                    [name]:value
                }
             })
    }
    console.log("data reset password",data)


    const handleSubmit = async(e)=>{
        e.preventDefault()

        ///
        if(data.password !== data.confirmPassword){
            toast.error("New password and confirmpssword must be same")
            return
        }



        try {
            const response = await Axios({
                ...SummaryApi.resetPassword, //change  
                data:data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/login")
                setData({
                     email:"",
                    newPassword:"",
                    confirmPassword:""
                })
                console.log(data);
                
            }
        } catch (error) {
             AxiosToastError(error)
              console.log(error);
        
        }
       
    }
  return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg'>Enter Your Password </p>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>

                    {/* email */}
                      {/* email */}
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>


                    <div className='grid gap-1'>
                        <label htmlFor='newPassword'>New Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>
             
                 <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700 p-2" : "bg-gray-500 p-2 " }   text-white py-2 rounded font-semibold my-3 tracking-wide  w-full`}>Change Password</button>

                </form>

                <p>
                    Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>
            </div>
        </section>
  )
}

export default ResetPassword
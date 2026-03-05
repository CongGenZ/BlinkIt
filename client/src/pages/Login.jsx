import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
// eslint-disable-next-line no-unused-vars
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
//import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
const Login = () => {
  const [data,setData] = useState({
    email:"",
    password:"",
  })
     const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
   const dispatch = useDispatch()
  const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
     //  kiểm tra xem tất cả các giá trị trong data có hợp lệ (không rỗng / không falsy) hay không.
     const valideValue = Object.values(data).every(el => el)
  const handleSubmit = async(e)=>{
      e.preventDefault()

      // xử lý call API

      try {
        const response = await Axios ({
            ...SummaryApi.login,
            data :data
        })

        if(response.data.error){
            toast.error(response.data.message)
        }
        if(response.data.success){
            toast.success(response.data.message)
            // lấy từ func login
            // localStorage.setItem('accesstoken',response.data.accessToken)
            // localStorage.setItem('refreshToken',response.data.refreshToken)
            const { accessToken, refreshToken } = response.data.data
            
            localStorage.setItem("accesstoken", accessToken)
             localStorage.setItem("refreshToken", refreshToken)
            const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

             navigate("/")
        }
      } catch (error) {
          AxiosToastError(error)
      }
  }
  return (
    <section className='w-full container mx-auto px-2 flex justify-center items-center min-h-screen bg-gray-50'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7
           
      transform transition-all duration-500 ease-out
      animate-[slideDown_.4s_ease]'>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
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
                        <label htmlFor='password'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200 tran'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
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
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Forgot password ?</Link>
                    </div>
    
                    <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500" }    text-white py-2 rounded font-semibold my-3 tracking-wide`}>Login</button>

                </form>

                <p>
                    Don't have account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>
            </div>
        </section>
  )
}

export default Login

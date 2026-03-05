import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit.jsx';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useEffect } from 'react';

const Profile = () => {

    const user  = useSelector(state => state.user)
    const [openProfiliAvatarEdit, setProFileAvatarEdit] = useState(false)
    const [previewAvatar, setPreviewAvatar] = useState(null)
    const [closing, setClosing] = useState(false)
    const [userData, setUserData]  = useState({
         name: user?.name || "",
         email: user?.email || "",
        mobile: user?.mobile || ""
    })
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleOpenPreview = () => {
    if (!user.avatar) return
    setPreviewAvatar(user.avatar)
  }
    const handleClosePreview = () => {
    setClosing(true)
    setTimeout(() => {
      setPreviewAvatar(null)
      setClosing(false)
    }, 200)
  }
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserData({
             name: user?.name || "",
               email: user?.email || "",
                  mobile: user?.mobile || ""
        })
    },[user])


    const handleOnchange = (e)=>{
        const {name,value} = e.target

        setUserData((preve)=>{
            return{
                ...preve,
                [name]:value
            }
        })
    }


    // submit
    const handleSubmit  = async (e)=>{
        e.preventDefault()

        try {
            ///ban đầu chứ load đc data thì loading là true 
            setLoading(true)

            // calll API từ BE
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data:userData
            })

            const {data : responseData} = response
            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='p-4'>

{/**profile upload and display image */}
        <div onClick={handleOpenPreview} className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm cursor-pointer'>
            {
                user.avatar ? (
                    <img 
                      alt={user.name}
                      src={user.avatar}
                      className='w-full h-full'
                    />
                ) : (
                    <FaRegUserCircle size={65}/>
                )
            }

           
        </div>

         {/* Modal phóng to avatar */}
      {previewAvatar && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
           onClick={handleClosePreview}
        >
          <div
           className={`relative ${
              closing ? 'animate-zoomOut' : 'animate-zoomIn'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={handleClosePreview}
              className="absolute -top-4 -right-4 bg-white text-black 
                         w-10 h-10 rounded-full flex items-center justify-center shadow
                         hover:scale-110 transition-transform"
            >
              ✕
            </button>

            {/* Ảnh phóng to */}
            <img
              src={previewAvatar}
              alt="Avatar preview"
             className="w-72 h-72 sm:w-96 sm:h-96 
                         rounded-full object-cover shadow-xl"
            />
          </div>
        </div>
      )}
        <button onClick={()=>setProFileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>Edit</button>
        
        {
            openProfiliAvatarEdit && (
                <UserProfileAvatarEdit close={()=>setProFileAvatarEdit(false)}/>
            )
        }

        {/**name, mobile , email, change password */}
        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Enter your name' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.name}
                    name='name'
                    onChange={handleOnchange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.email}
                    name='email'
                    onChange={handleOnchange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input
                    type='text'
                    id='mobile'
                    placeholder='Enter your mobile' 
                    className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handleOnchange}
                    required
                />
            </div>

            <button className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
                {
                    loading ? "Loading..." : "Submit"
                }
            </button>
        </form>

    </div>
  )
}

export default Profile
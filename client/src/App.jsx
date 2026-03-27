//import { useState } from 'react'


import { Outlet, useLocation } from 'react-router'
// eslint-disable-next-line no-unused-vars
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import Axios from './utils/Axios';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import './App.css'
import SummaryApi from './common/SummaryApi';
import Header from './components/Header'
import Footer from './components/Footer'
import { AxiosError } from 'axios';
import AxiosToastError from './utils/AxiosToastError';
import GlobalProvider from './provider/GlobalProvider';

function App() {
  //const [count, setCount] = useState(0)
 const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
   const fetchUser = async()=>{
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
  }

const fetchCategory = async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        AxiosToastError(error)
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }

const fetchSubCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        AxiosToastError(error)
    }
  }
  
  useEffect(()=>{
    fetchUser()
    fetchCategory()
   // fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (


    <GlobalProvider>
    <Header/>
    <main className='min-h-[78vh]'>
      <Outlet/>
    </main>
    <Footer/>
    <Toaster/>
  </GlobalProvider>
  )
}

export default App

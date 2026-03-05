//import { useState } from 'react'


import { Outlet, useLocation } from 'react-router'
// eslint-disable-next-line no-unused-vars
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  //const [count, setCount] = useState(0)
 const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const location = useLocation()
   const fetchUser = async()=>{
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
  }

  useEffect(()=>{
    fetchUser()
   // fetchCategory()
    //fetchSubCategory()
    // fetchCartItem()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
    <Header/>
    <main className='min-h-[78vh]'>
      <Outlet/>
    </main>
    <Footer/>
    <Toaster/>
  </>
  )
}

export default App

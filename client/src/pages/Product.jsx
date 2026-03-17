import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const Product = () => {
  // eslint-disable-next-line no-unused-vars
  const [productData,setProductData] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [page,setPage] = useState(1)
  
  const fetchProductData = async()=>{
    try {
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
           }
        })

        const { data : responseData } = response 

        console.log("product page ",responseData)
        if(responseData.success){
          
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }
  }
  
  console.log("product page")
  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      Product
    </div>
  )
}

export default Product
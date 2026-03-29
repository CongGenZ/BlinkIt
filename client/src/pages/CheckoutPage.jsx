// import React, { useMemo, useState } from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
// import AddAddress from '../components/AddAddress'
// import { useSelector } from 'react-redux'
// import AxiosToastError from '../utils/AxiosToastError'
// import toast from 'react-hot-toast'
// import { useNavigate } from 'react-router-dom'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/SummaryApi'
// const CheckoutPage = async () => {
//   //const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
//   const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem } = useGlobalContext()
//   const [openAddress, setOpenAddress] = useState(false)
//   const addressList = useSelector(state => state.address.addressList)
//   const [selectAddress, setSelectAddress] = useState(0)
//   const cartItemsList = useSelector(state => state.cartItem.cart)
//   const navigate = useNavigate()
//   const [isLoading, setIsLoading] = useState(false)
//   const [paymentData, setPaymentData] = useState(null)
//   const [isCheckingPayment, setIsCheckingPayment] = useState(false)

//   const activeAddressList = useMemo(() => addressList.filter(item => item.status), [addressList])
//   const selectedAddress = activeAddressList[Number(selectAddress)]





//   const createOrderAfterPayment = async ({ paymentId = '', paymentStatus = '' } = {}) => {
//     const response = await Axios({
//       ...SummaryApi.createOrder,
//       data: {
//         addressId: selectedAddress?._id,
//         paymentId,
//         payment_status: paymentStatus
//       }
//     })
//     const responseData = response?.data
//     if (!responseData?.success) {
//       throw new Error(responseData?.message || 'Không thể tạo đơn hàng')
//     }
//     await fetchCartItem()
//     return responseData
//   }
//       if (latestPayment?.status === 'paid') {
//         await createOrderAfterPayment({
//           paymentId: latestPayment?.id || '',
//           paymentStatus: 'PAID'
//         })
//         toast.success('Thanh toán thành công')
  
//     const handleCreateCodOrder = async () => {
//       try {
//         if (!validateCheckout()) return
//         setIsLoading(true)
//         await createOrderAfterPayment({
//           paymentId: '',
//           paymentStatus: 'COD'
//         })
//         toast.success('Đặt hàng thành công (COD)')
//         navigate('/success', {
//           state: {
//             text: 'Cash on Delivery'
//           }
//         })
//       } catch (error) {
//         AxiosToastError(error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     handleCreateCodOrder()
//   }



//   const validateCheckout = () => {
//     if (!cartItemsList?.length) {
//       toast.error('Giỏ hàng đang trống')
//       return false
//     }
//     if (!selectedAddress) {
//       toast.error('Vui lòng chọn địa chỉ giao hàng')
//       return false
//     }
//     if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) < 1000) {
//       toast.error('Số tiền tối thiểu để thanh toán online là 1000 VND')
//       return false
//     }
//     return true
//   }

//   const handleCreateOnlinePayment = async () => {
//     try {
//       if (!validateCheckout()) return
//       setIsLoading(true)
//       const response = await Axios({
//         ...SummaryApi.createPayment,
//         data: {
//           amount: Math.round(Number(totalPrice))
//         }
//       })
//       const payload = response?.data
//       setPaymentData(payload)
//       toast.success('Đã tạo mã QR thanh toán')
//       if (payload?.qrImageUrl) {
//         window.open(payload.qrImageUrl, '_blank', 'noopener,noreferrer')
//       }
//     } catch (error) {
//       AxiosToastError(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCheckPaymentStatus = async () => {
//     try {
//       if (!paymentData?.id) {
//         toast.error('Chưa có giao dịch để kiểm tra')
//         return
//       }
//       setIsCheckingPayment(true)
//       const response = await Axios({
//         ...SummaryApi.getPaymentById,
//         url: `${SummaryApi.getPaymentById.url}/${paymentData.id}`
//       })
//       const latestPayment = response?.data
//       setPaymentData(latestPayment)
//       if (latestPayment?.status === 'paid') {
//         toast.success('Thanh toán thành công')
//         navigate('/success', {
//           state: {
//             text: 'Online Payment'
//           }
//         })
//         return
//       }
//       toast('Đơn hàng chưa ghi nhận thanh toán, vui lòng kiểm tra lại sau.')
//     } catch (error) {
//       AxiosToastError(error)
//     } finally {
//       setIsCheckingPayment(false)
//     }
//   }

//   const handleCashOnDelivery = async () => {
//     // if (!validateCheckout()) return
//     // toast.success('Đã chọn thanh toán khi nhận hàng')
//     // navigate('/success', {
//     //   state: {
//     //     text: 'Cash on Delivery'
//     //   }
//     // })
//     try {
//       if (!validateCheckout()) return
//       setIsLoading(true)
//       await createOrderAfterPayment({
//         paymentId: '',
//         paymentStatus: 'COD'
//       })
//       toast.success('Đặt hàng thành công (COD)')
//       navigate('/success', {
//         state: {
//           text: 'Cash on Delivery'
//         }
//       })
//     } catch (error) {
//       AxiosToastError(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <section className='bg-blue-50'>
//       <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
//         <div className='w-full'>
//           {/***address***/}
//           <h3 className='text-lg font-semibold'>Choose your address</h3>
//           <div className='bg-white p-2 grid gap-4'>
//             {
//               activeAddressList.map((address, index) => {
//                 return (
//                   <label key={address._id || index} htmlFor={"address" + index}>
//                     <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
//                       <div>
//                         <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' checked={Number(selectAddress) === index} />
//                       </div>
//                       <div>
//                         <p>{address.address_line}</p>
//                         <p>{address.city}</p>
//                         <p>{address.state}</p>
//                         <p>{address.country} - {address.pincode}</p>
//                         <p>{address.mobile}</p>
//                       </div>
//                     </div>
//                   </label>
//                 )
//               })
//             }
//             <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
//               Add address
//             </div>
//           </div>



//         </div>

//         <div className='w-full max-w-md bg-white py-4 px-2'>
//           {/**summary**/}
//           <h3 className='text-lg font-semibold'>Summary</h3>
//           <div className='bg-white p-4'>
//             <h3 className='font-semibold'>Bill details</h3>
//             <div className='flex gap-4 justify-between ml-1'>
//               <p>Items total</p>
//               <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
//             </div>
//             <div className='flex gap-4 justify-between ml-1'>
//               <p>Quntity total</p>
//               <p className='flex items-center gap-2'>{totalQty} item</p>
//             </div>
//             <div className='flex gap-4 justify-between ml-1'>
//               <p>Delivery Charge</p>
//               <p className='flex items-center gap-2'>Free</p>
//             </div>
//             <div className='font-semibold flex items-center justify-between gap-4'>
//               <p >Grand total</p>
//               <p>{DisplayPriceInRupees(totalPrice)}</p>
//             </div>
//           </div>
//           <div className='w-full flex flex-col gap-4'>
//             <button
//               onClick={handleCreateOnlinePayment}
//               disabled={isLoading || !activeAddressList.length}
//               className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold disabled:bg-green-300 disabled:cursor-not-allowed'
//             >
//               {isLoading ? 'Creating Payment...' : 'Online Payment'}
//             </button>

//             {
//               paymentData?.id && (
//                 <button
//                   onClick={handleCheckPaymentStatus}
//                   disabled={isCheckingPayment}
//                   className='py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed'
//                 >
//                   {isCheckingPayment ? 'Checking...' : 'I Have Paid - Check Status'}
//                 </button>
//               )
//             }

//             <button
//               onClick={handleCashOnDelivery}
//               disabled={isLoading || isCheckingPayment || !activeAddressList.length}
//               className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white disabled:border-green-300 disabled:text-green-300 disabled:hover:bg-white disabled:cursor-not-allowed'
//             >
//               Cash on Delivery
//             </button>
//           </div>
//         </div>
//       </div>


//       {
//         openAddress && (
//           <AddAddress close={() => setOpenAddress(false)} />
//         )
//       }
//     </section>
//   )
// }

// export default CheckoutPage
import React, { useMemo, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const CheckoutPage = () => {

  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem } = useGlobalContext()

  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.address.addressList)

  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)

  const activeAddressList = useMemo(() => {
    return addressList.filter(item => item.status)
  }, [addressList])

  const selectedAddress = activeAddressList[Number(selectAddress)]



  const validateCheckout = () => {

    if (!cartItemsList?.length) {
      toast.error('Giỏ hàng đang trống')
      return false
    }

    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng')
      return false
    }

    if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) < 1000) {
      toast.error('Số tiền tối thiểu để thanh toán online là 1000 VND')
      return false
    }

    return true
  }



  const createOrderAfterPayment = async ({ paymentId = '', paymentStatus = '' } = {}) => {

    const response = await Axios({
      ...SummaryApi.createOrder,
      data: {
        addressId: selectedAddress?._id,
        paymentId,
        payment_status: paymentStatus
      }
    })

    const responseData = response?.data

    if (!responseData?.success) {
      throw new Error(responseData?.message || 'Không thể tạo đơn hàng')
    }

    await fetchCartItem()

    return responseData
  }



  const handleCreateOnlinePayment = async () => {

    try {

      if (!validateCheckout()) return

      setIsLoading(true)

      const response = await Axios({
        ...SummaryApi.createPayment,
        data: {
          amount: Math.round(Number(totalPrice))
        }
      })

      const payload = response?.data

      setPaymentData(payload)

      toast.success('Đã tạo mã QR thanh toán')

      if (payload?.qrImageUrl) {
        window.open(payload.qrImageUrl, '_blank')
      }

    } catch (error) {

      AxiosToastError(error)

    } finally {

      setIsLoading(false)

    }
  }



  const handleCheckPaymentStatus = async () => {

    try {

      if (!paymentData?.id) {
        toast.error('Chưa có giao dịch để kiểm tra')
        return
      }

      setIsCheckingPayment(true)

      const response = await Axios({
        ...SummaryApi.getPaymentById,
        url: `${SummaryApi.getPaymentById.url}/${paymentData.id}`
      })

      const latestPayment = response?.data

      setPaymentData(latestPayment)

      if (latestPayment?.status === 'paid') {

        await createOrderAfterPayment({
          paymentId: latestPayment?.id,
          paymentStatus: 'PAID'
        })

        toast.success('Thanh toán thành công')

        navigate('/success', {
          state: {
            text: 'Online Payment'
          }
        })

        return
      }

      toast('Chưa ghi nhận thanh toán')

    } catch (error) {

      AxiosToastError(error)

    } finally {

      setIsCheckingPayment(false)

    }
  }



  const handleCashOnDelivery = async () => {

    try {

      if (!validateCheckout()) return

      setIsLoading(true)

      await createOrderAfterPayment({
        paymentId: '',
        paymentStatus: 'COD'
      })

      toast.success('Đặt hàng thành công (COD)')

      navigate('/success', {
        state: {
          text: 'Cash on Delivery'
        }
      })

    } catch (error) {

      AxiosToastError(error)

    } finally {

      setIsLoading(false)

    }
  }



  return (

    <section className='bg-blue-50'>

      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>

        <div className='w-full'>

          <h3 className='text-lg font-semibold'>Choose your address</h3>

          <div className='bg-white p-2 grid gap-4'>

            {
              activeAddressList.map((address, index) => {

                return (

                  <label key={address._id || index}>

                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>

                      <input
                        type='radio'
                        value={index}
                        onChange={(e)=>setSelectAddress(e.target.value)}
                        checked={Number(selectAddress)===index}
                        name='address'
                      />

                      <div>

                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>

                      </div>

                    </div>

                  </label>

                )
              })
            }


            <div
              onClick={()=>setOpenAddress(true)}
              className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'
            >
              Add address
            </div>

          </div>

        </div>



        <div className='w-full max-w-md bg-white py-4 px-2'>

          <h3 className='text-lg font-semibold'>Summary</h3>

          <div className='bg-white p-4'>

            <h3 className='font-semibold'>Bill details</h3>

            <div className='flex justify-between'>

              <p>Items total</p>

              <p>
                <span className='line-through text-neutral-400'>
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>

                {DisplayPriceInRupees(totalPrice)}

              </p>

            </div>

            <div className='flex justify-between'>
              <p>Quantity</p>
              <p>{totalQty}</p>
            </div>

            <div className='flex justify-between'>
              <p>Delivery</p>
              <p>Free</p>
            </div>

            <div className='font-semibold flex justify-between'>
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>

          </div>



          <div className='flex flex-col gap-4'>

            <button
              onClick={handleCreateOnlinePayment}
              disabled={isLoading || !activeAddressList.length}
              className='py-2 bg-green-600 text-white rounded'
            >
              {isLoading ? "Creating..." : "Online Payment"}
            </button>


            {
              paymentData?.id && (

                <button
                  onClick={handleCheckPaymentStatus}
                  disabled={isCheckingPayment}
                  className='py-2 bg-blue-600 text-white rounded'
                >
                  {isCheckingPayment ? "Checking..." : "I Have Paid"}
                </button>

              )
            }


            <button
              onClick={handleCashOnDelivery}
              disabled={isLoading}
              className='py-2 border border-green-600 text-green-600 rounded'
            >
              Cash on Delivery
            </button>

          </div>

        </div>

      </div>



      {
        openAddress && (
          <AddAddress close={()=>setOpenAddress(false)} />
        )
      }

    </section>

  )
}

export default CheckoutPage
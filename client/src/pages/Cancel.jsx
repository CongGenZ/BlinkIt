import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='m-2 w-full max-w-md bg-red-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-red-800 font-bold text-lg text-center'>Thanh toán chưa hoàn tất hoặc đã bị hủy.</p>
      <Link to="/checkout" className="border border-red-900 text-red-900 hover:bg-red-900 hover:text-white transition-all px-4 py-1">Quay lại thanh toán</Link>
    </div>
  )
}

export default Cancel

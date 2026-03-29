import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'



const AddAddress = ({close}) => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm()
    const { fetchAddress } = useGlobalContext()
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [isLoadingProvince, setIsLoadingProvince] = useState(false)
    const [isLoadingDistrict, setIsLoadingDistrict] = useState(false)
    const [isLoadingWard, setIsLoadingWard] = useState(false)

    const provinceOptions = useMemo(
        () => provinces?.map((p) => ({ code: p.code, name: p.name })) ?? [],
        [provinces]
    )

    useEffect(() => {
        let ignore = false
        const load = async () => {
            try {
                setIsLoadingProvince(true)
                const res = await fetch("https://provinces.open-api.vn/api/p/")
                const json = await res.json()
                if (!ignore) setProvinces(Array.isArray(json) ? json : [])
            // eslint-disable-next-line no-unused-vars
            } catch (e) {
                if (!ignore) setProvinces([])
            } finally {
                if (!ignore) setIsLoadingProvince(false)
            }
        }
        load()
        return () => {
            ignore = true
        }
    }, [])

    const handleProvinceChange = async (e) => {
        const code = e.target.value

        // clear dependent select
        setDistricts([])
        setWards([])
        setValue("city", "")
        setValue("ward", "")

        if (!code) return

        try {
            setIsLoadingDistrict(true)
            const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
            const json = await res.json()
            setDistricts(Array.isArray(json?.districts) ? json.districts : [])
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            setDistricts([])
        } finally {
            setIsLoadingDistrict(false)
        }
    }

    const handleDistrictChange = async (e) => {
        const code = e.target.value

        setWards([])
        setValue("ward", "")

        if (!code) return

        try {
            setIsLoadingWard(true)
            const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
            const json = await res.json()
            setWards(Array.isArray(json?.wards) ? json.wards : [])
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            setWards([])
        } finally {
            setIsLoadingWard(false)
        }
    }

    const onSubmit = async(data)=>{
        try {
            const provinceName = provinces?.find((p) => String(p.code) === String(data?.state))?.name
            const districtName = districts?.find((d) => String(d.code) === String(data?.city))?.name
            const wardName = wards?.find((w) => String(w.code) === String(data?.ward))?.name

            if(!provinceName || !districtName || !wardName){
                toast.error("Please select Province/City, District and Ward")
                return
            }

            const response = await Axios({
                ...SummaryApi.createAddress,
                data : {
                    address_line :data.addressline,
                    ward : wardName,
                    city : districtName,
                    state : provinceName,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                reset()
                fetchAddress()
                if(close) close()
                return
            }

            toast.error(responseData?.message || "Failed to create address")
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
        <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
            <div className='flex justify-between items-center gap-4'>
                <h2 className='font-semibold'>Add Address</h2>
                <button onClick={close} className='hover:text-red-500' disabled={isSubmitting}>
                    <IoClose  size={25}/>
                </button>
            </div>
            <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1'>
                    <label htmlFor='addressline'>Address Line :</label>
                    <input
                        type='text'
                        id='addressline' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("addressline",{required : true})}
                    />
                    {errors.addressline && <p className='text-red-600 text-sm'>Address line is required</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='city'>Huyện/Quận:</label>
                    <select
                        id='city'
                        className='border bg-blue-50 p-2 rounded'
                        disabled={isSubmitting || isLoadingDistrict || districts.length === 0}
                        {...register("city", { required: true, onChange: handleDistrictChange })}
                    >
                        <option value=''>
                            {isLoadingDistrict ? "Loading districts..." : "Select district"}
                        </option>
                        {districts?.map((d) => (
                            <option key={d.code} value={d.code}>{d.name}</option>
                        ))}
                    </select>
                    {errors.city && <p className='text-red-600 text-sm'>City is required</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='ward'> Tên phường/xã :</label>
                    <select
                        id='ward'
                        className='border bg-blue-50 p-2 rounded'
                        disabled={isSubmitting || isLoadingWard || wards.length === 0}
                        {...register("ward", { required: true })}
                    >
                        <option value=''>
                            {isLoadingWard ? "Loading wards..." : "Select ward"}
                        </option>
                        {wards?.map((w) => (
                            <option key={w.code} value={w.code}>{w.name}</option>
                        ))}
                    </select>
                    {errors.ward && <p className='text-red-600 text-sm'>Ward is required</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='state'>Province / City :</label>
                    <select
                        id='state'
                        className='border bg-blue-50 p-2 rounded'
                        disabled={isSubmitting || isLoadingProvince}
                        {...register("state", { required: true, onChange: handleProvinceChange })}
                    >
                        <option value=''>
                            {isLoadingProvince ? "Loading provinces..." : "Select province/city"}
                        </option>
                        {provinceOptions.map((p) => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                        ))}
                    </select>
                    {errors.state && <p className='text-red-600 text-sm'>State is required</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='pincode'>Pincode :</label>
                    <input
                        type='text'
                        id='pincode' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("pincode",{required : true})}
                    />
                    {errors.pincode && <p className='text-red-600 text-sm'>Pincode is required</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='country'>Country :</label>
                    <input
                        type='text'
                        id='country' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("country",{required : true})}
                    />
                    {errors.country && <p className='text-red-600 text-sm'>Country is required</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='mobile'>Mobile No. :</label>
                    <input
                        type='text'
                        id='mobile' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("mobile",{required : true})}
                    />
                    {errors.mobile && <p className='text-red-600 text-sm'>Mobile number is required</p>}
                </div>

                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-primary-200 w-full py-2 font-semibold mt-4 hover:bg-primary-100 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    </section>
  )
}

export default AddAddress
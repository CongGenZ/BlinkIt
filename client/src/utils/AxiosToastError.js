import toast from "react-hot-toast";

const AxiosToastError = (error) => {
  const message =
    error?.response?.data?.message ||   // message từ backend
    error?.message ||                   // lỗi axios
    "Something went wrong";             // fallback cuối

  toast.error(message,
    {
        duration:4000,
        position:"top-center"
    }
  );
};

export default AxiosToastError;

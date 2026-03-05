// import { v2 as cloudinary } from "cloudinary";
// cloudinary.config({
//   cloud_name: process.env.CLODINARY_CLOUD_NAME,
//   api_key: process.env.CLODINARY_API_KEY,
//   api_secret: process.env.CLODINARY_API_SECRET_KEY,
// });
// const uploadImageClodinary = async(image)=>{
//   const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

//   const uploadImage = await new Promise((resolve,reject)=>{
//       cloudinary.uploader.upload_stream({ folder : "binkeyit"},(error,uploadResult)=>{
//           return resolve(uploadResult)
//       }).end(buffer)
//   })

//   return uploadImage
// }

// export default uploadImageClodinary
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET_KEY,
});

/// upload Avatar
  export const uploadImageClodinary = async (image) => {
  if (!image?.buffer) {
    throw new Error("Image buffer not found");
  }

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "binkeyit",
        resource_type: "image",


        // optimize (tối ưu)
         format:"jpg",
         quality:"auto",
         fetch_format : "auto",


           // avatar crop face
         transformation: [
        {
           with:300, height:300, crop:"fill", gravity:"face"
        }
      ],
      },

    

      
      (error, result) => {
        if (error) return reject(error);   // 🔥 bắt lỗi đúng
        resolve(result);
      }
    ).end(image.buffer); // 🔥 dùng buffer của multer
  });

  return uploadImage;
};
// delete old avatar
 export const deleteImageCloudinary = async (public_id) => {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
};


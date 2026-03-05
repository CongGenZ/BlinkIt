import multer from 'multer'

const storage = multer.memoryStorage()

const upload = multer({ storage : storage,
  limits:{
    fileSize:5 * 1024 * 1024 ,/// max 5MB
  },
  fileFilter:(req, file,cb)=>{
     // chỉ cho phép image
    if(!file.mimetype.startsWith("image/")){
        const err = new Error("File must be image");
        err.code = "LIMIT_FILE_TYPE";
       return cb(null,false);//  ko cho phép upload
    }
    cb(null,true)
  }

 })

export default upload
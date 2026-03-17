import { Router } from 'express'
import auth from '../middleware/auth.js';
import {uploadImageController}   from '../controller/uploadImage.controller.js';
import upload from '../middleware/multer.js' 

 const uploadRouter = Router()

uploadRouter.post("/upload", auth,upload.single("image",6),
 (req,res,next)=>{
      if(req.file.length>6){
        return res.file.status(400).json({
            message:"Chỉ được upload tối đa 6 ảnh"
        })
      }
      next()
 },

uploadImageController)

export default uploadRouter
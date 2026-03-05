import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemolate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefeshToken from "../utils/generatedRefeshToken.js";
import { uploadImageClodinary } from "../utils/uploadImageClodinary.js";
import { deleteImageCloudinary } from "../utils/uploadImageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";
//import upload from './../middleware/multer.js';
import sendEmailNodemailer from "../config/sendEmailNodemailer.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import auth from "../middleware/auth.js";
import jwt from 'jsonwebtoken';


export async function registerUserController(request, respone) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return respone.status(400).json({
        message: "provide name,email,password",
        error: true,
        success: false, 
      });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return respone.json({
        message: "Already register email",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };
    const newUser = new UserModel(payload);
    const save = await newUser.save();
    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from binkeyit",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });
    return respone.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return respone.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, respone) {
  try {
    const { code } = request.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return respone.status(400).json({
        message: "Invaild code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return respone.json({
      message: "Verify email done",
      success: true,
      error: false,
    });
  } catch (error) {
    return respone.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}

// loginContronller

export async function loginController(request, respone) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return respone.status(400).json({
        message: "provide email, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return respone.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return respone.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return respone.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefeshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    respone.cookie("accessToken", accessToken, cookiesOption);
    respone.cookie("refreshToken", refreshToken, cookiesOption);

    return respone.json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return respone.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// logout

//logout controller
export async function logoutController(request, response) {
  try {
    const userid = request.userId; //middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return response.json({
      message: "Logout successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// upload user avatar
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId // auth middwere
    const image = request.file; // ,uter midwere
    //console.log("image:", image);

       

    /// ===VALIDATE===
     if(!image){
      return response.status(400).json({
        message:"Image not found",
        error:true,
        success:false 
      })
     }
    
    ///=== GET OLD AVATAR ====

    const user = await UserModel.findById(userId);
    const oldPublicId= user?.avatar_public_id;

    //   const updateUser = await UserModel.findByIdAndUpdate(userId,{
    //     avatar : upload.secure_url,
    //     avatar_public_id: upload.public_id,
    // })
      // ===== UPLOAD NEW =====
    const upload = await uploadImageClodinary(image)
  if (!upload?.secure_url) {
      throw new Error("Upload failed");
    }
 // ===== DELETE OLD =====

   if(oldPublicId){
    await deleteImageCloudinary(oldPublicId);
   }

const updateUser = await UserModel.findByIdAndUpdate(userId,{
        avatar : upload.secure_url,
        avatar_public_id: upload.public_id,
    },
         { new: true }
  )
    return response.json({
      message : "upload profile",
      success : true,
      error : false,
      data : {
          _id : userId,
          avatar : upload.secure_url
      }
  })
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



// update user detaile
 export async function updateUserDetails (request,response){
          try {
            const userId = request.userId //auth middleware
            const {name, email, mobile, password} = request.body

            let hashPassword = ""

            if(password){
              const salt = await bcryptjs.genSalt(10)
              hashPassword  =  await bcryptjs(password, salt)
            }

            const updateUser = await UserModel.findByIdAndUpdate(userId,{
               ...(name && {name:name}),
               ...(email && {email:email}),
               ...(mobile && {mobile:mobile}),
               ...(password && {password:password}), 
            })

            return response.json({
              message : "update user successfully",
               error : false,
               success : true,
                data : updateUser
            })
          } catch (error) {
             return response.status(500).json({
              message : error.message || error,
              error : true,
               success : false
             })
          }
 }

 // forgot password not login

export async function forgotPasswordController(request,response) {
       try {
          const {email} = request.body

          const user = await UserModel.findOne({email})

          if(!user){
            return response.status(400).json({
              message:"Email not available",
              error : true,
              success:false
            })
          }

          const otp = generatedOtp()
          const expireTime = new Date() + 60 * 60 * 1000 //1hr
           const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp:otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
           }) 
           await sendEmailNodemailer({
            sendTo : email, 
            subject : "Forgot password from Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
      //       html: `
      //   <div style="font-family: Arial, sans-serif; padding: 10px;">
      //     <h2>Xác minh tài khoản của bạn</h2>
      //     <p>Mã OTP của bạn là:</p>
      //     <h1 style="color: #007bff;">${otp}</h1>
      //     <p>OTP có hiệu lực trong 5 phút. Đừng chia sẻ với ai khác!</p>
      //   </div>
      // `,
           })
           return response.json({
            message:"Check your email",
            error:false,
            success:true
           })
       } catch (error) {
        return response.status(500).json({
          message: error.message || error,
          error : true,
          success  :false
        })
       }
}


// verify forgot password otp
 export async function verifyForgotPasswordOtpController (request,response){
        try {
          //request body
          const {email, otp} = request.body
          if(!email || !otp){
            return response.status(400).json({
              message:"provide email and otp",
              error : true,
              success:false
            })
          }
          const user =await UserModel.findOne({email})
          if(!user){
            return response.status(400).json({
              message:"User not register",
              error : true,
              success:false
            })
          }
          const currentTime = new Date().toISOString()
          if(currentTime > new Date(user.forgot_password_expiry)){
            return response.status(400).json({
              message:"Otp expired",
              error : true,
              success:false
            })
          }
          if(user.forgot_password_otp !== otp){
            return response.status(400).json({
              message:"Invaild otp",
              error : true,
              success:false
            })
          }
          
          //if otp is not expired
        //otp === user.forgot_password_otp
        const uploadedUser = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : null,
            forgot_password_expiry : null
        })
        return response.json({
          message:"Verify otp successfully",
          error : false,
          success:true
        })
        } catch (error) {
          return response.status(500).json({
            message: error.message || error,
            error : true,
            success  :false
          })
        }
      }


// reset password controller
  export async function resetPasswordController (request,response){
    try{
       const {email, password, confirmPassword } = request.body
       if(!email || !password || !confirmPassword){
        return response.status(400).json({
          message:"provide email,password,confirmPassword",
          error : true,
          success:false
        })
       }
       const user = await UserModel.findOne({email})
       if(!user){
        return response.status(400).json({
          message:"User not register",
          error : true,
          success:false
        })
       }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const updateUser = await UserModel.findByIdAndUpdate(user._id,{
          password : hashPassword
        })  
        return response.json({
          message:"Reset password successfully",
          error : false,
          success:true
        })  
    }catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error : true,
        success  :false
      })
    }
  }

  
  export async function refreshTokenController(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]
 //console.log(refreshToken);
     

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFESH_TOKEN)
        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : false,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)
               //// select loại bỏ pass và refesh token khi trả về fontend
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}
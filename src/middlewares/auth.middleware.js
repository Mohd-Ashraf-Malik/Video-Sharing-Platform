import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async (req,_,next)=>{
    try {
        // we will get access token from cookies request
        // verify with jwt and get decoded token
        // from decoded token we can get mongo_db id and get user data from db
        // we will add req.user and initialize it with user data
        // it will be now availaible for logout after using it as middleware

    
    
        // agar web pe ho toh cookies se kaam chal jata hain 
        // par app pr hot toh usme cookie nhi hoti toh authorization header ka istemal karna padega
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        // sometime we have to use await for jwt
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        // refrence from jwt.sign return by user.model.js from generateAccessToken
        const user = await User.findById(decodedToken._id);
    
        if(!user){
            // NEXT_VIDEO : discuss about frontend
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid Access Token")
    }

})
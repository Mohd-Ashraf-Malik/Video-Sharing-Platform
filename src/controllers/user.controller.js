import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {deleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Subscription } from "../models/subsciption.model.js";
import mongoose from "mongoose";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password, refresh token field from response
    // check for user creation
    // return response

    const {fullName,email,username,password} = req.body;
    
    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,"user already exists")
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    let coverImageLocalPath;

    if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log(req.files);

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // console.log(avatar);

    if(!avatar){
        throw new ApiError(400,"avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // password aur refreshToken field nhi aayega
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {
    // get email or username and password from frontend
    // find the user
    // password check
    // generate access token and refresh token
    // send cookie
    // return res

    const {email,username,password} = req.body;

    if(!username && !email){
        throw new ApiError(400,"username or email is required");
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)    // cookie-parser middleware se cookie ka istemal karparahe hain
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User successfully logged In"
        )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    // 1st question - we do not have user data
    // so we will use middleware for that
    // middleware will provider us user data
    // now expire the accessToken and refreshToken Session

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true   // use to actually update db if not set then it will not update
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out")
    )
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    // user is login and it wants to refresh token

    // get incomingRefreshToken from cookies
    // decode incomingRefreshToken and find user
    // to check refreshToken matches
    // if matched generate new accessToken and refreshToken

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(user?.refreshToken !== decodedToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid refresh token")
    }


})

const changeCurrentPassword = asyncHandler(async (req,res)=>{
    // get oldPassword and newPassword from frontend
    // get user db from jwt verification middleware
    // check oldPassword matches with user password
    // change password through user db


    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"All fields are required");
    }
    const user = await User.findById(req.user?._id)
    
    if(!user){
        throw new ApiError(401,"unauthorized request");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(isPasswordCorrect){
        throw new ApiError(400,"Incorrect Password");
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
})

const getCurrentUser = asyncHandler(async (req,res)=>{
    // from jwt verification get user db
    const user = await User.findById(req.user._id);
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req,res)=>{
    // from jwt verification get user db
    const {fullName,email} = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Details updated successfully"));
})

const updateUserAvatar = asyncHandler(async (req,res)=>{
    // use multer middleware
    // use jwt verify middleware

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    // TODO: delete old image - assignment

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(400,"unauthorized user");
    }

    const avatarUrl = user.avatar;

    if(!deleteOnCloudinary(avatarUrl)){
        throw new ApiError(500,"Error while deleting oldImage")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400,"Error while uploading avatar");
    }

    user.avatar = avatar.url;
    user.select("-password -refreshToken");
    user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar file updated successfully"));
})

const updateUserCoverImage = asyncHandler(async (req,res)=>{
    // use multer middleware
    // use jwt verify middleware

    // TODO: delete old image - assignment

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(400,"unauthorized user");
    }

    const coverImageUrl = user.coverImage;

    if(!deleteOnCloudinary(coverImageUrl)){
        throw new ApiError(500,"Error while deleting oldImage")
    }

    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400,"coverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage){
        throw new ApiError(400,"Error while uploading coverImage");
    }

    user.coverImage = coverImage.url;
    user.select("-password -refreshToken");
    user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200,user,"coverImage file updated successfully"));
})

const getUserChannelPorfile = asyncHandler(async (res,req)=>{

    const {username} = req.params;

    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: { username: username.toLowerCase() }
        },
        {
            $lookup: {
                from: "subscriptions",
                as: "subscribers",
                localField: "_id",
                foreignField: "channel"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                as: "subscribedTo",
                localField: "_id",
                foreignField: "subscriber"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscriber"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                createdAt: 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,"channel does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,channel,"User channel fetched succesfully"))
})

const getWatchHistory = asyncHandler(async (res,req)=>{
    const user  = await User.aggregate([
        {
            $match: {
                // _id: req.user._id
                // wrong syntax bcoz we have to give it has object_id
                // in this aggregation case mongoose does not work unlike other cases
                // convert string to object id
                // _id: new mongoose.Types.ObjectId.createFromHexString(req.user._id)
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                as: "watchHistory",
                localField: "watchHistory",
                foreignField: "_id",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline:{
                                $project: {
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200,user[0].watchHistory,"Watch history fetched Successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory
}
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const getAllVideos = asyncHandler(async(req,res)=>{

})

const publishVideo = asyncHandler(async(req,res)=>{
    // get videoFile,thumbnail,title,description,views from frontend
    // use multer middleware
    // upload it on cloudinary
    // give url of video file

    if(!req.user){
        throw new ApiError(401,"unauthorized user");
    }
    const {title,description} = req.body;
    if(!title || !description){
        throw new ApiError(400,"all fields are required");
    }
    const videoFileLocalPath = req?.files?.videoFile[0]?.path;

    if(!videoFileLocalPath){
        throw new ApiError(400,"Error while uploading videofile through multer");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    console.log(videoFile);

    if(!videoFile){
        throw new ApiError(400,"Error while uploading videofile on Cloudinary");
    }

    const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;

    if(!thumbnailLocalPath){
        throw new ApiError(400,"Error while uploading thumbnail through multer")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail){
        throw new ApiError(400,"Error while uploading thumbnail on Cloudinary");
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user._id,
        duration: videoFile.duration
    })

    const publishedVideo = await Video.findById(video._id);

    return res
    .status(200)
    .json(
        new ApiResponse(200,publishedVideo,"Video published successfully")
    )
})

const getVideoById = asyncHandler(async(req,res)=>{
    // get video by id
    const {videoId} = req.params;
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                as: "owner",
                localField: "owner",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      email: 1,
                      username: 1,
                      avatar: 1
                    }
                  }
                ]
            }
          },
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }
    ])
    if(!video){
        throw new ApiError(400,"Error while fetching video")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,video[0],"Video fetched Successfully")
    )
})

const updateVideo = asyncHandler(async (req,res)=>{
    const video = await Video.findById()
})

export {
    publishVideo,
    getVideoById
}
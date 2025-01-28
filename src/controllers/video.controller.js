import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


const getAllVideos = asyncHandler(async(req,res)=>{
    const {page=1,limit=10,query,sortBy='createdAt',sortType='desc',userId} = req.query;
    // TODO: get all videos based on query, sort, pagination

    const skip = (parseInt(page)-1)*parseInt(limit);
    const limitInt = parseInt(limit);

    const sortCriteria = {};
    sortCriteria[sortBy] = sortType === 'desc' ? -1:1;

    const searchCriteria = query? {title: {$regex:query,$options:'i'}}:{};

    if(userId){
        searchCriteria.owner = userId;
    }

    const allVideos = await Video.find(searchCriteria)
                                 .sort(sortCriteria)
                                 .skip(skip)
                                 .limit(limitInt)

    const totalVideos = await Video.countDocuments(searchCriteria);

    const totalPages = Math.ceil(totalVideos/limitInt);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            allVideos: allVideos,
            page: parseInt(page),
            totalPages,
            totalVideos,
        },
        "Videos fetched successfully"
    ))
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

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "VideoId missing");
    }

    

    await Video.updateOne(
        { 
            _id: videoId, 
            watchedUsers: { $ne: req.user._id } // Check if user is not in watchedUsers
        },
        { 
            $addToSet: { watchedUsers: req.user._id }, // Add user if not already in array
            $inc: { views: 1 } // Increment views
        }
    );

    await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $addToSet: { watchHistory: videoId } // Adds videoId to watchHistory only if it doesn't already exist
        },
        {
            new: true, // Return the updated document
            upsert: true // Create the document if it doesn't exist
        }
    );

    // Use aggregation pipeline to fetch and update video in one go
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
                isPublished: true
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
        },
        {
            $project: {
                owner: 1,
                title: 1,
                description: 1,
                views: 1
            }
        }
    ]);
    
    if (!video || video.length==0) {
        throw new ApiError(404, "Video not found");
    }
    
    return res.status(200).json(new ApiResponse(200,video[0], "Video fetched successfully"));

    // Return the video data
});


const updateVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;
    // update title,description and thumbnail

    const {title,description} = req.body;

    if(!title || !description){
        throw new ApiError(400,"All fields are required");
    }

    const video = await Video.findById(videoId);

    // object id matches with equals function
    if(!video.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissable to update this video");
    }

    const thumbnailUrl = await video.thumbnail;

    if(!deleteOnCloudinary(thumbnailUrl)){
        throw new ApiError(400,"Error while updating thumbnail");
    }

    const thumbnailLocalPath = req?.file?.path;
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail){
        throw new ApiError(400,"Error while uploading thumbnailImage");
    }

    video.thumbnail = thumbnail.url;
    video.title = title;
    video.description = description;
    video.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video updated Successfully"))
})

const deleteVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;

    const video = await Video.findById(videoId);

    // object id matches with equals function
    if(!video.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissable to delete this video");
    }

    await Video.findByIdAndDelete(videoId);

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req,res)=>{
    
    const {videoId} = req.params;
    const video = await Video.findById(videoId);

    console.log(video);
    // object id matches with equals function
    if(!video.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissable to update publish status");
    }

    video.isPublished = !video.isPublished;
    video.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200,{isPublished: video.isPublished},"Published status toggle successfully"))

})

export {
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos
}
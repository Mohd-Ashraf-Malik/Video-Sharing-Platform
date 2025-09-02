import mongoose from "mongoose";
import { Subscription } from "../models/subsciption.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";


const getChannelStats = asyncHandler(async (req,res)=>{
    const totalsubscribers = await Subscription.countDocuments({channel: req.user._id})
    const totalVideos = await Video.countDocuments({owner: req.user._id})
    const resultTotalViews = await Video.aggregate([
        { $match: {owner: new mongoose.Types.ObjectId(req.user._id)} },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])
    
    const totalViews = resultTotalViews.length ? resultTotalViews[0].totalViews : 0;

    const resultTotalLikes = await Like.aggregate([
        {
            $match: { video: {$ne: null} }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $match: {
                            owner: new mongoose.Types.ObjectId(req.user._id)
                        }
                    }
                ]
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {$count: {}}
            }
        }
    ])
    // console.log(resultTotalLikes)
    // const totalLikes = 0;
    const totalLikes = resultTotalLikes.length? resultTotalLikes[0].totalLikes : 0;
    return res.status(200).json(new ApiResponse(200,{totalsubscribers,totalVideos,totalViews,totalLikes},"Channel dashboard details fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req,res)=>{
    const videos = await Video.find({owner: req.user._id})
    return res.status(200).json(new ApiResponse(200,videos,"Your Channel Video fetched successfully"))
})

export {getChannelVideos,getChannelStats}
import mongoose from "mongoose";
import { Subscription } from "../models/subsciption.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;

    const subscription = await Subscription.findOne({channel: channelId,subscriber: req.user._id});
    let bool = true;
    console.log(subscription)
    if(!subscription){
        await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })
    }
    else{
        await Subscription.findOneAndDelete({channel: channelId,subscriber: req.user._id});
        bool = false;
    }

    return res.status(200).json(new ApiResponse(200,bool,"Subscription toggle successfully"));
})

const getSubscribedChannel = asyncHandler(async (req,res)=>{
    const {channelId} = req.params;
    const subscribedChannels = await Subscription.aggregate([
        { $match: { subscriber: new mongoose.Types.ObjectId(channelId) } },
        { 
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelData",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        }
    ]);
    return res.status(200).json(new ApiResponse(200,subscribedChannels,"Subscribed channel fetched successfully"));
})

const getUserSubscribers = asyncHandler(async (req,res)=>{
    // const userId = req.user._id;
    // console.log(req.user._id);
    const subscribers = await Subscription.aggregate([
        { $match: { channel: new mongoose.Types.ObjectId(req.user._id) } },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberData",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,subscribers,"Subscribers channel fetched successfully"));
})

export {
    toggleSubscription,
    getSubscribedChannel,
    getUserSubscribers
}
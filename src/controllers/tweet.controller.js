import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createTweet = asyncHandler(async (req,res)=>{
    const {content} = req.body;

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(new ApiResponse(200,tweet,"Created tweet successfully"))
})

const getYourTweet = asyncHandler(async (req,res)=>{
    const tweet = await Tweet.find({owner: req.user._id});
    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Your tweet generated"))
})

const getUserTweet = asyncHandler(async (req,res)=>{
    const {userId} = req.params;
    const tweet = await Tweet.find({owner: userId})
    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"User tweet generated"))
})

const updateTweet = asyncHandler(async (req,res)=>{
    const {tweetId} = req.params;
    const {content} = req.body;
    let tweet = await Tweet.findOne({_id: tweetId,owner: req.user._id});
    if(tweet){
        tweet.content = content;
        tweet.save({validateBeforeSave: false});
    }
    else{
        throw new ApiError(400,"You are not permissible to update tweet")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req,res)=>{
    const {tweetId} = req.params;
    let tweet = await Tweet.findOne({_id: tweetId,owner: req.user._id});
    if(tweet){
        await Tweet.findByIdAndDelete(tweetId);
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{},"tweet deleted successfully"));
})


export {
    createTweet,
    getYourTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}
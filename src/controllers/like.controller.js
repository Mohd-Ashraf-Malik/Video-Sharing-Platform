import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;

    const videoLike = await Like.findOne({video: videoId,likedBy: req.user._id})

    let bool;
    if(videoLike){
        await Like.deleteOne({video: videoLike.video,likedBy: req.user._id});
        bool=false
    }
    else{
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        bool=true
    }

    return res
    .status(200)
    .json(new ApiResponse(200,bool,"Video like toggle successfully"));


})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;

    const commentLike = await Like.find({comment: commentId})

    let bool;
    console.log(commentLike)
    if(commentLike.length !== 0){
        await Like.deleteOne({comment: commentLike[0].comment});
        bool=false
    }
    else{
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        bool=true
    }

    return res
    .status(200)
    .json(new ApiResponse(200,bool,"Comment like toggle successfully"));
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;

    const tweetLike = await Like.find({tweet: tweetId})

    let bool;
    console.log(tweetLike)
    if(tweetLike.length !== 0){
        await Like.deleteOne({tweet: tweetLike[0].tweet});
        bool=false
    }
    else{
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        bool=true
    }

    return res
    .status(200)
    .json(new ApiResponse(200,bool,"Tweet like toggle successfully"));
})

const getLikedVideos = asyncHandler(async (req,res)=>{
    const likedVideos = await Like.find({ likedBy: req.user._id, video: { $ne: null } })
                                .populate({
                                    path: "video",
                                    select: "title thumbnail views owner",
                                    populate: { path: "owner", select: "fullName username avatar" }
                                })
                                .sort({ createdAt: -1 });
    return res
    .status(200)
    .json(new ApiResponse(200,likedVideos,"All liked videos fetched successfully"))
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}
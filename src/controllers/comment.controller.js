import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const getVideoComments = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;
    const {page=1,limit=10} = req.query;

    const limitInt = parseInt(limit);
    const skip = (parseInt(page)-1)*limitInt;

    const comments = await Comment.find({video: videoId})
                                  .skip(skip)
                                  .limit(limitInt)
    return res
    .status(200)
    .json(new ApiResponse(200,comments,"Comments fetched successfully"));
})

const addComment = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;
    const {content} = req.body;
    const video = new mongoose.Types.ObjectId(videoId)
    const owner = new mongoose.Types.ObjectId(req.user._id)
    const comment = await Comment.create({
        content,
        video,
        owner
    })
    if(!comment){
        throw new ApiError(400,"Error while adding comment")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment added successfully"))
})

const updateComment = asyncHandler(async (req,res)=>{
    const {commentId} = req.params;
    const {content} = req.body;
    console.log(commentId)
    const comment = await Comment.findById(commentId)
    comment.content = content;
    comment.save({validateBeforSave: false});
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req,res)=>{
    const {commentId} = req.params;
    await Comment.findByIdAndDelete(commentId)
    res
    .status(200)
    .json(new ApiResponse(200,{},"Comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
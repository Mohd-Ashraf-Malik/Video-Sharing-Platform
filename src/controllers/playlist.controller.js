import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createPlaylist = asyncHandler(async (req,res)=>{
    const {name,description} = req.body;
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })
    return res
    .status(201)
    .json(new ApiResponse(200,playlist,"Playlist created successfully"))
})

const addVideoPlaylist = asyncHandler(async (req,res)=>{
    const {playlistId,videoId} = req.params;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissible to add videos")
    }
    playlist.videos.push(videoId);
    playlist.save({validateBeforeSave: false});
    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Video added successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req,res)=>{
    const {playlistId,videoId} = req.params;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissible to add videos")
    }
    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        { $pull : {videos: videoId} },
        { new: true }
    )
    return res.status(200).json(new ApiResponse(200,newPlaylist,"Video removed successfully"))
})

const getPlaylistById = asyncHandler(async (req,res)=>{
    const {playlistId} = req.params;
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,playlist,"Playlist fetched successfully"))
})

const updatePlaylistById = asyncHandler(async (req,res)=>{
    const {playlistId} = req.params;
    const {name,description} = req.body;

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }

    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissible to update videos")
    }

    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        { name,description },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200,newPlaylist,"Playlist updated name and description successfully"))
})

const deletePlaylistById = asyncHandler(async (req,res)=>{
    const {playlistId} = req.params;
    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404,"Playlist not found")
    }

    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(401,"You are not permissible to update videos")
    }

    await Playlist.findByIdAndDelete(playlistId);
    
    return res.status(200).json(new ApiResponse(200,{},"Playlist removed successfully"))
})

const getUserPlaylist = asyncHandler(async (req,res)=>{
    const {userId} = req.params;
    const playlists = await Playlist.find({owner: userId});
    res.status(200).json(new ApiResponse(200,playlists,"User playlists fetched successfully"))
})

export {
    createPlaylist,
    addVideoPlaylist,
    removeVideoFromPlaylist,
    getPlaylistById,
    updatePlaylistById,
    deletePlaylistById,
    getUserPlaylist
}
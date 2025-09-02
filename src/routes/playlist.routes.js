import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoPlaylist, createPlaylist, deletePlaylistById, getPlaylistById, getUserPlaylist, removeVideoFromPlaylist, updatePlaylistById } from "../controllers/playlist.controller.js";

const router = Router()

router.use(verifyJWT)
router.route("/").post(createPlaylist);

router.route('/:playlistId')
                            .get(getPlaylistById)
                            .patch(updatePlaylistById)
                            .delete(deletePlaylistById)

router.route("/add/:playlistId/:videoId").patch(addVideoPlaylist)
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist)

router.route('/user/:userId').get(getUserPlaylist)


export default router
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoById, publishVideo } from "../controllers/video.controller.js";

const router = Router();

router.route('/publish-video').post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
)

router.route('/vid/:videoId').get(verifyJWT,getVideoById)





export default router
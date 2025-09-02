import { Router } from "express";
import { createTweet, deleteTweet, getUserTweet, getYourTweet, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)
router.route("/").post(createTweet).get(getYourTweet)
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)

export default router
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannel, getUserSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";



const router = Router();

router.use(verifyJWT)

router.route('/c/:channelId').post(toggleSubscription)
                             .get(getSubscribedChannel)


router.route('/u').get(getUserSubscribers)


export default router
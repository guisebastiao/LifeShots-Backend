import { Router } from "express";

import feedController from "../controllers/FeedController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, feedController.index);

export default router;

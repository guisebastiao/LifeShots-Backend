import { Router } from "express";

import likeStoryController from "../controllers/LikeStoryController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, likeStoryController.store);
router.get("/:storyId", loginRequired, likeStoryController.index);

export default router;

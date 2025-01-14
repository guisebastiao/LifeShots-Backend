import { Router } from "express";

import likeCommentTreeController from "../controllers/LikeCommentTreeController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, likeCommentTreeController.store);
export default router;

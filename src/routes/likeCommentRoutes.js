import { Router } from "express";

import likeCommentController from "../controllers/LikeCommentController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, likeCommentController.store);
export default router;

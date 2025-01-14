import { Router } from "express";

import likePostController from "../controllers/LikePostController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, likePostController.store);
router.get("/:postId", loginRequired, likePostController.index);

export default router;

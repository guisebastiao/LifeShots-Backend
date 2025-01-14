import { Router } from "express";

import followController from "../controllers/FollowController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, followController.store);
router.get("/:userId", loginRequired, followController.index);

export default router;

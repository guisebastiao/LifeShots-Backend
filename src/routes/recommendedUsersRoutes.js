import { Router } from "express";

import recommendedUserController from "../controllers/RecommendedUserController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, recommendedUserController.index);

export default router;

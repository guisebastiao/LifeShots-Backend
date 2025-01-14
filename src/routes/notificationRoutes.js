import { Router } from "express";

import notificationController from "../controllers/NotificationController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, notificationController.index);

export default router;

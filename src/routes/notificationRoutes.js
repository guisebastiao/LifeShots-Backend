import { Router } from "express";

import notificationController from "../controllers/NotificationController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, notificationController.index);
router.put("/", loginRequired, notificationController.update);
router.delete("/", loginRequired, notificationController.delete);

export default router;

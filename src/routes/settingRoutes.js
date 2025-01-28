import { Router } from "express";

import settingController from "../controllers/SettingController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, settingController.show);
router.put("/", loginRequired, settingController.update);

export default router;

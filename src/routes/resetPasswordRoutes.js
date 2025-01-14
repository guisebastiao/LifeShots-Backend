import { Router } from "express";

import resetPasswordController from "../controllers/ResetPasswordController";
import { validateRules, resetPasswordValidate } from "../middlewares/resetPasswordValidate";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, resetPasswordController.store);
router.put("/:token", loginRequired, validateRules, resetPasswordValidate, resetPasswordController.update);

export default router;

import { Router } from "express";

import resetPasswordController from "../controllers/ResetPasswordController";
import {
  validateRules,
  resetPasswordValidate,
} from "../middlewares/resetPasswordValidate";

const router = new Router();

router.post("/", resetPasswordController.store);
router.put(
  "/:token",
  validateRules,
  resetPasswordValidate,
  resetPasswordController.update
);

export default router;

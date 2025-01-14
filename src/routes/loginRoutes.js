import { Router } from "express";

import loginController from "../controllers/LoginController";
import { validateRules, loginValidate } from "../middlewares/loginValidate";

const router = new Router();

router.post("/", validateRules, loginValidate, loginController.store);

export default router;

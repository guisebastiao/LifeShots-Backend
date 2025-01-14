import { Router } from "express";

import registerController from "../controllers/RegisterController";
import { validateRules, registerValidate } from "../middlewares/registerValidate";

const router = new Router();

router.post("/", validateRules, registerValidate, registerController.store);

export default router;

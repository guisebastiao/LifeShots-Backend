import { Router } from "express";

import activeLoginController from "../controllers/ActiveLoginController";

const router = new Router();

router.post("/", activeLoginController.store);

export default router;

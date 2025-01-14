import { Router } from "express";

import activeAccountController from "../controllers/ActiveAccountController";

const router = new Router();

router.post("/", activeAccountController.store);

export default router;

import { Router } from "express";

import statusController from "../controllers/StatusController";

const router = new Router();

router.get("/", statusController.show);

export default router;

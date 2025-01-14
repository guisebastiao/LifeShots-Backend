import { Router } from "express";

import blockController from "../controllers/BlockController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, blockController.store);
router.get("/", loginRequired, blockController.index);

export default router;

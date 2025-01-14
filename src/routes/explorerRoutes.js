import { Router } from "express";

import explorerController from "../controllers/ExplorerController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, explorerController.index);

export default router;

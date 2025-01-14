import { Router } from "express";

import postImageController from "../controllers/PostImageController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.delete("/", loginRequired, postImageController.delete);

export default router;

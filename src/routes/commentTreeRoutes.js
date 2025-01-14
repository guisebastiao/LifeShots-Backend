import { Router } from "express";

import commentTreeController from "../controllers/CommentTreeController";
import { validateRules, commentValidate } from "../middlewares/commentValidate";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, validateRules, commentValidate, commentTreeController.store);
router.get("/:commentId", loginRequired, commentTreeController.index);
router.put("/:commentTreeId", loginRequired, validateRules, commentValidate, commentTreeController.update);
router.delete("/", loginRequired, commentTreeController.delete);

export default router;

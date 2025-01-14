import { Router } from "express";

import commentPostController from "../controllers/CommentPostController";
import { validateRules, commentValidate } from "../middlewares/commentValidate";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", loginRequired, validateRules, commentValidate, commentPostController.store);
router.get("/:postId", loginRequired, commentPostController.index);
router.put("/:commentId", loginRequired, validateRules, commentValidate, commentPostController.update);
router.delete("/", loginRequired, commentPostController.delete);

export default router;

import { Router } from "express";

import userController from "../controllers/UserController";
import { validateRules, userValidate } from "../middlewares/userValidate";
import { uploadProfilePicture } from "../middlewares/multerProfilePicture";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:userId", loginRequired, userController.show);
router.put("/", loginRequired, validateRules, userValidate, uploadProfilePicture, userController.update);
router.delete("/", loginRequired, userController.delete);

export default router;

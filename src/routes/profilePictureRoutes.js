import { Router } from "express";

import profilePictureController from "../controllers/ProfilePictureController";
import { uploadProfilePicture } from "../middlewares/multerProfilePicture";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post(
  "/",
  loginRequired,
  uploadProfilePicture,
  profilePictureController.store
);
router.get("/", loginRequired, profilePictureController.show);
router.delete("/", loginRequired, profilePictureController.delete);

export default router;

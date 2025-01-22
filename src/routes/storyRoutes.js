import { Router } from "express";

import storyController from "../controllers/StoryController";
import {
  validateRules,
  storyValidate,
  editStoryValidate,
} from "../middlewares/storyValidate";
import { uploadStoryImages } from "../middlewares/multerStoryImages";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post(
  "/",
  loginRequired,
  uploadStoryImages,
  validateRules,
  storyValidate,
  storyController.store
);
router.get("/", loginRequired, storyController.show);
router.get("/all/", loginRequired, storyController.index);
router.put(
  "/:storyId",
  loginRequired,
  uploadStoryImages,
  validateRules,
  editStoryValidate,
  storyController.update
);
router.delete("/", loginRequired, storyController.delete);

export default router;

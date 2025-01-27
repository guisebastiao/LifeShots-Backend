import { Router } from "express";

import postController from "../controllers/PostController";
import {
  validateRules,
  postValidate,
  editPostValidate,
} from "../middlewares/postValidate";
import { uploadPostsImages } from "../middlewares/multerPostImages";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post(
  "/",
  loginRequired,
  uploadPostsImages,
  validateRules,
  postValidate,
  postController.store
);
router.get("/:postId", loginRequired, postController.show);
router.get("/all/:userId", loginRequired, postController.index);
router.put(
  "/:postId",
  loginRequired,
  uploadPostsImages,
  validateRules,
  editPostValidate,
  postController.update
);
router.delete("/:id", loginRequired, postController.delete);

export default router;

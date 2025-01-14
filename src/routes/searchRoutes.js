import { Router } from "express";

import searchController from "../controllers/SearchController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, searchController.index);

export default router;

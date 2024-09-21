import {Router} from "express";

import userRoute from "./userRoute.js";
import memoRoute from "./memoRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/memo", memoRoute);

export default router;
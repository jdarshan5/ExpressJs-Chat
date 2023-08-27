import { Router } from "express";

import User from '../../controllers/user/index.ts';

import AuthMiddleware from "../../middlewares/authenticate.ts";

const router = Router();

router.use(AuthMiddleware.isAuthenticated);

router.get('', User.getUser);

export default router;
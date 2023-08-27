import { Router } from "express";

import Auth from '../../controllers/auth/index.ts';

const router = Router({
  caseSensitive: undefined,
  mergeParams: undefined,
  strict: undefined,
});

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Auth endpoint',
  });
});

router.post('/register', Auth.register);

router.post('/login', Auth.login);

export default router;
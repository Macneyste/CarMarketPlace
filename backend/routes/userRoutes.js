import express from 'express';
import { signupUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'User route is working',
  });
});

router.post('/signup', signupUser);

export default router;

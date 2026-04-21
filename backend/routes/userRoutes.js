import express from 'express';
import {
  googleAuthUser,
  signinUser,
  signupUser,
  updateUserAvatar,
  updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'User route is working',
  });
});

router.post('/signup', signupUser);
router.post('/signin', signinUser);
router.post('/google', googleAuthUser);
router.patch('/profile', updateUserProfile);
router.patch('/profile-image', updateUserAvatar);

export default router;

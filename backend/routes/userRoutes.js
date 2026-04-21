import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'User route is working',
  });
});

export default router;

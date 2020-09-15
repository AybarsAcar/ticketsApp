import express from 'express';
import { currentUser } from '@aybars-proj/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

// exports
export { router as currentUserRouter };

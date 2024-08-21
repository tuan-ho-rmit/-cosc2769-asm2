import express from 'express';
import auth from '../middleware/auth';
import { acceptFriendRequest } from '../controllers/friendController';

const router = express.Router();

router.post('/accept', auth, acceptFriendRequest);

module.exports = router;
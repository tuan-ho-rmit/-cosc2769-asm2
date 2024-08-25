import express from 'express';
import { createGroup } from '../controllers/groupController.js';
import { getGroups, deleteGroup, joinGroup, getRequestedGroups } from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);

// 그룹 조회 라우트
router.get('/', getGroups);

// 그룹 삭제 라우트
router.delete('/:id', deleteGroup);
router.post('/join-group', joinGroup);
router.get('/requested-groups', getRequestedGroups);

export default router;

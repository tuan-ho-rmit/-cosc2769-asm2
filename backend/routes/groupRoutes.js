import express from 'express';
import { createGroup } from '../controllers/groupController.js';
import { getGroups, deleteGroup, joinGroup, getRequestedGroups , getJoinRequests,acceptMember,rejectMember, } from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);

// 그룹 조회 라우트
router.get('/', getGroups);

// 그룹 삭제 라우트
router.delete('/:id', deleteGroup);
router.post('/join-group', joinGroup);
router.get('/requested-groups', getRequestedGroups);
router.get('/join-requests', getJoinRequests); // 조인 요청 가져오기
router.post('/accept-member', acceptMember);   // 멤버 추가
router.delete('/join-requests/:requestId', rejectMember); // 요청 삭제

export default router;

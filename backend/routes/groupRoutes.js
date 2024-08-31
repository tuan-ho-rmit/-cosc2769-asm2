import express from 'express';
import { approveGroupRequest, createGroup, getListGroup, rejectGroupRequest } from '../controllers/groupController.js';
import { getGroups, deleteGroup, joinGroup, getRequestedGroups , getJoinRequests,acceptMember,rejectMember, getGroupsForMember, removeMemberFromGroup, getGroupById, getGroupsForUser, getMembersOfGroup, getGroupByName  } from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);

// 그룹 조회 라우트
router.get('/', getGroups);

// 그룹 삭제 라우트
router.get('/list', getListGroup)
router.get('/member-groups', getGroupsForUser);
router.get('/:groupName/members', getMembersOfGroup);
router.post('/join-group', joinGroup);
router.get('/requested-groups', getRequestedGroups);
router.get('/join-requests', getJoinRequests); // 조인 요청 가져오기
router.post('/accept-member', acceptMember);   // 멤버 추가
router.delete('/join-requests/:requestId', rejectMember); // 요청 삭제
router.get('/', getGroupsForMember); // 멤버가 포함된 그룹 가져오기
router.post('/remove-member', removeMemberFromGroup); // 그룹에서 멤버 제거
router.get('/get-group-id/:groupName', getGroupByName);
router.get('/:id', getGroupById); 
router.delete('/:id', deleteGroup);
router.put('/approve/:groupId', approveGroupRequest)
router.put('/reject/:groupId', rejectGroupRequest)

export default router;

import express from 'express';
import { approveGroupRequest, createGroup, getListGroup, rejectGroupRequest } from '../controllers/groupController.js';
import { getGroups, deleteGroup, joinGroup, getRequestedGroups, getJoinRequests, acceptMember, rejectMember, getGroupsForMember, removeMemberFromGroup, getGroupById, getGroupsForUser, getMembersOfGroup, getGroupByName, getGroupPosts, createGroupPost, suspendMember, unsuspendMember, getSuspendedUsers, deletePost, getManageGroupPosts, getGroupMembers  } from '../controllers/groupController.js';
import { verifyAdmin } from '../util/verifyToken.js';

const router = express.Router();

router.post('/create', createGroup);

// 그룹 조회 라우트
router.get('/', getGroups);

// 그룹 삭제 라우트
router.get('/list', getListGroup)
router.get('/member-groups', getGroupsForUser);
router.get('/:groupName/members', getMembersOfGroup);
router.get('/members/:groupId', getGroupMembers);
router.post('/join-group', joinGroup);
router.get('/requested-groups', getRequestedGroups);
router.post('/suspend-member', suspendMember);   // 멤버 서스펜드
router.delete('/unsuspend-member/:groupId/:userId', unsuspendMember); // 멤버 언서스펜드
router.get('/suspended-users/:groupId', getSuspendedUsers);  // 서스펜드된 유저 리스트 가져오기
router.get('/join-requests', getJoinRequests); // 조인 요청 가져오기
router.post('/accept-member', acceptMember);   // 멤버 추가
router.delete('/join-requests/:requestId', rejectMember); // 요청 삭제
router.get('/', getGroupsForMember); // 멤버가 포함된 그룹 가져오기
router.post('/remove-member', removeMemberFromGroup); // 그룹에서 멤버 제거
router.get('/get-group-id/:groupName', getGroupByName);
router.delete('/:id', deleteGroup);
router.put('/approve/:groupId',  approveGroupRequest)
router.put('/reject/:groupId', verifyAdmin, rejectGroupRequest)
router.get('/:id', getGroupById);
// 특정 그룹의 모든 포스트 가져오기
router.get('/:groupId/posts', getGroupPosts);   // 기존 groupId 기반 경로
router.get('/manage-group-posts/:groupName', getManageGroupPosts);
router.delete('/posts/:id', deletePost);
// 특정 그룹에 포스트 추가하기
router.post('/:groupId/posts', createGroupPost);

export default router;

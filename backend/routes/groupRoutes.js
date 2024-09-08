import express from 'express';
import { approveGroupRequest, createGroup, getListGroup, rejectGroupRequest } from '../controllers/groupController.js';
import { getGroups, deleteGroup, joinGroup, getRequestedGroups, getJoinRequests, acceptMember, rejectMember, getGroupsForMember, removeMemberFromGroup, getGroupById, getGroupsForUser, getMembersOfGroup, getGroupByName, getGroupPosts, createGroupPost, suspendMember, unsuspendMember, getSuspendedUsers, deletePost, getManageGroupPosts, getGroupMembers  } from '../controllers/groupController.js';
import { verifyAdmin } from '../util/verifyToken.js';

const router = express.Router();

router.post('/create', createGroup);

// group search route
router.get('/', getGroups);

// routes
router.get('/list', getListGroup)
router.get('/member-groups', getGroupsForUser);
router.get('/:groupName/members', getMembersOfGroup);
router.get('/members/:groupId', getGroupMembers);
router.post('/join-group', joinGroup);
router.get('/requested-groups', getRequestedGroups);
router.post('/suspend-member', suspendMember);   
router.delete('/unsuspend-member/:groupId/:userId', unsuspendMember); 
router.get('/suspended-users/:groupId', getSuspendedUsers);  
router.get('/join-requests', getJoinRequests); 
router.post('/accept-member', acceptMember);   
router.delete('/join-requests/:requestId', rejectMember); 
router.get('/', getGroupsForMember); 
router.post('/remove-member', removeMemberFromGroup); 
router.get('/get-group-id/:groupName', getGroupByName);
router.delete('/:id', deleteGroup);
router.put('/approve/:groupId',  approveGroupRequest)
router.put('/reject/:groupId', verifyAdmin, rejectGroupRequest)
router.get('/:id', getGroupById);
// get all posts for specific group
router.get('/:groupId/posts', getGroupPosts);   
router.get('/manage-group-posts/:groupName', getManageGroupPosts);
router.delete('/posts/:id', deletePost);
// add post for specific group
router.post('/:groupId/posts', createGroupPost);

export default router;

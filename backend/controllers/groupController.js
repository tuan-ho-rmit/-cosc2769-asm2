import mongoose from 'mongoose';
import Group from '../models/Group.js';
import GroupJoinRequest from '../models/GroupJoinRequest.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { createNoti } from "../services/notiService.js";


export const createGroup = async (req, res) => {
  try {
    console.log("Request body:", req.body);  // check for req body

    if (!req.session.user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const { groupName, description, avatar, visibility, createdBy } = req.body;

    console.log("Created by ID:", createdBy);  // check createdBy is retreived well

    const existingGroup = await Group.findOne({ groupName });
    if (existingGroup) {
      return res.status(400).json({ message: 'A group with this name already exists. Please choose a different name.' });
    }

    // user object id = createdBy
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newGroup = new Group({
      groupName,
      description,
      avatar,
      status: 'pending',
      createdBy: user._id,  // save as object id
      visibility,
      members: [user._id],  // add users obj id to members array
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};


export const getListGroup = async (req, res) => {
  try {
    let { page, limit, status, search, searchType, role, createdBy } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (search) {
      if (searchType === "createdBy") {
        const userFilter = {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        };
        const users = await User.find(userFilter);
        const userIds = users.map((user) => user._id);
        filter.createdBy = { $in: userIds };
      } else if (searchType === "groupName") {
        const regex = new RegExp(search, "i");
        filter.$or = [{ groupName: regex }];
      } else {
        const regex = new RegExp(search, "i");
        filter.$or = [{ groupName: regex }];
      }
    }

    const totalCount = await Group.countDocuments();
    const totalPages = (await Group.countDocuments(filter)) / limit;
    const groups = await Group.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate("createdBy", "email firtname lastname")
      .exec();
    ;

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalPages),
      totalCount: totalCount,
      message: "Successfully fetched groups",
      data: groups,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};



// Approve group request
export const approveGroupRequest = async (req, res) => {
  console.log("🚀 ~ approveGroupRequest ~ req:", req.params)
  const id = req.params.groupId;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      {
        $set: { status: "active" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully approve group request",
      data: updatedGroup,
    });

    createNoti(
      'Your Group Creation Request has been approved',
      [updatedGroup.createdBy],
      'unread',
      `/groupmain${id}`
    )

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to approve group request. Try again",
    });
  }
};

// Reject group request
export const rejectGroupRequest = async (req, res) => {
  const id = req.params.groupId;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      {
        $set: { status: "inactive" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully reject group request",
      data: updatedGroup,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to reject group request. Try again",
    });
  }
};

// GroupController.js

export const getGroups = async (req, res) => {
  const { status } = req.query; // retrieve status from query

  try {
    let groups;

    // status 값이 'active'일 때만 필터링 적용
    if (status === 'active') {
      groups = await Group.find({ status: 'active' });
    } else {
      groups = await Group.find(); // if there is no status filter output all groups
    }

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
  }
};


export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete group', error: err.message });
  }
};

export const joinGroup = async (req, res) => {
  const { groupName } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'User is not logged in' });
  }

  const userEmail = req.session.user.email;

  try {
    // check if already same join excists
    const existingRequest = await GroupJoinRequest.findOne({ userEmail, groupName });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested to join this group.' });
    }

    const newRequest = new GroupJoinRequest({
      userEmail: userEmail,
      groupName: groupName,
      requestedAt: new Date(),
      status: 'pending',
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({ message: 'Group join request submitted successfully', request: savedRequest });

    // notifying the group owner on new group join rq TODO: unfinished
    const group = await Group.findOne({ groupName: groupName })
    console.log("🚀 ~ joinGroup ~ group:", group)
    createNoti(
      'You received a New Group Join Request',
      [group.createdBy],
      'unread',
      `/groupmembermanagement/${groupName}`
    )

  } catch (error) {
    console.error('Error creating group join request:', error);
    res.status(500).json({ message: 'Failed to create group join request', error: error.message });
  }
};

export const getRequestedGroups = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const requests = await GroupJoinRequest.find({ userEmail: email });
    const groupNames = requests.map(req => req.groupName);
    res.status(200).json(groupNames);
  } catch (error) {
    console.error('Error fetching requested groups:', error);
    res.status(500).json({ message: 'Failed to fetch requested groups', error: error.message });
  }
};

export const getJoinRequests = async (req, res) => {
  const { groupName } = req.query;

  try {
    const requests = await GroupJoinRequest.find({ groupName, status: 'pending' });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ message: 'Failed to fetch join requests', error: error.message });
  }
};

export const acceptMember = async (req, res) => {
  const { groupName, userEmail } = req.body;

  try {
    // find specific group
    const group = await Group.findOne({ groupName });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // find users obj id using users email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // add users id without duplicate
    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
      await group.save();
    } else {
      return res.status(400).json({ message: 'User is already a member of the group' });
    }

    // remove specific join
    const request = await GroupJoinRequest.findOneAndDelete({ groupName, userEmail, status: 'pending' });
    if (!request) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    createNoti(
      'You have successfully joined a group',
      [user._id],
      'unread',
      `/groupmain/${group.id}`
    )

    res.status(200).json({ message: 'Member accepted and added to group' });
  } catch (error) {
    console.error('Error accepting member:', error);
    res.status(500).json({ message: 'Failed to accept member', error: error.message });
  }
};


export const rejectMember = async (req, res) => {
  const { requestId } = req.params;

  try {
    // remove specific join request
    const result = await GroupJoinRequest.findByIdAndDelete(requestId);
    if (!result) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Join request rejected and deleted' });
  } catch (error) {
    console.error('Error rejecting member:', error);
    res.status(500).json({ message: 'Failed to reject member', error: error.message });
  }
};

export const getGroupsForMember = async (req, res) => {
  const { memberId } = req.query;

  try {
    const groups = await Group.find({ members: memberId });
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups for member:', error);
    res.status(500).json({ message: 'Failed to fetch groups for member', error: error.message });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  // check Obj Id is available to use
  if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid groupId or userId' });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // remove the member's object Id from the group's members array
    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();

    res.status(200).json({ message: 'Member removed from group successfully' });
  } catch (error) {
    console.error('Error removing member from group:', error);
    res.status(500).json({ message: 'Failed to remove member from group', error: error.message });
  }
};



export const getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Failed to fetch group', error: error.message });
  }
};

export const getGroupsForUser = async (req, res) => {
  const { memberId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return res.status(400).json({ message: 'Invalid memberId format' });
  }

  try {
    // find all groups that the specific user is participating using memberId
    const groups = await Group.find({ members: new mongoose.Types.ObjectId(memberId) });
    res.status(200).json(groups); // return groups
  } catch (error) {
    console.error('Error fetching groups for member:', error);
    res.status(500).json({ message: 'Failed to fetch groups for member', error: error.message });
  }
};

// return all members participating specific group
export const getMembersOfGroup = async (req, res) => {
  const { groupName } = req.params;

  try {
    const group = await Group.findOne({ groupName });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const members = await User.find({ _id: { $in: group.members } });
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members of group:', error);
    res.status(500).json({ message: 'Failed to fetch members of group', error: error.message });
  }
};


export const getGroupByName = async (req, res) => {
  const { groupName } = req.params;

  try {
    const group = await Group.findOne({ groupName }); // Find the group by name
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // return only the object Id of the group
    res.status(200).json({ _id: group._id });
  } catch (error) {
    console.error('Error fetching group by name:', error);
    res.status(500).json({ message: 'Failed to fetch group', error: error.message });
  }
};


// group post
// return all post for specific group
export const getGroupPosts = async (req, res) => {
  try {
    const { groupId } = req.params;

    // find for post by group id
    const posts = await Post.find({ groupId })
      .sort({ date: -1 })
      .populate('author', 'firstName lastName avatar')
      .populate('userProfile', 'avatar')
      .populate('groupId', 'groupName avatar'); 

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching group posts:', error);
    res.status(500).json({ message: "Error fetching group posts", error });
  }
};

export const getManageGroupPosts = async (req, res) => {
  try {
    const { groupName } = req.params;

    // find group by group Name
    const group = await Group.findOne({ groupName: groupName });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // find fosts by group Id
    const posts = await Post.find({ groupId: group._id })
      .sort({ date: -1 })
      .populate('author', 'firstName lastName avatar')
      .populate('userProfile', 'avatar')
      .populate('groupId', 'groupName avatar');  

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching group posts for management:', error);
    res.status(500).json({ message: "Error fetching group posts for management", error });
  }
};


export const createGroupPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, images } = req.body;

    
    if (!req.session.user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const newPost = new Post({
      content,
      userProfile: req.session.user.id,
      userId: req.session.user.id,
      author: req.session.user.id,
      images,
      date: new Date(),
      groupId,
      isGroupPost: true,  // set as group post
    });

    await newPost.save();

    // call newly generated post and return group with group name and avatar
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'firstName lastName avatar')
      .populate('userProfile', 'avatar')
      .populate('groupId', 'groupName avatar'); 

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating group post:', error);
    res.status(500).json({ message: "Error creating group post", error });
  }
};

// suspend
export const suspendMember = async (req, res) => {
  const { groupId, userId, userEmail } = req.body;

  try {
    console.log('Group ID:', groupId);  
    console.log('User ID:', userId);   
    console.log('User Email:', userEmail); 

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingSuspend = await Suspend.findOne({ group: groupId, userId });
    if (existingSuspend) {
      return res.status(400).json({ message: 'User is already suspended' });
    }

    const newSuspend = new Suspend({ group: groupId, userId, userEmail });
    await newSuspend.save();

    res.status(201).json({ message: 'User suspended successfully', suspend: newSuspend });
  } catch (error) {
    console.error('Error suspending member:', error);  // check for error
    res.status(500).json({ message: 'Failed to suspend member', error: error.message });
  }
};


// unsuspend
export const unsuspendMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    const suspend = await Suspend.findOneAndDelete({ group: groupId, userId });

    if (!suspend) {
      return res.status(404).json({ message: 'Suspension record not found' });
    }

    res.status(200).json({ message: 'User unsuspended successfully' });
  } catch (error) {
    console.error('Error unsuspending member:', error);
    res.status(500).json({ message: 'Failed to unsuspend member', error: error.message });
  }
};

// get list of suspended user
export const getSuspendedUsers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const suspendedUsers = await Suspend.find({ group: groupId });
    res.status(200).json(suspendedUsers);
  } catch (error) {
    console.error('Error fetching suspended users:', error);
    res.status(500).json({ message: 'Failed to fetch suspended users', error: error.message });
  }
};

//delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};


export const getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    // find group and return array of members
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // return members user info using group members array
    const memberDetails = await Promise.all(
      group.members.map(async (memberId) => {
        const user = await User.findById(memberId, 'firstName lastName email avatar'); 
        if (user) {
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,  
            email: user.email,    
            _id: user._id         
          };
        } else {
          return null;  // null when there are no users
        }
      })
    );

    // filter for only valid users
    const validMembers = memberDetails.filter(member => member !== null);

    // return user info
    res.status(200).json(validMembers);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ message: 'Error fetching group members' });
  }
};

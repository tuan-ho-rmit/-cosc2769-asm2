import Group from '../models/Group.js';
import GroupJoinRequest from '../models/GroupJoinRequest.js';

export const createGroup = async (req, res) => {
  try {
    // 세션에 저장된 유저 정보 확인
    if (!req.session.user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const { groupName, description, avatar, visibility } = req.body;

    const newGroup = new Group({
      groupName,
      description,
      avatar,
      status: 'pending',
      createdBy: req.session.user.email, // 세션에서 이메일을 가져와서 저장
      visibility,
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};


export const getGroups = async (req, res) => {
    try {
      const groups = await Group.find();
      res.status(200).json(groups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch groups', error: err.message });
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
      // 이미 조인 요청이 있는지 확인
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
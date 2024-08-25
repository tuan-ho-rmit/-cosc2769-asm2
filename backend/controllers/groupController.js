import Group from '../models/Group.js';

export const createGroup = async (req, res) => {
  try {
    const { groupName, description, avatar, visibility } = req.body;

    const newGroup = new Group({
      groupName,
      description,
      avatar,
      status: 'pending',
      createdBy: null,
      visibility, // visibility 필드 추가
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

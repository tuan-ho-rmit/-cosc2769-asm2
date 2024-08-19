import Group from '../models/Group.js';

export const createGroup = async (req, res) => {
  try {
    const { groupName, description, avatar } = req.body;

    const newGroup = new Group({
      groupName,
      description,
      avatar,
      status: 'pending', // 기본 상태는 pending
      createdBy: null, // 현재는 세션이 없으므로 null로 설정
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};


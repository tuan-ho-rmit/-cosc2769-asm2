import { DataTypes } from 'sequelize';
import sequelize from '../config/db'

const FriendRequest = sequelize.define('FriendRequest', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  },
});

module.exports = FriendRequest;

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
      type: DataTypes.ENUM('pending', 'accepted', 'declined'),
      defaultValue: 'pending',
    },
  });
  
  module.exports = FriendRequest;
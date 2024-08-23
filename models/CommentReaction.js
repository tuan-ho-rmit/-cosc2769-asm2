import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const CommentReaction = sequelize.define('CommentReaction', {
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Like', 'Love', 'Haha', 'Angry'),
      allowNull: false,
    },
  });
  
  module.exports = CommentReaction;
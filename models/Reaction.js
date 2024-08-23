import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const Reaction = sequelize.define('Reaction', {
    postId: {
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
  
  module.exports = Reaction;
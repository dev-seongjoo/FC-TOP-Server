const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Goals = sequelize.define("Goals", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  QUARTER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PLAYER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  GOAL_TIME: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Goals;

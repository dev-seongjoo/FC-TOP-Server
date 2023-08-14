const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Goals = sequelize.define("Goals", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  MATCH_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PLAYER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ATTENDANCE_LIMIT: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ATTENDANCE_TIME: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ATTENDANCE_STATUS: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Goals;

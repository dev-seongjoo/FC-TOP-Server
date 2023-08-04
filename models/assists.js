const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Assists = sequelize.define("Assists", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  GOAL_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PLAYER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ASSIST_TIME: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Assists;

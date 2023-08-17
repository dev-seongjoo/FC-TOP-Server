const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Attendances = sequelize.define("Attendances", {
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
  ATTENDANCE_TIME: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ATTENDANCE_STATUS: {
    type: DataTypes.ENUM("출석", "지각", "결석"),
    allowNull: false,
  },
});

module.exports = Attendances;

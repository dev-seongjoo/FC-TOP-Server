const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Matches = sequelize.define("Matches", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  DATE: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  CHECK_LATE: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  LOCATION: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  OPPONENT: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NOTES: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Matches;

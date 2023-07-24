const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Locations = require("./locations");

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
  DURATION: {
    type: DataTypes.STRING,
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
  CUSTOM_LOCATION: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CUSTOM_LOCATION_ADDRESS: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  LOCATION_POSITION: {
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

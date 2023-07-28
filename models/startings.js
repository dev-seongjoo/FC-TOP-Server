const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Startings = sequelize.define("Startings", {
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
  POSITION: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Startings;

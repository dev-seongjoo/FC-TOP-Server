const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Lps = sequelize.define("Lps", {
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
  LP_TIME: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Lps;

const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Subs = sequelize.define("Subs", {
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
  SUB: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SUB_TIME: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Subs;

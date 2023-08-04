const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Assists = require("./assists");

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

Goals.hasMany(Assists, {
  foreignKey: "QUARTER_ID",
});
Assists.belongsTo(Goals, {
  foreignKey: "QUARTER_ID",
  onDelete: "CASCADE",
});

module.exports = Goals;

const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Startings = require("./startings");

const Quarters = sequelize.define("Quarters", {
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
  QUARTER: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FORMATION: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  QUARTER_VIDEO: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Quarters.hasMany(Startings, {
  foreignKey: "QUARTER_ID",
});
Startings.belongsTo(Quarters, {
  foreignKey: "QUARTER_ID",
  onDelete: "CASCADE",
});

module.exports = Quarters;

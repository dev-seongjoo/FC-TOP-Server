const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Startings = require("./startings");
const Goals = require("./goals");
const Assists = require("./assists");
const Subs = require("./subs");
const Lps = require("./lps");

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
  RECORD: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  FULL_TIME: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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

Quarters.hasMany(Goals, {
  foreignKey: "QUARTER_ID",
});
Goals.belongsTo(Quarters, {
  foreignKey: "QUARTER_ID",
  onDelete: "CASCADE",
});

Quarters.hasMany(Subs, {
  foreignKey: "QUARTER_ID",
});
Subs.belongsTo(Quarters, {
  foreignKey: "QUARTER_ID",
  onDelete: "CASCADE",
});

Quarters.hasMany(Lps, {
  foreignKey: "QUARTER_ID",
});
Lps.belongsTo(Quarters, {
  foreignKey: "QUARTER_ID",
  onDelete: "CASCADE",
});

module.exports = Quarters;

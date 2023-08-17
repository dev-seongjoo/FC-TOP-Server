const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Locations = require("./locations");
const Votes = require("./votes");
const Attendances = require("./attendances");

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

Matches.hasMany(Votes, {
  foreignKey: "MATCH_ID",
});
Votes.belongsTo(Matches, {
  foreignKey: "MATCH_ID",
  onDelete: "CASCADE",
});

Matches.hasMany(Attendances, {
  foreignKey: "MATCH_ID",
});
Attendances.belongsTo(Matches, {
  foreignKey: "MATCH_ID",
});

module.exports = Matches;

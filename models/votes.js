const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Matches = require("./matches");
const Players = require("./players");

const Votes = sequelize.define("Votes", {
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
  ATTENDANCE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Votes.belongsTo(Matches, { foreignKey: "MATCH_ID", onDelete: "CASCADE" });
Matches.hasMany(Votes, { foreignKey: "MATCH_ID" });

Votes.belongsTo(Players, { foreignKey: "PLAYER_ID" });
Players.hasMany(Votes, { foreignKey: "PLAYER_ID" });

module.exports = Votes;

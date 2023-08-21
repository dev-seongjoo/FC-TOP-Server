const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Votes = require("./votes");
const Goals = require("./goals");
const Assists = require("./assists");
const Subs = require("./subs");
const Lps = require("./lps");
const Startings = require("./startings");
const Attendances = require("./attendances");

const Players = sequelize.define("Players", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  LOGIN_ID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  KOR_NM: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ENG_NM: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PHONE: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  POSTCODE: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ADDRESS: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BIRTHDAY_YMD: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  POSITION_FIRST: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  POSITION_SECOND: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  POSITION_THIRD: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FOOT: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ROLE: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  REFRESH_TOKEN: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Players.hasMany(Votes, {
  foreignKey: "PLAYER_ID",
});
Votes.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

Players.hasMany(Startings, {
  foreignKey: "PLAYER_ID",
});
Startings.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

Players.hasMany(Goals, {
  foreignKey: "PLAYER_ID",
});
Goals.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

Players.hasMany(Assists, {
  foreignKey: "PLAYER_ID",
});
Assists.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

Players.hasMany(Subs, {
  foreignKey: "PLAYER_ID",
});
Subs.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

Players.hasMany(Lps, {
  foreignKey: "PLAYER_ID",
});
Lps.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

Players.hasMany(Attendances, {
  foreignKey: "PLAYER_ID",
});
Attendances.belongsTo(Players, {
  foreignKey: "PLAYER_ID",
});

module.exports = Players;

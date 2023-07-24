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
    references: {
      // 외래키 설정
      model: Matches, // 참조하는 테이블의 모델
      key: "ID", // 참조하는 테이블의 기본키
    },
  },
  PLAYER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      // 외래키 설정
      model: Players, // 참조하는 테이블의 모델
      key: "ID", // 참조하는 테이블의 기본키
    },
  },
  ATTENDANCE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Votes.belongsTo(Players, { foreignKey: "PLAYER_ID" });
Players.hasMany(Votes, { foreignKey: "PLAYER_ID" });

module.exports = Votes;

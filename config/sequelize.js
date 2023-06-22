// config/sequelize.js

const { Sequelize } = require("sequelize");
const config = require("./config"); // Sequelize 설정 가져오기

const env = process.env.NODE_ENV || "development";
const sequelizeConfig = config[env];

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
  }
);

module.exports = sequelize;

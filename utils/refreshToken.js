const Users = require("../models/users");

// refreshToken을 데이터베이스에 저장하는 함수
async function saveRefreshToken(userId, refreshToken) {
  await Users.update({ refreshToken }, { where: { USER_ID: userId } });
}

// 데이터베이스에서 refreshToken을 조회하는 함수
async function getRefreshToken(userId) {
  const user = await Users.findOne({ where: { USER_ID: userId } });
  return user.refreshToken;
}

module.exports = {
  saveRefreshToken,
  getRefreshToken,
};

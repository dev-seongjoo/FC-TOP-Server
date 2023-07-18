const Players = require("../models/players");

// refreshToken을 데이터베이스에 저장하는 함수
async function saveRefreshToken(userId, refreshToken) {
  await Players.update(
    { REFRESH_TOKEN: refreshToken },
    { where: { LOGIN_ID: userId } }
  );
}

// 데이터베이스에서 refreshToken을 조회하는 함수
async function getRefreshToken(userId) {
  const player = await Players.findOne({ where: { LOGIN_ID: userId } });
  return player.refreshToken;
}

module.exports = {
  saveRefreshToken,
  getRefreshToken,
};

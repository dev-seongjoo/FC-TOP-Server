const jwt = require("jsonwebtoken");

// 인증 미들웨어
const isLoggedIn = (req, res, next) => {
  // 클라이언트로부터 토큰을 받습니다.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 토큰이 없는 경우 클라이언트에 401 에러를 반환합니다.
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // 토큰이 잘못되었거나 만료된 경우 클라이언트에 403 에러를 반환합니다.
    if (err) return res.sendStatus(403);

    // 토큰이 확인되면 request 객체에 user를 추가하고 다음 미들웨어로 넘어갑니다.
    req.user = user;
    next();
  });
};

const isNotLoggedIn = (req, res, next) => {
  // 클라이언트로부터 토큰을 받습니다.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 토큰이 있는 경우 클라이언트에 401 에러를 반환합니다.
  if (token != null) return res.sendStatus(401);

  next();
};

module.exports = { isLoggedIn, isNotLoggedIn };

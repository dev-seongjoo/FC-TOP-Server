const bcrypt = require("bcrypt");

const hashAlgo = async (password) => {
  try {
    const saltRounds = 10; // 솔트(rounds)의 수를 정의합니다. 보통 10 이상을 권장합니다.
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("비밀번호 암호화 오류:", error);
    throw error;
  }
};

module.exports = hashAlgo;

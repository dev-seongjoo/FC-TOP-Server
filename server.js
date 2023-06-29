const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const sequelize = require("./config/sequelize");
const User = require("./models/user");

const send_message = require("./controllers/send_message");

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initialize = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL 연결 성공!");
    await sequelize.sync();
    console.log("테이블 생성 완료!");
  } catch (error) {
    console.error("MySQL 연결 실패:", error);
  }
};

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

async function comparePasswords(inputPassword, hashedPassword) {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    console.error("비밀번호 비교 오류:", error);
    throw error;
  }
}

app.post("/checkDuplicatedPhone", async (req, res) => {
  const phone = req.body.phone;

  try {
    const result = await User.findOne({
      where: {
        PHONE_NO: phone,
      },
    });
    if (result) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.status(500).send("사용자 검색에 실패했습니다.");
  }
});

app.post("/sms", (req, res) => {
  console.log(req.body);
  const phone = req.body.phone;
  const code = req.body.authCode;
  send_message(phone, code);
  res.send("발송 완료");
});

app.post("/signUp", async (req, res) => {
  try {
    const birthday = req.body.year.slice(-2) + req.body.month + req.body.day;
    const inputPassword = req.body.password;
    const hashPassword = await hashAlgo(inputPassword);

    const newUser = await User.create({
      KOR_LAST_NM: req.body.korLastName,
      KOR_FIRST_NM: req.body.korFirstName,
      ENG_LAST_NM: req.body.engLastName,
      ENG_FIRST_NM: req.body.engFirstName,
      PASSWORD: hashPassword,
      PHONE_NO: req.body.phone,
      POSTCODE_NO: req.body.postCode,
      ADDRESS: req.body.address,
      BIRTHDAY_YMD: birthday,
      POSITION_FIRST: req.body.preferPositionFirst,
      POSITION_SECOND: req.body.preferPositionSecond,
      POSITION_THIRD: req.body.preferPositionThird,
      FOOT: req.body.preferFoot,
    });

    console.log("User 저장 완료:", newUser);
    res.send("전송 완료");
  } catch (error) {
    console.error("에러 발생", error);
    res.status(500).send("사용자 저장에 실패했습니다");
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const phone = req.body.phone;
    const password = req.body.password;

    const user = await User.findOne({ where: { PHONE_NO: phone } });

    if (!user) {
      return res.status(401).send("핸드폰 또는 비밀번호가 옳지 않습니다.");
    }

    const isMatch = await comparePasswords(password, user.PASSWORD);

    if (!isMatch) {
      return res.status(401).send("핸드폰 또는 비밀번호가 옳지 않습니다.");
    }

    res.send("로그인 성공");
  } catch (error) {
    console.error("로그인 에러:", error);
    res.status(500).send("로그인에 실패했습니다.");
  }
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
initialize();

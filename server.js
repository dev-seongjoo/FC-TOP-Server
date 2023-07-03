const express = require("express");
const app = express();

const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { saveRefreshToken, getRefreshToken } = require("./utils/refreshToken");

require("dotenv").config();

const sequelize = require("./config/sequelize");
const Users = require("./models/users");

const PORT = process.env.PORT || 5050;

const send_message = require("./controllers/send_message");
const hashAlgo = require("./utils/hashAlgo");

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

app.post("/checkIdDuplication", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await Users.findOne({
      where: {
        USER_ID: id,
      },
    });
    if (result) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (error) {
    return res.status(500).send("사용자 검색에 실패했습니다.");
  }
});

app.post("/checkPhoneDuplication", async (req, res) => {
  const phone = req.body.phone;
  try {
    const result = await Users.findOne({
      where: {
        PHONE_NO: phone,
      },
    });
    if (result) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (error) {
    return res.status(500).send("사용자 검색에 실패했습니다.");
  }
});

app.post("/sms", (req, res) => {
  console.log(req.body);
  const phone = req.body.phone;
  const code = req.body.authCode;
  send_message(phone, code);
  return res.send("발송 완료");
});

// 회원가입 api
app.post("/signUp", async (req, res) => {
  try {
    const birthday = req.body.year.slice(-2) + req.body.month + req.body.day;
    const inputPassword = req.body.password;
    const hashPassword = await hashAlgo(inputPassword);

    const newUser = await Users.create({
      USER_ID: req.body.id,
      USER_PASSWORD: hashPassword,
      KOR_LAST_NM: req.body.korLastName,
      KOR_FIRST_NM: req.body.korFirstName,
      ENG_LAST_NM: req.body.engLastName,
      ENG_FIRST_NM: req.body.engFirstName,
      PHONE_NO: req.body.phone,
      POSTCODE_NO: req.body.postCode,
      ADDRESS: req.body.address,
      BIRTHDAY_YMD: birthday,
      POSITION_FIRST: req.body.preferPositionFirst,
      POSITION_SECOND: req.body.preferPositionSecond,
      POSITION_THIRD: req.body.preferPositionThird,
      FOOT: req.body.preferFoot,
    });

    console.log(newUser);

    return res.send("전송 완료");
  } catch (error) {
    console.error("에러 발생", error);
    return res.status(500).send("사용자 저장에 실패했습니다");
  }
});

// 로그인 api
app.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await Users.findOne({ where: { USER_ID: id } });

    if (!user) {
      res.status(400).send("아이디 혹은 비밀번호가 잘못되었습니다.");
      return;
    }

    const result = await bcrypt.compare(password, user.USER_PASSWORD);

    if (!result) {
      return res.status(400).send("아이디 혹은 비밀번호가 잘못되었습니다.");
    }
    const accessToken = jwt.sign(
      { id: user.USER_ID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { id: user.USER_ID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // refreshToken의 만료시간을 7일로 설정
    );
    await saveRefreshToken(user.USER_ID, refreshToken); // refreshToken을 DB에 저장
    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

//
app.post("/token", async (req, res) => {
  try {
    const rToken = req.body.token;

    if (rToken == null) return res.sendStatus(401);

    const userIdFromToken = jwt.decode(rToken).id;
    const refreshTokenFromDb = await getRefreshToken(userIdFromToken);

    if (rToken !== refreshTokenFromDb) return res.sendStatus(403);

    jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1m",
        }
      );

      return res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
initialize();

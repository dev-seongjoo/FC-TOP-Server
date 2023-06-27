const express = require("express");
const cors = require("cors");
require("dotenv").config();

// const db = require("./models/index");
const sequelize = require("./config/sequelize");
const User = require("./models/user");

const send_message = require("./controllers/send_message");

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function initialize() {
  try {
    await sequelize.authenticate();
    console.log("MySQL 연결 성공!");
    await sequelize.sync();
    console.log("테이블 생성 완료!");
  } catch (error) {
    console.error("MySQL 연결 실패:", error);
  }
}

app.post("/signUp", (req, res) => {
  console.log(req.body);
  res.send("전송 완료");
});

app.post("/sms", (req, res) => {
  console.log(req.body);
  const phone = req.body.phone;
  const code = req.body.authCode;
  send_message(phone, code);
  res.send("발송 완료");
});

initialize();

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

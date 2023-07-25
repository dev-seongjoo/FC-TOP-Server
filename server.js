const express = require("express");
const app = express();

const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { saveRefreshToken, getRefreshToken } = require("./utils/refreshToken");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/auth");

require("dotenv").config();

const sequelize = require("./config/sequelize");
const { Op, Sequelize } = require("sequelize");

const PORT = process.env.PORT || 5050;

const send_message = require("./controllers/send_message");
const hashAlgo = require("./utils/hashAlgo");

const Players = require("./models/players");
const Matches = require("./models/matches");
const Locations = require("./models/locations");
const Votes = require("./models/votes");

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

// 아이디 중복 확인하기
app.post("/checkId", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await Players.findOne({
      where: {
        LOGIN_ID: id,
      },
    });
    if (result) {
      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  } catch (error) {
    return res.status(500).send("사용자 검색에 실패했습니다.");
  }
});

// 휴대폰 중복 확인하기
app.post("/checkPhoneDuplication", async (req, res) => {
  const phone = req.body.phone;
  try {
    const result = await Players.findOne({
      where: {
        PHONE: phone,
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

// 회원가입 하기
app.post("/signUp", async (req, res) => {
  try {
    const birthday = req.body.year.slice(-2) + req.body.month + req.body.day;
    const inputPassword = req.body.password;
    const hashPassword = await hashAlgo(inputPassword);

    const newUser = await Players.create({
      LOGIN_ID: req.body.id,
      PASSWORD: hashPassword,
      KOR_NM: req.body.korLastName + req.body.korFirstName,
      ENG_NM: req.body.engLastName + req.body.engFirstName,
      PHONE: req.body.phone,
      POSTCODE: req.body.postCode,
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

// 로그인 하기
app.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;
    const player = await Players.findOne({ where: { LOGIN_ID: id } });

    console.log(player);

    if (!player) {
      res.status(400).send("아이디 혹은 비밀번호가 잘못되었습니다.");
      return;
    }

    // const result = await bcrypt.compare(password, player.PASSWORD);

    // if (!result) {
    //   return res.status(400).send("아이디 혹은 비밀번호가 잘못되었습니다.");
    // }
    const accessToken = jwt.sign(
      { id: player.LOGIN_ID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { id: player.LOGIN_ID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // refreshToken의 만료시간을 7일로 설정
    );
    await saveRefreshToken(player.LOGIN_ID, refreshToken); // refreshToken을 DB에 저장

    console.log(player);

    return res.status(200).json({ accessToken, refreshToken, player });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// 토큰 전송하기
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

// 경기 일정 등록하기
app.post("/schedule/register", async (req, res) => {
  try {
    const {
      date,
      duration,
      checkLate,
      location,
      customLocation,
      customLocationAddress,
      locationPosition,
      opponent,
      notes,
    } = req.body.adjustedFormData;

    const receivedDate = new Date(date);
    const timeZoneOffset = receivedDate.getTimezoneOffset();
    const convertedDate = new Date(
      receivedDate.getTime() - timeZoneOffset * 60 * 1000
    );

    await Matches.create({
      DATE: convertedDate,
      DURATION: duration,
      CHECK_LATE: checkLate,
      LOCATION: location,
      CUSTOM_LOCATION: customLocation,
      CUSTOM_LOCATION_ADDRESS: customLocationAddress,
      LOCATION_POSITION: locationPosition,
      OPPONENT: opponent,
      NOTES: notes,
    });

    return res.status(200).send("저장 완료");
  } catch (err) {
    console.error("에러 발생", err);
    return res.status(500).send("경기 일정 저장에 실패했습니다");
  }
});

// 월별 경기 일정 가져오기
app.get("/schedule", async (req, res) => {
  const { month } = req.query;
  try {
    const scheduleData = await Matches.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn("MONTH", Sequelize.col("date")), month),
        ],
      },
    });

    return res.status(200).send(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// 경기 세부 일정 가져오기
app.get("/schedule/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const schedule = await Matches.findOne({
      where: {
        ID: id,
      },
    });
    res.status(200).send(schedule);
  } catch (err) {
    console.error("에러 발생", err);
    res.status(500).send("경기 정보를 찾을 수 없습니다.");
  }
});

app.post("/location/position", async (req, res) => {
  try {
    const { value } = req.body;
    const result = await Locations.findOne({
      where: {
        NAME: value,
      },
    });
    res.status(200).send(result.POSITION);
  } catch (err) {
    console.error(err);
    res.status(500).send("경기장 정보를 찾을 수 없습니다.");
  }
});

app.post("/vote", async (req, res) => {
  try {
    const { matchId, playerId, attendance } = req.body;
    console.log(matchId, playerId, attendance);

    const vote = await Votes.findOne({
      where: {
        MATCH_ID: matchId,
        PLAYER_ID: playerId,
      },
    });

    if (vote) {
      vote.ATTENDANCE = attendance;
      await vote.save();
    } else {
      await Votes.create({
        MATCH_ID: matchId,
        PLAYER_ID: playerId,
        ATTENDANCE: attendance,
      });
    }
    res.status(200).send("투표 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

app.get("/voteresult/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    const voteResult = await Votes.findAll({
      where: {
        MATCH_ID: matchId,
      },
    });

    const attendanceList = [];
    const absenceList = [];
    const noVoteList = [];

    // Get all players
    const allPlayers = await Players.findAll();

    // Prepare a list of player IDs who have voted
    const voterIds = voteResult.map((vote) => vote.PLAYER_ID);

    // Filter out players who have not voted
    const noVotePlayers = allPlayers.filter(
      (player) => !voterIds.includes(player.ID)
    );

    // Add players who have not voted to the noVoteList
    noVotePlayers.forEach((player) => {
      noVoteList.push(player.KOR_NM);
    });

    await Promise.all(
      voteResult.map(async (vote) => {
        const player = await Players.findOne({
          where: {
            ID: vote.PLAYER_ID,
          },
        });

        if (vote.ATTENDANCE === "참석") {
          attendanceList.push(player.KOR_NM);
        } else {
          absenceList.push(player.KOR_NM);
        }
      })
    );

    res.status(200).send({ attendanceList, absenceList, noVoteList });
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

app.get("/vote/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    const votes = await Votes.findAll({
      where: {
        MATCH_ID: matchId,
      },
    });
    res.status(200).send(votes);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 에러");
  }
});

app.put("/schedule/:id", async (req, res) => {
  console.log(req.body);

  const { id } = req.params;
  const {
    date,
    duration,
    checkLate,
    location,
    customLocation,
    customLocationAddress,
    locationPosition,
    opponent,
    notes,
  } = req.body;

  try {
    const match = await Matches.findOne({
      where: {
        ID: id,
      },
    });

    console.log(match);
    if (!match) {
      return res.status(404).json("존재하지 않는 경기입니다.");
    }

    console.log(match);

    const receivedDate = new Date(date);
    const timeZoneOffset = receivedDate.getTimezoneOffset();
    const convertedDate = new Date(
      receivedDate.getTime() - timeZoneOffset * 60 * 1000
    );

    match.DATE = convertedDate;
    match.DURATION = duration;
    match.CHECK_LATE = checkLate;
    match.LOCATION = location;
    match.CUSTOM_LOCATION = customLocation;
    match.CUSTOM_LOCATION_ADDRESS = customLocationAddress;
    match.LOCATION_POSITION = locationPosition;
    match.OPPONENT = opponent;
    match.NOTES = notes;

    await match.save();

    res.status(200).send("저장 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

app.delete("/schedule/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    await Matches.destroy({
      where: {
        ID: id,
      },
    });
    res.status(200).send("삭제 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

initialize();

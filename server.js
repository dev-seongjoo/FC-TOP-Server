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
const Startings = require("./models/startings");
const Quarters = require("./models/quarters");
const Goals = require("./models/goals");
const Assists = require("./models/assists");
const Subs = require("./models/subs");
const Lps = require("./models/lps");
const Attendances = require("./models/attendances");

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
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: player.LOGIN_ID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    await saveRefreshToken(refreshToken);

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
app.get("/schedule/:match", async (req, res) => {
  try {
    const { match } = req.params;
    const schedule = await Matches.findOne({
      where: {
        ID: match,
      },
    });
    res.status(200).send(schedule);
  } catch (err) {
    console.error("에러 발생", err);
    res.status(500).send("경기 정보를 찾을 수 없습니다.");
  }
});

// 경기장 좌표 가져오기
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
    const { match, playerId, attendance } = req.body;
    console.log(match, playerId, attendance);

    const vote = await Votes.findOne({
      where: {
        MATCH_ID: match,
        PLAYER_ID: playerId,
      },
    });

    if (vote) {
      vote.ATTENDANCE = attendance;
      await vote.save();
    } else {
      await Votes.create({
        MATCH_ID: match,
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

app.get("/voteresult/:match", async (req, res) => {
  const { match } = req.params;

  try {
    const voteResult = await Votes.findAll({
      where: {
        MATCH_ID: match,
      },
    });

    const attendanceList = [];
    const absenceList = [];
    const noVoteList = [];

    const allPlayers = await Players.findAll();

    const voterIds = voteResult.map((vote) => vote.PLAYER_ID);

    const noVotePlayers = allPlayers.filter(
      (player) => !voterIds.includes(player.ID)
    );

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

app.get("/vote/:match", async (req, res) => {
  const { match } = req.params;

  try {
    const votes = await Votes.findAll({
      where: {
        MATCH_ID: match,
      },
    });
    res.status(200).send(votes);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 에러");
  }
});

app.put("/schedule/:match", async (req, res) => {
  const { match } = req.params;
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
    const receivedDate = new Date(date);
    const timeZoneOffset = receivedDate.getTimezoneOffset();
    const convertedDate = new Date(
      receivedDate.getTime() - timeZoneOffset * 60 * 1000
    );

    await Matches.update(
      {
        DATE: convertedDate,
        DURATION: duration,
        CHECK_LATE: checkLate,
        LOCATION: location,
        CUSTOM_LOCATION: customLocation,
        CUSTOM_LOCATION_ADDRESS: customLocationAddress,
        LOCATION_POSITION: locationPosition,
        OPPONENT: opponent,
        NOTES: notes,
      },
      {
        where: {
          ID: match,
        },
      }
    );

    res.status(200).send("저장 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

app.delete("/schedule/:match", async (req, res) => {
  const { match } = req.params;

  try {
    await Matches.destroy({
      where: {
        ID: match,
      },
    });
    res.status(200).send("삭제 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

app.post("/playerInfo", async (req, res) => {
  const { player } = req.body;
  try {
    const playerInfo = await Players.findOne({
      where: {
        KOR_NM: player,
      },
    });

    res.status(200).send(playerInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

// 선발 명단 저장하기
app.post("/starting/:match/:quarter", async (req, res) => {
  try {
    const { match, quarter } = req.params;
    const { selectedPlayer, currentFormation } = req.body;

    const [selectedQuarter, createdQuarter] = await Quarters.findOrCreate({
      where: {
        MATCH_ID: match,
        QUARTER: quarter,
      },
      defaults: {
        MATCH_ID: match,
        QUARTER: quarter,
        FORMATION: currentFormation,
      },
    });

    if (selectedQuarter) {
      await Quarters.update(
        {
          FORMATION: currentFormation,
        },
        {
          where: {
            MATCH_ID: match,
            QUARTER: quarter,
          },
        }
      );

      const newStartings = [];
      await Promise.all(
        Object.entries(selectedPlayer).map(async ([key, value]) => {
          const playerName = value[0];
          const position = value[1];

          const player = await Players.findOne({
            where: {
              KOR_NM: playerName,
            },
          });

          newStartings.push({
            PLAYER_ID: player.ID,
            POSITION: position,
            QUARTER_ID: selectedQuarter.ID,
          });
        })
      );

      await Startings.destroy({ where: { QUARTER_ID: selectedQuarter.ID } });
      await Startings.bulkCreate(newStartings);
    } else {
      await Promise.all(
        Object.entries(selectedPlayer).map(async ([key, value]) => {
          const playerName = value[0];
          const position = value[1];

          const player = await Players.findOne({
            where: {
              KOR_NM: playerName,
            },
          });

          await Startings.create({
            PLAYER_ID: player.ID,
            POSITION: position,
            QUARTER_ID: createdQuarter.ID,
          });
        })
      );
    }

    res.status(200).send("저장 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

// 쿼터별 포메이션 및 선발 명단 가져오기
app.get("/starting/:match/:quarter", async (req, res) => {
  try {
    const { match, quarter } = req.params;

    const selectedQuarter = await Quarters.findOne({
      where: {
        MATCH_ID: match,
        QUARTER: quarter,
      },
    });

    if (selectedQuarter) {
      const formation = selectedQuarter.FORMATION;
      const selectedStartings = await Startings.findAll({
        where: {
          QUARTER_ID: selectedQuarter.ID,
        },
        include: [{ model: Players, attributes: ["KOR_NM"] }],
      });
      res.status(200).json({ formation, selectedStartings });
    } else {
      res.status(404).send("선발 명단이 존재하지 않습니다.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

// 쿼터별 기록 저장하기
app.post("/record/:match/:quarter", async (req, res) => {
  try {
    const { match, quarter } = req.params;
    const { results, time } = req.body;

    const selectedQuarter = await Quarters.findOne({
      where: {
        MATCH_ID: match,
        QUARTER: quarter,
      },
    });

    await Quarters.update(
      {
        RECORD: true,
        FULL_TIME: time,
      },
      {
        where: { ID: selectedQuarter.ID },
      }
    );

    for (const result of results) {
      if (result.event === "득점") {
        const scorer = await Players.findOne({
          where: {
            KOR_NM: result.player1,
          },
        });
        const goal = await Goals.create({
          QUARTER_ID: selectedQuarter.ID,
          PLAYER_ID: scorer.ID,
          GOAL_TIME: result.time,
        });

        if (result.player2 !== "없음") {
          const assistant = await Players.findOne({
            where: {
              KOR_NM: result.player2,
            },
          });
          await Assists.create({
            GOAL_ID: goal.ID,
            PLAYER_ID: assistant.ID,
            ASSIST_TIME: result.time,
          });
        }
      } else if (result.event === "교체") {
        const subOutPlayer = await Players.findOne({
          where: {
            KOR_NM: result.player1,
          },
        });

        const subInPlayer = await Players.findOne({
          where: {
            KOR_NM: result.player2,
          },
        });

        await Promise.all([
          Subs.create({
            QUARTER_ID: selectedQuarter.ID,
            PLAYER_ID: subInPlayer.ID,
            SUB: "IN",
            SUB_TIME: result.time,
          }),
          Subs.create({
            QUARTER_ID: selectedQuarter.ID,
            PLAYER_ID: subOutPlayer.ID,
            SUB: "OUT",
            SUB_TIME: result.time,
          }),
        ]);
      } else if (result.event === "실점") {
        const LpPlayer = await Players.findOne({
          where: {
            KOR_NM: result.player1,
          },
        });

        await Lps.create({
          QUARTER_ID: selectedQuarter.ID,
          PLAYER_ID: LpPlayer.ID,
          LP_TIME: result.time,
        });
      }
    }
    res.status(200).send("저장 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

// 매치별 쿼터 기록 여부 확인하기
app.get("/record/check/:match", async (req, res) => {
  const { match } = req.params;

  try {
    const quarters = await Quarters.findAll({
      where: {
        MATCH_ID: match,
      },
    });

    res.status(200).send(quarters);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

// 쿼터 정보 가져오기
app.get("/schedule/:match/:quarter", async (req, res) => {
  const { match, quarter } = req.params;

  try {
    const quarterInfo = await Quarters.findOne({
      where: {
        MATCH_ID: match,
        QUARTER: quarter,
      },
    });
    res.status(200).send(quarterInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

// 쿼터 득점 정보 가져오기
app.get("/data/:match/:quarter", async (req, res) => {
  const { match, quarter } = req.params;

  try {
    const quarterInfo = await Quarters.findOne({
      where: {
        MATCH_ID: match,
        QUARTER: quarter,
      },
    });

    const goalInfo = await Goals.findAll({
      where: {
        QUARTER_ID: quarterInfo.ID,
      },
      include: [
        {
          model: Players,
          attributes: ["KOR_NM"],
        },
      ],
    });

    for (const goal of goalInfo) {
      const assistInfo = await Assists.findAll({
        where: {
          GOAL_ID: goal.ID,
        },
        include: [
          {
            model: Players,
            attributes: ["KOR_NM"],
          },
        ],
      });

      goal.setDataValue("assists", assistInfo);
    }

    const subInfo = await Subs.findAll({
      where: {
        QUARTER_ID: quarterInfo.ID,
      },
      include: [
        {
          model: Players,
          attributes: ["KOR_NM"],
        },
      ],
    });

    const lpInfo = await Lps.findAll({
      where: {
        QUARTER_ID: quarterInfo.ID,
      },
      include: [
        {
          model: Players,
          attributes: ["KOR_NM"],
        },
      ],
    });

    res.status(200).json({ goals: goalInfo, subs: subInfo, lps: lpInfo });
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

app.get("/player/:num", async (req, res) => {
  const { num } = req.params;

  try {
    const playerInfo = await Players.findOne({
      where: {
        ID: num,
      },
    });

    res.status(200).send(playerInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

// 득점 순위 가져오기
app.get("/goalrank", async (req, res) => {
  try {
    const results = await Goals.findAll({
      attributes: [
        "PLAYER_ID",
        [sequelize.fn("COUNT", sequelize.col("PLAYER_ID")), "goal_count"],
      ],
      include: [
        {
          model: Players,
          attributes: ["KOR_NM", "POSITION_FIRST"],
        },
      ],
      group: ["PLAYER_ID"],
      order: [
        [sequelize.literal("goal_count"), "DESC"],
        [sequelize.literal("Player.KOR_NM"), "ASC"],
      ],
      limit: 10,
    });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

// 개인별 득점,도움,실점 정보 가져오기
app.post("/personalmatchinfo", async (req, res) => {
  try {
    const { id } = req.body;

    const goal = await Goals.count({
      where: { PLAYER_ID: id },
    });

    const assist = await Assists.count({
      where: { PLAYER_ID: id },
    });

    const lp = await Lps.count({
      where: { PLAYER_ID: id },
    });

    res.status(200).json({ goal, assist, lp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "에러 발생" });
  }
});

// 모든 선수 출전 횟수 내림차순 정렬
app.get("/allmatchcount", async (req, res) => {
  try {
    const results = await Players.findAll({
      attributes: [
        "ID",
        "KOR_NM",
        "POSITION_FIRST",
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM Startings
            WHERE Startings.PLAYER_ID = Players.ID
          )`),
          "starting_count",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM Subs
            WHERE Subs.PLAYER_ID = Players.ID
              AND Subs.SUB = 'IN'
          )`),
          "sub_count",
        ],
      ],
      order: [[sequelize.literal("starting_count + sub_count"), "DESC"]],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "에러 발생" });
  }
});

// 선수별 출전 횟수 가져오기
app.post("/personalmatchcount", async (req, res) => {
  const { id } = req.body;

  try {
    const startingCount = await Startings.count({
      where: {
        PLAYER_ID: id,
      },
    });

    const subCount = await Subs.count({
      where: {
        PLAYER_ID: id,
        SUB: "IN",
      },
    });

    const matchCount = startingCount + subCount;

    res.status(200).json({ matchCount: matchCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "에러 발생" });
  }
});

// 도움 순위 가져오기
app.get("/assistrank", async (req, res) => {
  try {
    const results = await Assists.findAll({
      attributes: [
        "PLAYER_ID",
        [sequelize.fn("COUNT", sequelize.col("PLAYER_ID")), "assist_count"],
      ],
      include: [
        {
          model: Players,
          attributes: ["KOR_NM", "POSITION_FIRST"],
        },
      ],
      group: ["PLAYER_ID"],
      order: [
        [sequelize.literal("assist_count"), "DESC"],
        [sequelize.literal("Player.KOR_NM"), "ASC"],
      ],
      limit: 10,
    });
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

app.get("/locationposition/:match", async (req, res) => {
  const { match } = req.params;
  try {
    const matchData = await Matches.findOne({
      where: {
        ID: match,
      },
      attributes: ["LOCATION_POSITION"],
    });
    res.status(200).send(matchData);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

app.get("/matchstarttime/:match", async (req, res) => {
  const { match } = req.params;
  try {
    const matchData = await Matches.findOne({
      where: {
        ID: match,
      },
      attributes: ["DATE", "DURATION", "CHECK_LATE"],
    });
    res.status(200).send(matchData);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

app.post("/attendance/:match", async (req, res) => {
  const { match } = req.params;
  const { player, matchStartTime, checkLate } = req.body;

  try {
    console.log(matchStartTime, checkLate);
    const targetTime = new Date(matchStartTime);
    const currentTime = new Date();
    const timeDifferenceInMinutes = Math.floor(
      (targetTime - currentTime) / (1000 * 60)
    );

    let status;
    if (timeDifferenceInMinutes < 1) {
      status = "출석";
    } else {
      status = "지각";
    }

    await Attendances.create({
      MATCH_ID: match,
      PLAYER_ID: player,
      ATTENDANCE_TIME: currentTime,
      ATTENDANCE_STATUS: status,
    });

    res.status(200).send(status);
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

app.get("/attendance/:match/:player", async (req, res) => {
  const { match, player } = req.params;
  console.log(match, player);
  try {
    const result = await Attendances.findOne({
      where: {
        MATCH_ID: match,
        PLAYER_ID: player,
      },
    });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send("출석 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("에러 발생");
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  initialize();
});

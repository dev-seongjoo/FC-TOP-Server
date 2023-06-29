const mysql = require("mysql2");

// MySQL 연결 생성
const connection = mysql.createConnection({
  host: "localhost", // MySQL 호스트
  user: "fctop", // MySQL 사용자명
  password: "fctop", // MySQL 비밀번호
  database: "fctop", // MySQL 데이터베이스명
});

// MySQL 연결 확인
connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
});

// 나중에 연결 종료할 때 사용
// connection.end();
